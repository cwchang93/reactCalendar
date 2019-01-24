import React, { Component } from 'react';

// import tripData from '../json/data1.json'; import for testing data

class CalendarBody extends Component {
    constructor(props) {
        super(props);
        this.state = {
            travelData: null,
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
            // nowYear: props.nowYear, // Q這邊無法傳到State再從state拿
            // nowMonth: props.nowMonth,
            // nowMonthLen: null, //  可設計當更改月份時就敲countMonthLen的function重新計算現在的MonthLen
        };
    }

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
        // console.log('firstDay', firstDay);
        // console.log('emptyContent', emptyContent);
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

    // jsonArr
    filterArrFunc(jsonArr) {
        const { nowYear, nowMonth } = this.props;

        const dateArr = [];
        const newDataArr = [];
        // const uniqueDataArr = [];
        // 用regex篩選第一次=> 把當月資料篩選出來
        const yearMonthSring = String(
            `${nowYear}/${nowMonth.length == 1 ? '0' : ''}${nowMonth}/`
        );
        // const validateYearMonth = new RegExp(`${yearMonthSring}\d{2}`); // /2017\/06/
        const validateYearMonth = new RegExp(`^${yearMonthSring}`); // /^2017\/06//

        // console.log('validateYearMonth5566');
        // console.log(validateYearMonth);
        if (jsonArr.length) {
            // 1. 第一支篩選出當年當月的資料
            for (let i = 0; i < jsonArr.length; i++) {
                if (validateYearMonth.test(jsonArr[i].date)) {
                    dateArr.push(jsonArr[i]);
                }
            }
            // return dateArr;  // 此資料是有重複的date資料
            // 2. 第二支: 比對相同日期可報名優先status
            // console.log('dateArrLen', dateArrLen);
            // const newDataArr = [];

            // 先把不重複的拿出來;
            const newArr = dateArr.filter((ele, i, dateArr) => {
                return dateArr.map((item) => item.date).indexOf(ele.date) !== i;
            });

            // 這邊的let uniqueDataArr 會被自動改成 const;
            const uniqueDataArr = dateArr.filter(
                (ele) => newArr.map((ele) => ele.date).indexOf(ele.date) === -1
            );

            console.log('完全不重複的資料:uniqueDataArr');
            console.log(uniqueDataArr);

            const dateArrLen = dateArr.length; // 分開寫效能比較好
            for (let j = 0; j < dateArrLen; j++) {
                for (let k = j + 1; k < dateArrLen; k++) {
                    const dateRecordArr = [];
                    if (dateArr[j].date === dateArr[k].date) {
                        // 日期相等時
                        // A. 比對狀態是否為可報名

                        dateRecordArr.push(dateArr[k].date);
                        if (dateArr[j].status !== '報名' && dateArr[k].status === '報名') {
                            newDataArr.push(dateArr[k]);
                        } else if (
                            dateArr[j].status === '報名' &&
              dateArr[k].status !== '報名'
                        ) {
                            newDataArr.push(dateArr[j]);
                        } else {
                            // B. 比對是否保證出團
                            if (
                                dateArr[j].guaranteed === true &&
                dateArr[k].guaranteed === false
                            ) {
                                newDataArr.push(dateArr[j]);
                            } else if (
                                dateArr[j].guaranteed === false &&
                dateArr[k].guaranteed === true
                            ) {
                                newDataArr.push(dateArr[k]);
                            } else {
                                // 是否出團如果都一樣  C. 比價格
                                if (dateArr[j].price < dateArr[k].price) {
                                    newDataArr.push(dateArr[j]);
                                } else {
                                    newDataArr.push(dateArr[k]);
                                }
                            }

                            // if (dateArr[j].guaranteed || dateArr[k].guaranteed) {  // j false k true時
                            //     newDataArr.push(dateArr[k]);
                            // }
                        }
                    } else {
                        // 如果沒有重複的話再放進去
                    }
                }
            }
            // console.log('newDataArrLOL');
            // console.log(newDataArr);

            // 排序資料 依照日期

            // 補上空值

            // render 剩下的資料

            // this.setState({ newDataArr: newDataArr });
        }
        console.log('有重複的資料 newDataArr');
        console.log(newDataArr);

        const sortedDataArr = newDataArr.sort((a, b) => {
            return Date.parse(a.date) - Date.parse(b.date);
        });

        // const sortedDataArr = reverseByKey(newDataArr, 'date');
        console.log('newDataArrCC');
        console.log(newDataArr);
        console.log('sortedDataArr777');
        console.log(sortedDataArr);

        return sortedDataArr;
    // console.log(newDataArr);
    // return newDataArr;
    }

