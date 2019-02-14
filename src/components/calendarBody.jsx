import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import tripData from '../json/data1.json'; import for testing data

class CalendarBody extends Component {
    constructor(props) {
        super(props);
        this.state = {
            travelData: null,
            travelDataInput: null,
            weekDay: [
                '星期日',
                '星期一',
                '星期二',
                '星期三',
                '星期四',
                '星期五',
                '星期六',
            ],
            newDataArr: null,
            clickClass: null,
            toggleId: null,

            // nowYear: props.nowYear, // Q這邊無法傳到State再從state拿
            // nowMonth: props.nowMonth,
            // nowMonthLen: null, //  可設計當更改月份時就敲countMonthLen的function重新計算現在的MonthLen
        };
    }

    static propTypes = {
        text: PropTypes.string,
        dataSource: PropTypes.string,
        initYearMonth: PropTypes.string,
        dataKeySetting: PropTypes.object,
        guaranteed: PropTypes.string,
        status: PropTypes.string,
        price: PropTypes.string,
        nowYear: PropTypes.string,
        nowMonth: PropTypes.string,
        path: PropTypes.string,
    };


    componentDidMount() {
        this.getData(this.props.path);
    // this.countMonthLen(this.props.nowYear, this.props.nowMonth);
    }

    // 解決取不到父值變數的func
    // componentDidUpdate(prevProps, prevState) {
    //     if (prevProps.nowYear !== this.props.nowYear) {
    //         this.updateNowYear();
    //     }
    // }

    // updateNowYear() {
    //     this.setState({ nowYear: this.props.nowYear });
    // }

    getData(path) {
        fetch(path)
            .then((response) => {
                return response.json();
            })
            .then((travelData) =>
                this.setState(
                    (prevState) => ({
                        travelData: travelData,
                    }),
                    () => {
                        this.filterArrFunc(travelData);
                    }
                )
            )
            .catch((error) => console.log('parsing failed', error));
    }

    countMonthLen(year, month) {
    // 會return 該月的天數
    // Use 1 for January, 2 for February, etc.
    // console.log(new Date(year, month, 0).getDate());
        const nowMonthLen = new Date(year, month, 0).getDate();
        this.setState({
            nowMonthLen: nowMonthLen,
        });
        return new Date(year, month, 0).getDate();
    }

    renderEmptyDays() {
    //  const { nowYear, nowMonth } = this.state;
        const { nowYear, nowMonth } = this.props;
        const currentDate = new Date(nowYear, String(parseInt(nowMonth) - 1), 1);
        const firstDay = currentDate.getDay(); // 取第一天

        const emptyContent = [];
        for (let i = 0; i < firstDay; i++) {
            emptyContent.push(i);
        }
        return emptyContent;
    }

    renderRealDays() {
        const { nowYear, nowMonth } = this.props;
        const nowMonthLen = new Date(nowYear, nowMonth, 0).getDate();
        const dayContent = [];
        for (let i = 0; i < nowMonthLen; i++) {
            dayContent.push(i);
        }
        return dayContent;
    }

    renderRestEmptyDays() {
        //  const { nowYear, nowMonth } = this.state;
        const { nowYear, nowMonth } = this.props;
        const currentDate = new Date(nowYear, String(parseInt(nowMonth) - 1), 1);
        const firstDay = currentDate.getDay(); // 取第一天
        const nowMonthLen = new Date(nowYear, nowMonth, 0).getDate();
        const restDay = 42 - firstDay - nowMonthLen;
        const newEmptyContent = [];
        for (let i = 0; i < restDay; i++) {
            newEmptyContent.push(i);
        }
        return newEmptyContent;
    }

