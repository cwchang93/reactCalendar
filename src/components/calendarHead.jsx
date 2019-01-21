import React, {Component} from 'react';
// import ReactDOM from 'react-dom';
// 待處理，使用者亂輸入變數時的validation
// testing 190120
class CalendarHead extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initYearMonth: this.props.initYearMonth,
            travelDataHead: null,
            oldestMonth: '', // 左邊到底的月
            oldestYear: '', // 左邊到底的年
            newestMonth: '', // 右邊到底的月
            newestYear: '', // 右邊到底的年

            renderYearArr: ['2000', '2000', '2000'], // 畫面上要render的年 Arr [String, String, String ]
            renderMonthArr: null, // 畫面上要render的月 Arr [String, String, String ]

            initYear: null, // 最初輸入的年部分
            initMonthAfterZero: null, // 最初輸入的月份(去掉0)
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
                    },
                    () => {
                        console.log('renderDataFunc was called in getData');
                        this.renderDataFunc(this.state.travelDataHead, 'date');
                        this.collectInitYearMonth();
                        // this.limitYearMonthFunc();
                        console.log('hithere');
                    }
                )
            )
            .catch((error) => console.log('parsing failed', error));
    }

    componentDidMount() {
        const {travelDataHead} = this.state;
        this.getData(this.props.path);
        this.collectInitYearMonth();
    }

    renderDataFunc(jsonData, jsonKey) {
        console.log('jsonKey');
        console.log(jsonKey);
        const newArr = [];
        for (let i = 0; i < jsonData.length; i++) {
            newArr.push(jsonData[i][jsonKey]);
        }
        console.log(newArr);

        const sortedArr = newArr.sort();
        const oldestYear = sortedArr[0].substr(0, 4); // 找出整理後array的第一個的年
        const oldestMonth = sortedArr[0].substr(5, 2); // 找出整理後array的第一個的月
        const newestMonth = sortedArr[sortedArr.length - 1].substr(5, 2); // 找出整理後array的第一個月
        const newestYear = sortedArr[sortedArr.length - 1].substr(0, 4); // 找出整理後array的第一個年

        const oldestYearMonth = oldestYear + oldestMonth; // string
        const newestYearMonth = newestYear + newestMonth; // string

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
    }

    collectInitYearMonth() {
    // 把initYear跟Month切開

        console.log('limitFunc was called in collectInitYearMonth');
        let limitInitYearMonth;
        const {initYearMonth, oldestYearMonth, newestYearMonth} = this.state;
        console.log('oldestYearMonth999');
        console.log(oldestYearMonth); // 這邊還吃不到

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
        let preInitYear;
        let afterInitYear;
        if (initMonthAfterZero === '1') {
            console.log('initMonthAfterZero===1');
            preInitYear = String(parseInt(initYear) - 1);
            afterInitYear = initYear;
            console.log(preInitYear);
        } else if (initMonthAfterZero === '12') {
            preInitYear = initYear;
            afterInitYear = String(parseInt(initYear) + 1);
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

    limitYearMonthFunc() {
        console.log('limitFunc was called');
        let limitInitYearMonth;
        const {initYearMonth, oldestYearMonth, newestYearMonth} = this.state;
        if (initYearMonth < oldestYearMonth) {
            limitInitYearMonth = oldestYearMonth;
        } else if (initYearMonth > newestYearMonth) {
            limitInitYearMonth = newestYearMonth;
        }
        this.setState({
            initYearMonth: limitInitYearMonth,
        });
    }

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
        if (travelDataHead) {
            console.log('oldestYearMonth');
            console.log(oldestYearMonth);
            console.log('newestYearMonth');
            console.log(newestYearMonth);
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