    // reverseByKey(array, key) {
    //     return array.reverse(function(a, b) {
    //         const x = a[key];
    //         const y = b[key];
    //         return x < y ? -1 : x > y ? 1 : 0;
    //     });
    // }

    renderDayContent() {
        const dayContentArr = [];
        const { nowYear, nowMonth } = this.props;
        // const { newDataArr } = this.state;
        const nowMonthLen = new Date(nowYear, nowMonth, 0).getDate();
        const newDataForCompare = this.filterArrFunc(this.state.travelData);
        if (newDataForCompare.length) {
            console.log('RENDERDAYCON:newDtArr');
            console.log(newDataForCompare);
            for (let j = 0; j < nowMonthLen; j++) {
                // if (idDate === this.filterArrFunc[j].date) {
                // console.log('newDataForCompare:789 ');
                // console.log(newDataForCompare);
                const idDate = `${nowYear}/${
                    nowMonth.length == 1 ? '0' : ''
                }${nowMonth}/${
                    j + 1 < 10 ? '0' : '' // 個位數時加0
                }${j + 1}`;
                // console.log(idDate);

                dayContentArr.push(
                    <div className="day">
                        <div className="generalinfo" />
                        <span className="daynum"
id={idDate}>
                            {j + 1}{' '}
                        </span>

                        {this.matchDay(idDate, newDataForCompare)}
                    </div>
                );
            }
        }
        return dayContentArr;
    }
    matchDay(idDate, compareData) {
        const newDataContainer = [];
        for (let k = 0; k < compareData.length; k++) {
            // this.aaaa(idDate, dayContentArr);
            if (idDate === compareData[k].date) {
                // dayContentArr.push(
                newDataContainer.push(
                    <React.Fragment>
                        <span
                            className="guaranteed"
                            display={{ idDate } === compareData[k].guaranteed ? '' : 'none'}
                        >
              成團
                        </span>
                        <div className="details">
                            <span className="status">{compareData[k].status}</span>
                            <span className="sell">
                可賣: {compareData[k].availableVancancy}
                            </span>
                            <span className="group">團位: {compareData[k].totalVacnacy}</span>
                            <span className="price">${compareData[k].price}</span>
                        </div>
                    </React.Fragment>
                );
                // console.log('newDatmatchDayA', this.state.compareData);
                // );
            }
        }

        return newDataContainer;
    }
    render() {
        const { travelData, weekDay, newDataArr } = this.state;
        const { nowYear, nowMonth } = this.props;
        console.log('render: ', nowYear);

        if (travelData) {
            return (
                <React.Fragment>
                    <div className="bodycalendar">
                        <div className="weekcontainer">
                            {weekDay.map((wkDay, i) => {
                                return <div key={i}> {wkDay} </div>;
                            })}
                        </div>
                        <div className="daycontainer">
                            {/* {this.renderEmptyDays()} */}
                            {this.renderEmptyDays().map((arr, i) => {
                                return <div key={i}
className="day disabled" />;
                            })}
                            {this.renderDayContent()}
                        </div>
                    </div>
                </React.Fragment>
            );
        } else {
            return <div> Nothing</div>;
        }
    }
}

export default CalendarBody;
