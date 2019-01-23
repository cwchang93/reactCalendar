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
                    {
                        travelData: travelData,
                    },
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
        console.log('firstDay', firstDay);
        console.log('emptyContent', emptyContent);
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
        // 用regex篩選第一次=> 把當月資料篩選出來
        const yearMonthSring = String(
            `${nowYear}/${nowMonth.length == 1 ? '0' : ''}${nowMonth}/`
        );
        // const validateYearMonth = new RegExp(`${yearMonthSring}\d{2}`); // /2017\/06/
        const validateYearMonth = new RegExp(`^${yearMonthSring}`); // /^2017\/06//

        console.log('validateYearMonth5566');
        console.log(validateYearMonth);
        // 1. 第一支篩選出當年當月的資料
        for (let i = 0; i < jsonArr.length; i++) {
            if (validateYearMonth.test(jsonArr[i].date)) {
                dateArr.push(jsonArr[i]);
            }
        }
        console.log('fffdateArr');
        console.log(dateArr);
        // return dateArr;  // 此資料是有重複的date資料
        // 2. 第二支: 比對相同日期可報名優先status
        const dateArrLen = dateArr.length; // 分開寫效能比較好
        console.log('dateArrLen', dateArrLen);
        // const newDataArr = [];

        // 先把不重複的拿出來;
        const newArr = dateArr.filter((ele, i, dateArr) => {
            return dateArr.map((item) => item.date).indexOf(ele.date) !== i;
        });
        const newDataArr = dateArr.filter(
            (ele) => newArr.map((ele) => ele.date).indexOf(ele.date) === -1
        );

        // console.log('uniqueValArr');
        // console.log(uniqueValArr);

        for (let j = 0; j < dateArrLen; j++) {
            for (let k = j + 1; k < dateArrLen; k++) {
                if (dateArr[j].date === dateArr[k].date) {
                    // 日期相等時
                    // A. 比對狀態是否為可報名
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
                    // let valueArr = newDateArr.map(
                    //     (item) => {
                    //         return item.date;
                    //     }
                    //     );
                    // let isDuplicate = valueArr.some(
                    //     (item,idx) => {
                    //         return valueArr.indexOf(item) != idx
                    //     }
                    // })
                    // 如果newDataArr沒有重複的話 => 放進來
                    // if (newDataArr.includes(dateArr[k])) {
                    // newDataArr.push(dateArr[k]);
                    // }
                }
            }
        }
        console.log('newDataArrLOL');
        console.log(newDataArr);

        // 排序資料 依照日期

        // 補上空值

        // render 剩下的資料

        this.setState({ newDataArr: newDataArr });

        return newDataArr;
    }

    renderDayContent() {
        const dayContentArr = [];
        const { nowYear, nowMonth } = this.props;
        const { newDataArr } = this.state;
        const nowMonthLen = new Date(nowYear, nowMonth, 0).getDate();
        // const newDataArr = this.filterArrFunc(this.state.travelData);
        console.log('newDtArr');
        console.log(newDataArr);
        for (let j = 0; j < nowMonthLen; j++) {
            // if (idDate === this.filterArrFunc[j].date) {
            console.log('newDataArrAAAA');
            // console.log(newDataArr()[j].date);
            const idDate = `${nowYear}/${
                nowMonth.length == 1 ? '0' : ''
            }${nowMonth}/${
                j + 1 < 10 ? '0' : '' // 個位數時加0
            }${j + 1}`;
            console.log(idDate);

            dayContentArr.push(
                <div className="day">
                    <div className="generalinfo" />
                    <span className="daynum"
id={idDate}>
                        {j + 1}{' '}
                    </span>

                    <span className="guaranteed">
                        {/* {{ idDate } == newDataArr[j].date ? newDataArr[j].guaranteed : ''} */}
                    </span>
                    <div className="details">
                        <span
                            className="status"
                            id={newDataArr[j].price}
                            // display={{ idDate } === newDataArr[j].date ? '' : 'none'}
                        >
                            {newDataArr[j].status}
                        </span>
                        <span className="sell">可賣:</span>
                        <span className="group">團位:</span>
                        <span className="price">$</span>
                    </div>
                </div>
                // console.log('newDataAAA', this.state.newDataArr);
            );
        }

        return dayContentArr;
    }

    render() {
        const { travelData, weekDay, newDataArr } = this.state;
        const { nowYear, nowMonth } = this.props;
        console.log('render: ', nowYear);
        // const { nowYear, nowMonth } = this.state;
        // console.log(this.props.path);
        // console.log(weekDay);
        // console.log('55688');
        // console.log('this.props.nowYear8D');
        // console.log(this.props.nowYear);
        // console.log('this.props.nowMonth8D');
        // console.log(this.props.nowMonth);
        // this.countMonthLen(nowYear, nowMonth);
        //   console.log(weekDay);

        if (travelData) {
            console.log('this.state.newDataArr');
            // console.log(newDataArr);
            // console.log('typeof nowMonth');
            // console.log(typeof nowMonth);
            // console.log('9998DtripData', travelData);
            // this.filterArrFunc(travelData);

            console.log('nowMonth.length');
            console.log(nowMonth.length);

            // const renderDayContent = this.renderRealDays().map((Arr, i) => {
            //     console.log('newDataArr7777777');
            //     console.log(newDataArr);
            //     const idDate = `${nowYear}/${
            //         nowMonth.length == 1 ? '0' : ''
            //     }${nowMonth}/${
            //         i + 1 < 10 ? '0' : '' // 個位數時加0
            //     }${i + 1}`;

            //     //                 for (let j = 0; j < newDataArr; j++) {
            //     //                     if (idDate === newDataArr[j].date) {
            //     //                         return (
            //     //                             <div id={idDate}
            //     // className="day">
            //     //                                 <div className="generalinfo" />
            //     //                                 <span className="daynum">{i + 1}</span>

            //     //                                 <span className="guaranteed">成團</span>
            //     //                                 <div className="details">
            //     //                                     <span className="status">status</span>
            //     //                                     <span className="sell">可賣:</span>
            //     //                                     <span className="group">團位:</span>
            //     //                                     <span className="price">$</span>
            //     //                                 </div>
            //     //                             </div>
            //     //                         );
            //     //                     }
            //     //                 }

            //     // newDataArr.map((ele) => console.log(ele.date));
            // });

            // const renderMatchDay = this.newDataArr.map
            //             <span className="guaranteed">成團</span>
            //             <div className="details">
            //                 <span className="status">status</span>
            //                 <span className="sell">可賣:</span>
            //                 <span className="group">團位:</span>
            //                 <span className="price">$</span>
            //             </div>

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
                            {/* <div
                                className="day"
                                // onClick={() => {
                                //     console.log(this.props.selectedDate);
                                // }}
                            >
                                <div className="generalinfo">
                                    <span className="daynum">12</span>
                                    <span className="guaranteed">成團</span>
                                </div>
                                <div className="details">
                                    <span className="status">status</span>
                                    <span className="sell">sell</span>
                                    <span className="group">group</span>
                                    <span className="price">price</span>
                                </div>
                            </div> */}
                            {/* <div className="day">hithere2</div>
                            <div className="day">hithere3</div>
                            <div className="day">hithere4</div>
                            <div className="day">hithere5</div>
                            <div className="day">hithere6</div>
                            <div className="day">hithere7</div>
                            <div className="day">hithere8</div> */}
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
