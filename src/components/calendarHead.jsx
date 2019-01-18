import React, {Component} from 'react';
// import ReactDOM from 'react-dom';
// 待處理，使用者亂輸入變數時的validation

class CalendarHead extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //   isLoading: false,
            initYearMonth: this.props.initYearMonth,
            travelDataHead: null,
            oldestMonth: '',
            oldestYear: '',
            newestMonth: '',
            newestYear: '',
            renderYearArr: null,
            renderMonthArr: null, // 之後用map轉出三個
            initYear: null,
            initMonthAfterZero: null,
            preInitYear: null,
            afterInitYear: null,
        };
    }

    renderDataFunc(jsonData, jsonKey) {
        const newArr = [];
        for (let i = 0; i < jsonData.length; i++) {
            newArr.push(jsonData[i][jsonKey]);
            // console.log(newArr);
        }
        console.log(newArr);
        return newArr;
    }

    sortedDateFunc(unsortedArr) {
    // sort=> 整理array排序後

        const sortedArr = unsortedArr.sort();
        console.log(sortedArr);
        const oldestMonth = sortedArr[0].substr(5, 2); // 找出整理後array的第一個的月
        const oldestYear = sortedArr[0].substr(0, 4); // 找出整理後array的第一個的年
        const newestMonth = sortedArr[sortedArr.length - 1].substr(5, 2); // 找出整理後array的第一個月
        const newestYear = sortedArr[sortedArr.length - 1].substr(0, 4); // 找出整理後array的第一個年
        console.log('test in sortedDateFunc');
        console.log('oldestMonth', oldestMonth); // 最左邊月份
        console.log('oldestYear', oldestYear); // 最左邊月份
        console.log('newestMonth', newestMonth); // 最右邊月份
        console.log('newestYear', newestYear); // 最右邊月份
    // this.setState({  這邊若setState會報錯
    //    oldestMonth:oldestMonth,
    //    oldestYear:oldestYear,
    //     newestMonth: newestMonth,
    //     newestYear: newestYear,
    // });
    }

    handleRenderYearMonthArr() {
        const {initYearMonth} = this.state;
        // 把initYear跟Month分開
        const initYearMonthLen = initYearMonth.length;
        const initYear = initYearMonth.substr(0, 4);
        const initMonth = initYearMonth.substr(initYearMonthLen - 2, 2); // 只取後面兩個
        let initMonthAfterZero;
        // 如果initMonth第一個數字是0 ==>只取後面的數字

        // 全域變數與區域變數問題待研究

        if (initMonth[0] == '0') {
            //   initMonth = init[1];  // Uncaught Error: "initMonth" is read-only
            initMonthAfterZero = initMonth[1];
            // console.log(initMonthAfterZero);
        } else {
            initMonthAfterZero = initMonth;
        }

        console.log(initMonthAfterZero);
        console.log(initYear);

        let preInitYear;
        let afterInitYear;
        if (initMonthAfterZero === '1') {
            console.log('initMonthAfterZero===1');
            // console.log('initMonthAfterZero', initMonthAfterZero);
            preInitYear = String(parseInt(initYear) - 1);
            afterInitYear = initYear;
            console.log(preInitYear);
        } else if (initMonthAfterZero === '12') {
            preInitYear = String(parseInt(initYear) - 1);

            afterInitYear = initYear;
            // preInitYear = initYear;
        } else {
            preInitYear = initYear;
            afterInitYear = initYear;
        }

        const renderYearArr = [preInitYear, initYear, afterInitYear];

        // 放進要render(map)的arr
        // 待處理:  如果輸入的月份是01 => premonth變12
        let prevInitMonth;
        if (initMonthAfterZero === '1') {
            prevInitMonth = '12';
        } else {
            prevInitMonth = String(parseInt(initMonthAfterZero) - 1);
        }
        console.log('prevInitMonth');
        console.log(prevInitMonth);

        let afterInitMonth;
        if (initMonthAfterZero === '12') {
            afterInitMonth = '1';
        } else {
            afterInitMonth = String(parseInt(initMonthAfterZero) + 1);
        }

        console.log('afterInitMonth');
        console.log(afterInitMonth);
        const renderMonthArr = [prevInitMonth, initMonthAfterZero, afterInitMonth];

        this.setState({
            renderMonthArr: renderMonthArr,
            renderYearArr: renderYearArr,
            initYear: initYear,
            initMonthAfterZero: initMonthAfterZero,
            preInitYear,
            afterInitYear,
        });

    // initYear,
    }

    handleSlideClick(leftOrRight) {
        const {
            initYear,
            initMonthAfterZero,
            preInitYear,
            afterInitYear,
        } = this.state;
        // 把initYear跟Month分開
        // const initYearMonthLen = initYearMonth.length;
        // const initYear = initYearMonth.substr(0, 4);

        // const initMonth = initYearMonth.substr(initYearMonthLen - 2, 2); // 只取後面兩個
        // let initMonthAfterZero;
        // 如果initMonth第一個數字是0 ==>只取後面的數字

        // 全域變數與區域變數問題待研究
        console.log('this is left');
        if (leftOrRight == 'left') {
            console.log('initYear, initMonthAfterZero, preInitYear, afterInitYear');
            console.log(initYear, initMonthAfterZero, preInitYear, afterInitYear);
        }

        // if (initMonth[0] == '0') {
        //     //   initMonth = init[1];  // Uncaught Error: "initMonth" is read-only
        //     initMonthAfterZero = initMonth[1];
        //     // console.log(initMonthAfterZero);
        // } else {
        //     initMonthAfterZero = initMonth;
        // }

        // console.log(initMonthAfterZero);
        // console.log(initYear);

        // if (initMonthAfterZero === '1') {
        //     console.log('initMonthAfterZero===1');
        //     // console.log('initMonthAfterZero', initMonthAfterZero);
        //     preInitYear = String(parseInt(initYear) - 1);
        //     afterInitYear = initYear;
        //     console.log(preInitYear);
        // } else if (initMonthAfterZero === '12') {
        //     preInitYear = String(parseInt(initYear) + 1);
        //     // preInitYear = initYear;
        //     afterInitYear = initYear;
        // } else {
        //     preInitYear = initYear;
        //     afterInitYear = initYear;
        // }

        // const renderYearArr = [preInitYear, initYear, afterInitYear];

        // // 放進要render(map)的arr
        // // 待處理:  如果輸入的月份是01 => premonth變12
        // let prevInitMonth;
        // if (initMonthAfterZero === '1') {
        //     prevInitMonth = '12';
        // } else {
        //     prevInitMonth = String(parseInt(initMonthAfterZero) - 1);
        // }
        // console.log('prevInitMonth');
        // console.log(prevInitMonth);

        // let afterInitMonth;
        // if (initMonthAfterZero === '12') {
        //     afterInitMonth = '1';
        // } else {
        //     afterInitMonth = String(parseInt(initMonthAfterZero) + 1);
        // }

        // console.log('afterInitMonth');
        // console.log(afterInitMonth);
        // const renderMonthArr = [prevInitMonth, initMonthAfterZero, afterInitMonth];

        // this.setState({
        //     renderMonthArr: renderMonthArr,
        //     renderYearArr: renderYearArr,
        //     initYear: initYear,
        //     initMonthAfterZero:initMonthAfterZero,

    // });
    }

    getData(path) {
        fetch(path)
            .then((response) => {
                return response.json();
            })
            .then((travelDataHead) =>
                this.setState({
                    travelDataHead: travelDataHead,
                })
            )
            .catch((error) => console.log('parsing failed', error));
    }

    componentDidMount() {
        const {travelDataHead} = this.state;
        this.handleRenderYearMonthArr();
        this.getData(this.props.path);

    // this.sortedDateFunc(this.renderDataFunc(travelDataHead, 'date'));
    }

    render() {
        const {
            travelDataHead,
            oldestMonth,
            newestMonth,
            renderYearArr,
            renderMonthArr,
            initYear,
        } = this.state;
        if (travelDataHead) {
            // this.renderStateFunc();
            console.log('this.props.initialYearMonth');
            console.log(this.state.initYearMonth);
            console.log('renderMonthArr');
            console.log(renderMonthArr);
            console.log('renderYearArr');
            console.log(renderYearArr);
            // console.log(this.state.travelDataHead);
            // console.log('fromHead', this.props.path);
            // this.renderDataFunc(travelDataHead, 'date');
            this.sortedDateFunc(this.renderDataFunc(travelDataHead, 'date'));
            // console.log(mostPreMonth);
            // console.log(newestMonth);

            return (
                <React.Fragment>
                    <div>CalendarHead is Me!</div>

                    <div className="calendars_tabWrap">
                        {/* <a href="#"
                            className="prev"></a> */}
                        <ul className="tophead">
                            {/* {renderMonthArr.map((renderMonth) => {   // 用map推測會造成日後分成兩個arr的問題
                                return (
                                    <li className="tophead__month">
                                        <a href="#">
                                            <span>
                                                {initYear} {renderMonth}月
                                            </span>
                                        </a>
                                    </li>
                                );
                            })} */}

                            {/* <li className="tophead__month" onClick ={ ('left') =>{
                  this.handleSlideClick('left');
              } } > */}
                            <li
                                className="tophead__month"
                                onClick={() => {
                                    this.handleSlideClick('left');
                                }}
                            >
                                <a href="#">
                                    <span>
                                        {renderYearArr[0]} {renderMonthArr[0]}月
                                    </span>
                                </a>
                            </li>

                            <li className="tophead__month">
                                <a href="#"
className="active">
                                    <span>
                                        {renderYearArr[1]} {renderMonthArr[1]}月
                                    </span>
                                </a>
                            </li>
                            <li
                                className="tophead__month"
                                onClick={() => {
                                    this.handleSlideClick('right').bind(this);
                                }}
                            >
                                <a href="#">
                                    <span>
                                        {renderYearArr[2]} {renderMonthArr[2]}月
                                    </span>
                                </a>
                            </li>
                        </ul>
                        {/* <a href="#"
                            className="next"></a> */}
                    </div>
                </React.Fragment>
            );
        } else {
            return <div>nothing</div>;
        }
    }
}

export default CalendarHead;
