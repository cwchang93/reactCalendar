import React, { Component } from 'react';
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
            oldestYearMonth: '',
            newestYearMonth: '',
            renderYearArr: ['2000', '2000', '2000'], // 畫面上要render的年 Arr [String, String, String ]
            renderMonthArr: null, // 畫面上要render的月 Arr [String, String, String ]

            initMonthRender: null, // 目前在檯面上中間Render的月份

            initYearMonthRender: null,

            initYear: null, // 最初輸入的年部分(有包含正在render)
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
                        // // console.log('hithere');
                        // console.log('initYear7788');
                        // console.log(this.state.initYear);
                        // console.log('initMonth7788');
                        // console.log(this.state.initMonthAfterZero);
                        this.props.transferYearMonth(
                            // 把state的參數值(y,m)傳到父曾
                            this.state.initYear,
                            this.state.initMonthAfterZero
                        );
                    }
                )
            )
            .catch((error) => console.log('parsing failed', error));
    }

    componentDidMount() {
        const { travelDataHead, initYear, initMonthRender } = this.state;
        this.getData(this.props.path);
        // console.log('9487 DidMount was called'); // 只有第一次會被摳
        this.collectInitYearMonth();
        console.log('this.props in did mount');
        // console.log(this.props);
        // this.props.transferYearMonth(initYear, initMonthRender);

    // this.props
    // this.props
    }

    renderDataFunc(jsonData, jsonKey) {
        const { initYearMonth, initYear, initMonthafterZero } = this.state;
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

        console.log('initYear111');
        console.log(initYear);
        console.log('initMonthafterZero111');
        console.log(initMonthafterZero);
        let limitInitYearMonth; // 設定限制範圍(一開始rende時)
        if (initYearMonth < oldestYearMonth) {
            // 超出左邊極限
            limitInitYearMonth = String(parseInt(oldestYearMonth) + 1);
            ('string');

            console.log('88888888888888');
            // console.log(limitInitYearMonth);
            // console.log(typeof limitInitYearMonth);
            // console.log('888limitInitYearMonth');
        } else if (initYearMonth > newestYearMonth) {
            limitInitYearMonth = String(parseInt(newestYearMonth) - 1);

            console.log('99999999999999');
            // console.log(limitInitYearMonth);
            // // console.log(typeof limitInitYearMonth);
            // console.log('888limitInitYearMonth');
        } else {
            console.log('else Statement in limitation');
            limitInitYearMonth = initYearMonth;
        }

        const initMonthInRenderFunc = initYearMonth.substr(4, 2);

        this.setState(
            {
                initYearMonth: limitInitYearMonth,
                oldestYearMonth: oldestYearMonth,
                newestYearMonth: newestYearMonth,
                oldestMonth: oldestMonth,
                oldestYear: oldestYear,
                newestMonth: newestMonth,
                newestYear: newestYear,

                initMonthRender: initMonthInRenderFunc,
            },
            () => {
                console.log('this.initYearMonth123123');
                console.log(initYearMonth);
                this.collectInitYearMonth(); // 這邊是關鍵!!  setState的callbackFunc
                this.combineCurrentYearMonth();
            }
        );
    }

    combineCurrentYearMonth() {
        const { initYear, initMonthRender } = this.state;
        let addZeroInitMonthRender;
        let initYearMonthR;
        // 重新組裝 20181 => 201801
        if (initMonthRender.length === '1') {
            addZeroInitMonthRender = '0' + initMonthRender;
            initYearMonthR = initYear + addZeroInitMonthRender;
        } else {
            addZeroInitMonthRender = initMonthRender;
            initYearMonthR = initYear + addZeroInitMonthRender;
        }
        this.setState({
            initYearMonthRender: initYearMonthR,
        });
    }

    collectInitYearMonth() {
    // 把initYear跟Month切開

        console.log('limitFunc was called in collectInitYearMonth');
        let limitInitYearMonth;
        const { initYearMonth, oldestYearMonth, newestYearMonth } = this.state;
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
        const { initMonthAfterZero, initYear } = this.state;
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
        const { initMonthAfterZero } = this.state;
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
        const {
            initYear,
            initMonthAfterZero,
            oldestYearMonth,
            newestYearMonth,

            initMonthRender,
        } = this.state;

        console.log('props: ', this.props);
        this.props.selectedDate('123');

        // console.log('this is left');

        let slideYearMonth; // slidefunctiuon中目前render的YearMonth
        let slideAddZeroInitMonth;
        // 重新組裝 20181 => 201801
        if (initMonthRender.length === 1) {
            slideAddZeroInitMonth = '0' + initMonthRender;
            console.log('87887initMonthRender');
            console.log(initMonthRender);
            slideYearMonth = initYear + slideAddZeroInitMonth;
        } else {
            console.log('88881234');
            slideAddZeroInitMonth = initMonthRender;
            slideYearMonth = initYear + slideAddZeroInitMonth;
        }

        if (
            leftOrRight == 'left' &&
      slideYearMonth > String(parseInt(oldestYearMonth) + 1) // VIP 這邊因為下面減的時候會有一格誤差，因此把他加回來
        ) {
            console.log('slideYearMonth in Left');
            console.log(slideYearMonth);
            console.log('oldestYearMonth in Left');
            console.log(oldestYearMonth);
            // && slideYearMonth > oldestYearMonth
            // && leftSlideYearMonth >= oldestYearMonth
            // 且還沒到底  !==  到底  =>
            // console.log('initYear');
            // console.log(initYear);
            // console.log('initMonthRender');
            // console.log(initMonthRender);

            // console.log('this.oldestYearMonth in left');
            // console.log(oldestYearMonth);
            // console.log('newestYearMonth in left');
            // console.log(newestYearMonth);

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

            this.setState(
                {
                    initMonthAfterZero: leftSlideInitMonth,
                    initYear: leftSlideInitYear,
                    initMonthRender: leftSlideInitMonth, // not sure
                    // preInitMonth: leftSlidePreInitMonth,
                    // afterInitMonth: leftSlideAfterInitMonth,
                    renderMonthArr: leftSlideRenderMonthArr,
                    renderYearArr: leftSlideRenderYearArr,
                },
                () => {
                    this.props.transferYearMonth(
                        // 把state的參數值(y,m)傳到父曾
                        this.state.initYear,
                        this.state.initMonthAfterZero
                    );
                    // console.log('initMonthRender741');
                    // console.log(initMonthRender);
                    // console.log('initYear741');
                    // console.log(initYear);
                    console.log('aaainitYear');
                    console.log('aaainitMonthRender');
                    console.log(initYear);
                    console.log(initMonthRender);
                }
            );
        } else if (
            leftOrRight == 'right' &&
      slideYearMonth < String(parseInt(newestYearMonth) - 1)
        ) {
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
            this.setState(
                {
                    initMonthAfterZero: rightSlideInitMonth,
                    initYear: rightSlideInitYear,
                    // preInitMonth: rightSlidePreInitMonth,
                    // afterInitMonth: rightSlideAfterInitMonth,
                    initMonthRender: rightSlideInitMonth, // not sure
                    renderMonthArr: rightSlideRenderMonthArr,
                    renderYearArr: rightSlideRenderYearArr,
                },
                () => {
                    this.props.transferYearMonth(
                        // 把state的參數值(y,m)傳到父曾
                        this.state.initYear,
                        this.state.initMonthAfterZero
                    );
                    // console.log('initMonthRender852');
                    // console.log(initMonthRender);
                    // console.log('initYear852');
                    // console.log(initYear);
                    console.log('aaainitYear');
                    console.log('aaainitMonthRender');
                    console.log(initYear);
                    console.log(initMonthRender);
                }
            );
        }
    }

    // limitYearMonthFunc() {
    // // 沒用到，改寫到裡面
    //     console.log('limitFunc was called in limit func');
    //     let limitInitYearMonth;
    //     const { initYearMonth, oldestYearMonth, newestYearMonth } = this.state;
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
            initYearMonth,
            oldestYearMonth,
            newestYearMonth,
            initYearMonthRender,

            initMonthRender,
        } = this.state;
        if (travelDataHead) {
            // console.log('initYearMonth777');
            // console.log(initYearMonth);
            // console.log('initYear777');
            // console.log(initYear);
            // console.log('initMonth777');
            // console.log(initMonthRender);
            console.log('aaainitYear');
            console.log('aaainitMonthRender');
            console.log(initYear);
            console.log(initMonthRender);
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
                                                {initYear} {renderMonth}月 //  map 一次，另一個用index取arr的值
                                            </span>
                                        </a>
                                    </li>
                                );
                            })} */}

                            {/* <li className="tophead__month" onClick ={ ('left') =>{
                  this.handleSlideClick('left');
              } } > */}

                            {/* 因為有分左右兩邊所以要分三個寫 */}
                            <li
                                className="tophead__month"
                                onClick={() => {
                                    this.handleSlideClick('left');
                                }}
                            >
                                <a href="#">
                                    <span className="arrow_wrap_left"></span>
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
                                    <span className="arrow_wrap_right"
onClick={() => {
                                    this.handleSlideClick('left');
                                }}></span>
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