    // jsonArr
    filterArrFunc(jsonArr) {
        const { nowYear, nowMonth } = this.props;
        const { guaranteed, status, price } = this.props.dataKeySetting;
        const dateArr = [];
        const newDataArr = [];
        // const uniqueDataArr = [];
        // 用regex篩選第一次=> 把當月資料篩選出來
        const yearMonthSring = String(
            `${nowYear}/${nowMonth.length == 1 ? '0' : ''}${nowMonth}/`
        );
        // const validateYearMonth = new RegExp(`${yearMonthSring}\d{2}`); // /2017\/06/
        const validateYearMonth = new RegExp(`^${yearMonthSring}`); // /^2017\/06//

        // if (jsonArr.length) {
        // 1. 第一支篩選出當年當月的資料
        for (let i = 0; i < jsonArr.length; i++) {
            if (validateYearMonth.test(jsonArr[i].date)) {
                dateArr.push(jsonArr[i]);
            }
        }
        // return dateArr;  // 此資料是有重複的date資料
        // 2. 第二支: 比對相同日期可報名優先status

        // 先把不重複的拿出來;
        const newArr = dateArr.filter((ele, i, dateArr) => {
            return dateArr.map((item) => item.date).indexOf(ele.date) !== i;
        });

        // 這邊的let uniqueDataArr 會被自動改成 const;
        const uniqueDataArr = dateArr.filter(
            (ele) => newArr.map((ele) => ele.date).indexOf(ele.date) === -1
        );


        const dateArrLen = dateArr.length; // 分開寫效能比較好

        for (let j = 0; j < dateArrLen; j++) {
            for (let k = j + 1; k < dateArrLen; k++) {
                if (dateArr[j].date === dateArr[k].date) {
                    // 日期相等時
                    // A. 比對狀態是否為可報名
                    // key: push要固定push k的或j的
                    // dateRecordArr.push(dateArr[k].date);
                    let recordStatus;
                    let recordGuaranteed;
                    if (dateArr[j].status !== '報名' && dateArr[k].status === '報名') {
                        newDataArr.push(dateArr[k]);
                        recordStatus = dateArr[k].status;
                    } else {
                        // B. 比對是否保證出團
                        if (
                            dateArr[j].guaranteed === true &&
                            dateArr[k].guaranteed === false
                            && dateArr[k].status === recordStatus
                        ) {
                            newDataArr.push(dateArr[j]);
                        } else {
                            // 是否出團如果都一樣  C. 比價格
                            if (dateArr[j].price > dateArr[k].price && dateArr[k].status === recordStatus
                                && recordGuaranteed === dateArr[k].guaranteed
                            ) {
                                newDataArr.push(dateArr[k]);
                            } else {
                            }
                        }
                    }
                } else {
                    // 如果沒有重複的話再放進去
                }
            }
        }

        // 排序資料 依照日期

        // 補上空值

        // render 剩下的資料

        const filterNewDataArr = newDataArr.filter(function(element, index, arr) {
            return arr.indexOf(element) === index;
        });
        // console.log(filterNewDataArr);

        const sortedDataArr = filterNewDataArr.sort((a, b) => {
            return Date.parse(a.date) - Date.parse(b.date);
        });


        const finalSortedArr = uniqueDataArr.concat(sortedDataArr);
        // return sortedDataArr;
        console.log('最終篩選: finalSortedArr');
        console.log(finalSortedArr);
        return finalSortedArr;
    }


    // 190214 inputData

    calendarBodyInput = (newData) => {
        const { travelData } = this.state;
        console.log('newData印出來了', newData);
        console.log(typeof(newData));
        console.log('originaltripData', travelData );
        // const processingTravelData = travelData;
        const newTravelData = travelData;
        for ( let i = 0; i < newData.length; i++ ) {
            console.log('newData[i]');
            console.log(newData[i]);
            newTravelData.unshift(newData[i]); // 這邊不能另外賦值，否則會變數字
            console.log('newTravelData', newTravelData);
        }

        this.setState({
            travelDataInput: newTravelData,
        }, ()=> {
            // this.calendarBodyReset();
        });
    }

    calendarBodyReset= () => {
        const { travelData } = this.state;
        console.log('new travelData');
        console.log(travelData);
        console.log('typeof travelData');
        console.log(typeof travelData);
        // this.filterArrFunc(travelData);
    }


