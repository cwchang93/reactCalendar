import React, {Component} from 'react';
// import ReactDOM from 'react-dom';
// 待處理，使用者亂輸入變數時的validation
// testing 190120
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
            // unsortedArr: '',

            renderYearArr: ['2000', '2000', '2000'], // 畫面上要render的年 Arr [String, String, String ]
            // renderYearArr: [], // 畫面上要render的年 Arr [String, String, String ]
            renderMonthArr: null, // 畫面上要render的月 Arr [String, String, String ]

            initYear: null, // 最初輸入的年部分
            initMonthAfterZero: null, // 最初輸入的月份(去掉0)

            // preInitYear: null, // initYear的前面一格
            // afterInitYear: null, // initYear的後面一格

            // preInitMonth: null, // initMonth的前面一格
            // afterInitMonth: null, // initMonth的前面一格
        };
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
                        // this.limitYearMonthFunc();
                        console.log('hithere');
                    }
                )
            )
            .catch((error) => console.log('parsing failed', error));
    }

    // componentWillMount() {
    //     this.limitYearMonthFunc();
    // }

    componentDidMount() {
        const {travelDataHead} = this.state;
        // this.handleRenderYearMonthArr();
        // this.limitYearMonthFunc();
        this.getData(this.props.path);
        this.collectInitYearMonth();

        // this.limitYearMonthFunc(); // 放在這會報錯  calendarHead.jsx:358 Uncaught ReferenceError: newestYearMonth is not defined
        // this.handleYearArr();
        // this.handleMonthArr();
        // this.renderDataFunc(travelDataHead);

        // console.log('travelDataHead in DidMount');
        // console.log(travelDataHead); // 這邊為何拿不到東西?
        // console.log('this.state.oldestMonth in DidMount');
        // console.log(this.state.oldestMonth);
        // console.log(this.state.unsortedArr);

    // this.sortedDateFunc(this.state.unsortedArr);
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

        const sortedArr = newArr.sort();
        const oldestYear = sortedArr[0].substr(0, 4); // 找出整理後array的第一個的年
        const oldestMonth = sortedArr[0].substr(5, 2); // 找出整理後array的第一個的月
        // const newestYearMonth = sortedArr[sortedArr.length - 1];
        const newestMonth = sortedArr[sortedArr.length - 1].substr(5, 2); // 找出整理後array的第一個月
        const newestYear = sortedArr[sortedArr.length - 1].substr(0, 4); // 找出整理後array的第一個年

        const oldestYearMonth = oldestYear + oldestMonth; // string
        const newestYearMonth = newestYear + newestMonth; // string

        // sortedArr[0];  // e.g. 2016/11/20

        this.setState(
            {
                // 這邊若setState會報錯
                oldestYearMonth: oldestYearMonth,
                newestYearMonth: newestYearMonth,
                oldestMonth: oldestMonth,
                oldestYear: oldestYear,
                newestMonth: newestMonth,
                newestYear: newestYear,
            }
            // () => {
            //     // this.limitYearMonthFunc();
            // }
        );
    // this.limitYearMonthFunc();
    // console.log('test in newDateFunc');
    // console.log('oldestMonth', oldestMonth); // 最左邊月份
    // console.log('oldestYear', oldestYear); // 最左邊月份
    // console.log('newestMonth', newestMonth); // 最右邊月份
    // console.log('newestYear', newestYear); // 最右邊月份
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
        console.log('initYearinitYear123', initYear);

        console.log('initMonthAfterZero123', initMonthAfterZero);
        this.setState(
            {
                initYear: initYear,
                initMonthAfterZero: initMonthAfterZero,
            },
            () => {
                this.handleYearArr(), this.handleMonthArr();
            }
        );
    }

    handleYearArr() {
        const {initMonthAfterZero, initYear} = this.state;
        // console.log('66666666666666666666', initMonthAfterZero);
        // console.log('handleYearArr func');
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
        if (initMonthAfterZero) {
            console.log('initMonthAfterZero 555', initMonthAfterZero);
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
    }

    handleSlideClick(leftOrRight) {
        const {initYear, initMonthAfterZero} = this.state;
        // 把initYear跟Month分開
        // const initYearMonthLen = initYearMonth.length;
        // const initYear = initYearMonth.substr(0, 4);

        // const initMonth = initYearMonth.substr(initYearMonthLen - 2, 2); // 只取後面兩個
        // let initMonthAfterZero;
        // 如果initMonth第一個數字是0 ==>只取後面的數字

        console.log('this is left');
        if (leftOrRight == 'left') {
            // if initMonthAfterZero == 1 ( 點左邊時 ) => initMonthAfterZero 變12
            let leftSlideInitMonth; // 點左邊箭頭後中間的呈現的值
            let leftSlideRenderMonthArr;
            // NOTE: const 不能在外面宣告 -> 改let
            let leftSlideInitYear;
            let leftSlideRenderYearArr;

            if (initMonthAfterZero === '1') {
                leftSlideInitMonth = '12';
                leftSlideRenderMonthArr = [
                    String(parseInt(leftSlideInitMonth) - 1),
                    leftSlideInitMonth,
                    '1',
                ];

                leftSlideInitYear = String(parseInt(initYear) - 1);
                leftSlideRenderYearArr = [
                    leftSlideInitYear,
                    leftSlideInitYear,
                    String(parseInt(leftSlideInitYear) + 1),
                ];
            } else if (initMonthAfterZero === '12') {
                leftSlideInitMonth = '11';
                leftSlideRenderMonthArr = ['10', leftSlideInitMonth, '12'];

                leftSlideInitYear = initYear;
                leftSlideRenderYearArr = [
                    leftSlideInitYear,
                    leftSlideInitYear,
                    leftSlideInitYear,
                ];
            } else if (initMonthAfterZero === '2') {
                leftSlideInitMonth = '1';
                leftSlideRenderMonthArr = [
                    '12',
                    leftSlideInitMonth,
                    String(parseInt(leftSlideInitMonth) + 1),
                ];
                leftSlideInitYear = initYear;
                leftSlideRenderYearArr = [
                    leftSlideInitYear - 1,
                    leftSlideInitYear,
                    leftSlideInitYear,
                ];
            } else {
                leftSlideInitMonth = String(parseInt(initMonthAfterZero) - 1);
                leftSlideRenderMonthArr = [
                    String(parseInt(leftSlideInitMonth) - 1),
                    leftSlideInitMonth,
                    String(parseInt(leftSlideInitMonth) + 1),
                ];
                leftSlideInitYear = initYear;
                leftSlideRenderYearArr = [
                    leftSlideInitYear,
                    leftSlideInitYear,
                    leftSlideInitYear,
                ];
            }

            this.setState({
                initMonthAfterZero: leftSlideInitMonth,
                initYear: leftSlideInitYear,
                // preInitMonth: leftSlidePreInitMonth,
                // afterInitMonth: leftSlideAfterInitMonth,
                renderMonthArr: leftSlideRenderMonthArr,
                renderYearArr: leftSlideRenderYearArr,
            });
        } else if (leftOrRight == 'right') {
            let rightSlideInitMonth; // 點右邊箭頭後中間的呈現的值
            let rightSlideRenderMonthArr;
            // NOTE: const 不能在外面宣告 -> 改let
            let rightSlideInitYear;
            let rightSlideRenderYearArr;
            if (initMonthAfterZero === '1') {
                rightSlideInitMonth = '2';
                rightSlideRenderMonthArr = [
                    String(parseInt(rightSlideInitMonth) - 1),
                    rightSlideInitMonth,
                    String(parseInt(rightSlideInitMonth) + 1),
                ];

                rightSlideInitYear = initYear;
                rightSlideRenderYearArr = [
                    rightSlideInitYear,
                    rightSlideInitYear,
                    rightSlideInitYear,
                ];
            } else if (initMonthAfterZero === '12') {
                rightSlideInitMonth = '1';
                rightSlideRenderMonthArr = [
                    '12',
                    rightSlideInitMonth,
                    String(parseInt(rightSlideInitMonth) + 1),
                ];

                rightSlideInitYear = String(parseInt(initYear) + 1);
                rightSlideRenderYearArr = [
                    String(parseInt(rightSlideInitYear) - 1),
                    rightSlideInitYear,
                    rightSlideInitYear,
                ];
            } else if (initMonthAfterZero === '11') {
                rightSlideInitMonth = '12';
                rightSlideRenderMonthArr = [
                    String(parseInt(rightSlideInitMonth) - 1),
                    rightSlideInitMonth,
                    '1',
                ];
                rightSlideInitYear = initYear;
                rightSlideRenderYearArr = [
                    rightSlideInitYear,
                    rightSlideInitYear,
                    String(parseInt(rightSlideInitYear) + 1),
                ];
            } else {
                rightSlideInitMonth = String(parseInt(initMonthAfterZero) + 1);
                rightSlideRenderMonthArr = [
                    String(parseInt(rightSlideInitMonth) - 1),
                    rightSlideInitMonth,
                    String(parseInt(rightSlideInitMonth) + 1),
                ];
                rightSlideInitYear = initYear;
                rightSlideRenderYearArr = [
                    rightSlideInitYear,
                    rightSlideInitYear,
                    rightSlideInitYear,
                ];
            }
            this.setState({
                initMonthAfterZero: rightSlideInitMonth,
                initYear: rightSlideInitYear,
                // preInitMonth: rightSlidePreInitMonth,
                // afterInitMonth: rightSlideAfterInitMonth,
                renderMonthArr: rightSlideRenderMonthArr,
                renderYearArr: rightSlideRenderYearArr,
            });
        }
    }
    // componentWillMount() {
    //     console.log('willMount');
    //     this.getData(this.props.path); // fetch data
    // }

    // limitYearMonthFunc() {
    //     console.log('limitFunc was called');
    //     let limitInitYearMonth;
    //     const {
    //         initYearMonth,
    //         oldestYearMonth,
    //         newestYearMonth,

    //     } = this.state;
    //     if (initYearMonth < oldestYearMonth) {
    //         limitInitYearMonth = oldestYearMonth;
    //     } else if (initYearMonth > newestYearMonth) {
    //         limitInitYearMonth = newestYearMonth;
    //     }
    //     this.setState({
    //         initYearMonth: limitInitYearMonth,
    //     });
    // }

    render() {
        const {
            travelDataHead,
            oldestMonth,
            newestMonth,
            oldestYear,
            newestYear,
            renderYearArr,
            renderMonthArr,
            initYear,
            oldestYearMonth,
            newestYearMonth,
        } = this.state;
        // console.log('init Render');
        // console.log('bf if', travelDataHead);

        // this.handleYearArr;
        // console.log('preInitMonth');
        // console.log(this.state.preInitMonth);
        if (travelDataHead) {
            // console.log('initYearinitYear789', this.state.initYear);

            // console.log('initMonthAfterZero789', this.state.initMonthAfterZero);
            // console.log('999', this.state);
            console.log('oldestYearMonth');
            console.log(oldestYearMonth);
            console.log('newestYearMonth');
            console.log(newestYearMonth);
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
                                    // this.handleSlideClick('right').bind(this);  // guess箭頭涵式已經包含this功能了
                                    this.handleSlideClick('right');
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
