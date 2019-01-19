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
            oldestMonth: '', // 左邊到底的月
            oldestYear: '', // 左邊到底的年
            newestMonth: '', // 右邊到底的月
            newestYear: '', // 右邊到底的年
            unsortedArr: '',

            renderYearArr: ['2018', '2018', '2018'], // 畫面上要render的年 Arr [String, String, String ]
            renderMonthArr: null, // 畫面上要render的月 Arr [String, String, String ]
            initYear: null, // 最初輸入的年部分
            initMonthAfterZero: null, // 最初輸入的月份(去掉0)

            preInitYear: null, // initYear的前面一格
            afterInitYear: null, // initYear的後面一格
        };
    }

    renderDataFunc(jsonData, jsonKey) {
    // 6666666666666666
        console.log('jsonKey');
        console.log(jsonKey);
        const newArr = [];
        for (let i = 0; i < jsonData.length; i++) {
            newArr.push(jsonData[i][jsonKey]);
            // console.log(newArr);
        }
        console.log(newArr);

        const oldestMonth = newArr[0].substr(5, 2); // 找出整理後array的第一個的月
        const oldestYear = newArr[0].substr(0, 4); // 找出整理後array的第一個的年
        const newestMonth = newArr[newArr.length - 1].substr(5, 2); // 找出整理後array的第一個月
        const newestYear = newArr[newArr.length - 1].substr(0, 4); // 找出整理後array的第一個年
        this.setState({
            // 這邊若setState會報錯
            oldestMonth: oldestMonth,
            oldestYear: oldestYear,
            newestMonth: newestMonth,
            newestYear: newestYear,
        });
    // console.log('test in newDateFunc');
    // console.log('oldestMonth', oldestMonth); // 最左邊月份
    // console.log('oldestYear', oldestYear); // 最左邊月份
    // console.log('newestMonth', newestMonth); // 最右邊月份
    // console.log('newestYear', newestYear); // 最右邊月份
    }

    handleYearArr() {
        const {initMonthAfterZero, initYear} = this.state;
        console.log('handleYearArr func');
        let preInitYear;
        let afterInitYear;
        if (initMonthAfterZero === '1') {
            console.log('initMonthAfterZero===1');
            // console.log('initMonthAfterZero', initMonthAfterZero);
            preInitYear = String(parseInt(initYear) - 1);
            afterInitYear = initYear;
            console.log(preInitYear);
        } else if (initMonthAfterZero === '12') {
            preInitYear = initYear;
            afterInitYear = String(parseInt(initYear) + 1);
            // preInitYear = initYear;
        } else {
            preInitYear = initYear;
            afterInitYear = initYear;
        }

        const renderYearArr = [preInitYear, initYear, afterInitYear];
        this.setState({
            preInitYear: preInitYear,
            afterInitYear: afterInitYear,
            renderYearArr: renderYearArr,
            // initYear: initYear,
        });
    }

    handleMonthArr() {
        const {initMonthAfterZero} = this.state;
        let preInitMonth;
        if (initMonthAfterZero === '1') {
            preInitMonth = '12';
        } else {
            preInitMonth = String(parseInt(initMonthAfterZero) - 1);
        }
        console.log('preInitMonth');
        console.log(preInitMonth);

        let afterInitMonth;
        if (initMonthAfterZero === '12') {
            afterInitMonth = '1';
        } else {
            afterInitMonth = String(parseInt(initMonthAfterZero) + 1);
        }

        console.log('afterInitMonth');
        console.log(afterInitMonth);
        const renderMonthArr = [preInitMonth, initMonthAfterZero, afterInitMonth];
        this.setState({
            preInitMonth: preInitMonth,
            afterInitMonth: afterInitMonth,
            renderMonthArr: renderMonthArr,
        });
    }

    collectInitYearMonth() {
    // 把initYear跟Month切開
        const {initYearMonth} = this.state;
        const initYearMonthLen = initYearMonth.length;
        const initYear = initYearMonth.substr(0, 4);
        const initMonth = initYearMonth.substr(initYearMonthLen - 2, 2); // 只取後面兩個
        let initMonthAfterZero;
        // 如果initMonth第一個數字是0 ==>只取後面的數字

        if (initMonth[0] == '0') {
            //   initMonth = init[1];  // Uncaught Error: "initMonth" is read-only
            initMonthAfterZero = initMonth[1];
            // console.log(initMonthAfterZero);
        } else {
            initMonthAfterZero = initMonth;
        }

        this.setState({
            initYear: initYear,
            initMonthAfterZero: initMonthAfterZero,
        });
    }

    // handleRenderYearMonthArr() {
    //     console.log(initMonthAfterZero);
    //     console.log(initYear);

    //     // 年

    //     // 放進要render(map)的arr
    //     // ok 待處理:  如果輸入的月份是01 => premonth變12

    //     //  月

    //     this.setState({
    //         renderMonthArr: renderMonthArr,
    //         // renderYearArr: renderYearArr,
    //         // initYear: initYear,
    //         initMonthAfterZero: initMonthAfterZero,
    //         preInitYear,
    //         afterInitYear,
    //     });

    // // initYear,
    // }

    // 原本年月合起來的function  以下

    // handleRenderYearMonthArr() {
    //     const {initYearMonth} = this.state;
    //     // 把initYear跟Month分開
    //     const initYearMonthLen = initYearMonth.length;
    //     const initYear = initYearMonth.substr(0, 4);
    //     const initMonth = initYearMonth.substr(initYearMonthLen - 2, 2); // 只取後面兩個
    //     let initMonthAfterZero;
    //     // 如果initMonth第一個數字是0 ==>只取後面的數字

    //     if (initMonth[0] == '0') {
    //         //   initMonth = init[1];  // Uncaught Error: "initMonth" is read-only
    //         initMonthAfterZero = initMonth[1];
    //         // console.log(initMonthAfterZero);
    //     } else {
    //         initMonthAfterZero = initMonth;
    //     }

    //     console.log(initMonthAfterZero);
    //     console.log(initYear);

    //     let preInitYear;
    //     let afterInitYear;
    //     if (initMonthAfterZero === '1') {
    //         console.log('initMonthAfterZero===1');
    //         // console.log('initMonthAfterZero', initMonthAfterZero);
    //         preInitYear = String(parseInt(initYear) - 1);
    //         afterInitYear = initYear;
    //         console.log(preInitYear);
    //     } else if (initMonthAfterZero === '12') {
    //         preInitYear = String(parseInt(initYear) - 1);

    //         afterInitYear = initYear;
    //         // preInitYear = initYear;
    //     } else {
    //         preInitYear = initYear;
    //         afterInitYear = initYear;
    //     }

    //     const renderYearArr = [preInitYear, initYear, afterInitYear];

    //     // 放進要render(map)的arr
    //     // 待處理:  如果輸入的月份是01 => premonth變12
    //     let preInitMonth;
    //     if (initMonthAfterZero === '1') {
    //         preInitMonth = '12';
    //     } else {
    //         preInitMonth = String(parseInt(initMonthAfterZero) - 1);
    //     }
    //     console.log('preInitMonth');
    //     console.log(preInitMonth);

    //     let afterInitMonth;
    //     if (initMonthAfterZero === '12') {
    //         afterInitMonth = '1';
    //     } else {
    //         afterInitMonth = String(parseInt(initMonthAfterZero) + 1);
    //     }

    //     console.log('afterInitMonth');
    //     console.log(afterInitMonth);
    //     const renderMonthArr = [preInitMonth, initMonthAfterZero, afterInitMonth];

    //     this.setState({
    //         renderMonthArr: renderMonthArr,
    //         renderYearArr: renderYearArr,
    //         initYear: initYear,
    //         initMonthAfterZero: initMonthAfterZero,
    //         preInitYear,
    //         afterInitYear,
    //     });

    // // initYear,
    // }
    // 原本年月合起來的function 以上

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

        console.log('this is left');
        if (leftOrRight == 'left') {
            console.log('initYear, initMonthAfterZero, preInitYear, afterInitYear');
            console.log(initYear, initMonthAfterZero, preInitYear, afterInitYear);
        }
    }

    getData(path) {
        fetch(path)
            .then((response) => {
                return response.json();
            })
            .then((travelDataHead) =>
                this.setState(
                    {
                        travelDataHead: travelDataHead,
                        // }
                    },
                    () => {
                        this.renderDataFunc(this.state.travelDataHead, 'date');
                        // this.collectInitYearMonth();
                        // this.handleMonthArr();
                        // this.handleYearArr();
                        // this.sortedDateFunc(this.state.unsortedArr);
                        // console.log('this.state.unsortedArr');
                        // console.log(this.state.unsortedArr);
                        // console.log('travelDataHead in getData');
                        // console.log(this.state.travelDataHead);
                    }
                )
            )
            .catch((error) => console.log('parsing failed', error));
    }

    // componentWillMount() {
    //     console.log('willMount');
    //     this.getData(this.props.path); // fetch data
    // }

    componentDidMount() {
        const {travelDataHead} = this.state;
        // this.handleRenderYearMonthArr();
        this.getData(this.props.path);
        // this.renderDataFunc(travelDataHead);

        // console.log('travelDataHead in DidMount');
        // console.log(travelDataHead); // 這邊為何拿不到東西?
        // console.log('this.state.oldestMonth in DidMount');
        // console.log(this.state.oldestMonth);
        // console.log(this.state.unsortedArr);

    // this.sortedDateFunc(this.state.unsortedArr);
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
        console.log('init Render');
        console.log('bf if', travelDataHead);
        if (travelDataHead) {
            // this.renderStateFunc();
            // console.log('render in if travelData');
            // console.log('this.state.unsortedArr');
            // console.log(this.state.unsortedArr);
            // console.log('this.props.initialYearMonth');
            // console.log(this.state.initYearMonth);
            // console.log('renderMonthArr');
            // console.log(renderMonthArr);
            // console.log('renderYearArr');
            // console.log(renderYearArr);

            // console.log('travelDataHead', this.state.travelDataHead);
            // console.log('fromHead', this.props.path);
            // this.renderDataFunc(travelDataHead, 'date');
            // this.sortedDateFunc(this.renderDataFunc(travelDataHead, 'date'));
            // console.log(mostPreMonth);
            // console.log(newestMonth);
            console.log('this.state.oldestMonth in render');
            console.log(this.state.oldestMonth);
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