    renderDayContent() {
        const addBorder = this.state.clickClass;
        const dayContentArr = [];
        const { nowYear, nowMonth, mode } = this.props;
        const { toggleId } = this.state;
        const nowMonthLen = new Date(nowYear, nowMonth, 0).getDate();
        const newDataForCompare = this.filterArrFunc(this.state.travelData);
        if (newDataForCompare.length) {
            console.log('RENDERDAYCON:newDtArr');
            console.log(newDataForCompare);
            for (let j = 0; j < nowMonthLen; j++) {
                const idDate = `${nowYear}/${
                    nowMonth.length == 1 ? '0' : ''
                }${nowMonth}/${
                    j + 1 < 10 ? '0' : '' // 個位數時加0
                }${j + 1}`;

                if (mode === 'bodycalendar_month_mode') {
                    console.log('MonthCalendarArr');
                    dayContentArr.push(
                        <div className={ j + 1 == toggleId ? ' day clicked' : 'day'}
                            id={j + 1}
                            onClick={this.wasClicked}>

                            <div className="generalinfo" />
                            <span className="daynum"
                                id={idDate}>
                                {j + 1}{' '}
                            </span>

                            {this.matchDay(idDate, newDataForCompare)}
                        </div>
                    );
                } else {
                    console.log('ListCalendarwas called');
                    dayContentArr.push(
                        <React.Fragment>

                            {this.matchDayListMode(idDate, newDataForCompare, j)}
                        </React.Fragment>

                    );
                }
            }
        }
        return dayContentArr;
    }


    matchDay(idDate, compareData) {
        const newDataContainer = [];
        const { guaranteed, status, available, price, total } = this.props.dataKeySetting;
        const { clickClass } = this.state;
        for (let k = 0; k < compareData.length; k++) {
            // console.log('compareData matchDay');
            // console.log(compareData);
            // console.log('this.props.dataKeySetting in matchDay');
            // console.log(this.props.dataKeySetting.guaranteed);
            if (idDate === compareData[k].date) {
                // 依照狀態判斷並變更status的的className
                let classStatus = '';
                if (compareData[k][status] === '報名' || compareData[k][status] === '預定' || compareData[k][status] === '後補') {
                    classStatus = 'status1';
                } else {
                    classStatus = 'status2';
                }

                newDataContainer.push(
                    <React.Fragment>
                        {/* <div onClick={this.addBorder}> */}
                        {/* <div onClick={this.wasClicked} */}
                        {/* className={clickClass}> */}

                        <span
                            className="guaranteed"
                            style={{
                                display: compareData[k][guaranteed] === true ? '' : 'none',
                            }}
                        >
              成團
                        </span>
                        <div className="details">
                            <span className={classStatus}>{compareData[k][status]}</span>
                            <span className="sell">
                可賣: {compareData[k][available]}
                            </span>
                            <span className="group">團位: {compareData[k][total]}</span>
                            <span className="price">${compareData[k][price].toLocaleString('en-IN')}</span>
                        </div>
                        {/* </div> */}


                    </React.Fragment>
                );
            }
        }

        return newDataContainer;
    }


    renderWeekDay = (idDate) => { // ListMonde裡面render星期的function
        // const { nowYear, nowMonth } = this.state;
        const renderDate = idDate.substr(idDate.length - 2, 2);
        console.log('dateinrender');
        console.log(renderDate);
        // console.log('idDate in renderWeekDay');
        // console.log(idDate);
        // console.log('nowYearinrender');
        // console.log(nowYear);
        // console.log('nowMonthinrender');
        // console.log(nowMonth);
        // if (nowYear) {
        const renderYear = idDate.substr(0, 4);
        const renderMonth = idDate.substr(5, 2);
        // console.log('renderYear999');
        // console.log(renderYear);
        // console.log('renderMonth999');
        // console.log(renderMonth);
        // console.log(typeof(renderMonth));
        const renderWDay = new Date(renderYear, parseInt(renderMonth) - 1, renderDate );
        // console.log('renderWDay was called');
        console.log('renderWDay.getDay()8787');
        console.log(renderWDay.getDay());
        const renderNewDay = renderWDay.getDay();

        let renderFinalWeekDay;
        if (renderNewDay == 1) {
            renderFinalWeekDay = '星期一';
        } else if (renderNewDay == 2) {
            renderFinalWeekDay = '星期二';
        } else if (renderNewDay == 3) {
            renderFinalWeekDay = '星期三';
        } else if (renderNewDay == 4) {
            renderFinalWeekDay = '星期四';
        } else if (renderNewDay == 5) {
            renderFinalWeekDay = '星期五';
        } else if (renderNewDay == 6) {
            renderFinalWeekDay = '星期六';
        } else {
            renderFinalWeekDay = '星期日';
        }
        return renderFinalWeekDay;
    }

    showWeekDay= () => {
        const showDay = this.renderWeekDay();
        console.log('showDay was called');
        console.log(showDay);
    }

    // listMode
    matchDayListMode(idDate, compareData, j) {
        const newDataContainer = [];
        const { guaranteed, status, available, price, total } = this.props.dataKeySetting;
        const { toggleId, nowYear, nowMonth } = this.state;
        for (let k = 0; k < compareData.length; k++) {
            if (idDate === compareData[k].date) {
                // 依照狀態判斷並變更status的的className
                let classStatus = '';
                if (compareData[k][status] === '報名' || compareData[k][status] === '預定' || compareData[k][status] === '後補') {
                    classStatus = 'status1';
                } else {
                    classStatus = 'status2';
                }


                newDataContainer.push(
                    <React.Fragment>
                        <div className={ j + 1 == toggleId ? ' day clicked' : 'day'}
                        // <div className={ 'day'}
                            id={j + 1}
                            onClick={this.wasClicked}>

                            <div className="generalinfo" />
                            <div className="dayweekblock">
                                <span className="daynum"
                                    id={idDate}>
                                    {j + 1}{' '}
                                </span>
                                <span className="wkDayList">{this.renderWeekDay(idDate)}</span>
                            </div>

                            <span
                                className="guaranteed"
                                style={{
                                    display: compareData[k][guaranteed] === true ? '' : 'none',
                                }}
                            >
              成團
                            </span>
                            <div className="details">
                                <span className={classStatus}>{compareData[k][status]}</span>
                                <span className="sell">
                可賣: {compareData[k][available]}
                                </span>
                                <span className="group">團位: {compareData[k][total]}</span>
                                <span className="price">${compareData[k][price].toLocaleString('en-IN')}</span>
                            </div>
                        </div>


                    </React.Fragment>
                );
            }
        }

        return newDataContainer;
    }

    wasClicked = (e) => {
        // console.log(e.currentTarget.getAttribute('id'));
        console.log(e.currentTarget.getAttribute('id'));
        // if (e.currentTarget)
        this.setState({
            toggleId: e.currentTarget.getAttribute('id'),
        },
        );
    }

    printToggleId = () => {
        console.log('toggleIdWasCalled');
        console.log(this.state.toggleId);
    }


    render() {
        const { travelData, weekDay, newDataArr } = this.state;
        const { nowYear, nowMonth } = this.props;

        if (travelData) {
            return (
                <div className={this.props.mode}>
                    <div className="weekcontainer">
                        {weekDay.map((wkDay, i) => {
                            return <div key={i}> {wkDay} </div>;
                        })}
                    </div>
                    <div className="daycontainer">
                        {this.renderEmptyDays().map((arr, i) => {
                            return <div key={i}
                                className="day disabled" />;
                        })}
                        {this.renderDayContent()}
                        {this.renderRestEmptyDays().map((arr, i) => {
                            return <div key={i}
                                className="day disabled" />;
                        })}
                    </div>
                </div>
            );
        } else {
            return <div> Nothing</div>;
        }
    }
}

export default CalendarBody;
