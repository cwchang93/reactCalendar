import React, { Component } from 'react';
import { S_IFREG } from 'constants';
// import ReactDOM from 'react-dom';
// 待處理，使用者亂輸入變數時的validation
// testing 190120
class CalendarHead extends Component {
    constructor(props) {
        super(props);
        this.rightClickRef = React.createRef();
        this.leftClickRef = React.createRef();
        this.state = {
            initYearMonth: props.initYearMonth,
            travelDataHead: null,
            oldestMonth: '', // 左邊到底的月
            oldestYear: '', // 左邊到底的年
            newestMonth: '', // 右邊到底的月
            newestYear: '', // 右邊到底的年
            oldestYearMonth: '',
            newestYearMonth: '',
            renderYearArr: ['2000', '2000', '2000'], // 畫面上要render的年 Arr [String, String, String ]
            renderMonthArr: null, // 畫面上要render的月 Arr [String, String, String ]

            initMonthRender: '01', // 目前在檯面上中間Render的月份

            initYearMonthRender: null,

            initYear: null, // 最初輸入的年部分(有包含正在render)
            initMonthAfterZero: null, // 最初輸入的月份(去掉0)
        };
    }

    componentDidMount() {
        const { travelDataHead, initYear, initMonthRender } = this.state;
        this.getData(this.props.path);
        this.props.transferYearMonth(
            this.state.initYear,
            this.state.initMonthAfterZero
        );
        this.collectInitYearMonth();

        // console.log('123123213: ', this.props.maxYearMonth);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.initYearMonth !== this.props.initYearMonth) {
            this.getData(this.props.path);
            this.handleYearArr();
            this.handleMonthArr();
            this.combineCurrentYearMonth();
        }
    }

    getData(path) {
        fetch(path)
            .then((response) => {
                return response.json();
            })
            .then((travelDataHead) =>
            // return 變數
                this.setState(
                    {
                        travelDataHead: travelDataHead,
                    },
                    () => {
                        // console.log('renderDataFunc was called in getData');
                        this.renderDataFunc(this.state.travelDataHead, 'date');
                        this.collectInitYearMonth();
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

    // duplicate 待會整理 190214
    renderDataFunc(jsonData, jsonKey) {
        const { initYearMonth, initYear, initMonthafterZero } = this.props;
        // console.log('jsonKey');
        // console.log(jsonKey);
        const newArr = [];
        for (let i = 0; i < jsonData.length; i++) {
            newArr.push(jsonData[i][jsonKey]);
        }
        // console.log(newArr);

        const sortedArr = newArr.sort();
        const oldestYear = sortedArr[0].substr(0, 4); // 找出整理後array的第一個的年
        const oldestMonth = sortedArr[0].substr(5, 2); // 找出整理後array的第一個的月
        const newestMonth = sortedArr[sortedArr.length - 1].substr(5, 2); // 找出整理後array的第一個月
        const newestYear = sortedArr[sortedArr.length - 1].substr(0, 4); // 找出整理後array的第一個年

        const oldestYearMonth = oldestYear + oldestMonth; // string
        const newestYearMonth = newestYear + newestMonth; // string

        let limitInitYearMonth; // 設定限制範圍(一開始render時)
        if (initYearMonth < oldestYearMonth) {
            // 超出左邊極限
            limitInitYearMonth = String(parseInt(oldestYearMonth) + 1);
            ('string');
        } else if (initYearMonth > newestYearMonth) {
            limitInitYearMonth = String(parseInt(newestYearMonth) - 1);
        } else {
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

        let limitInitYearMonth;
        const { initYearMonth, oldestYearMonth, newestYearMonth } = this.state;

        const initYearMonthLen = initYearMonth.length;
        const initYear = initYearMonth.substr(0, 4);
        const initMonth = initYearMonth.substr(initYearMonthLen - 2, 2); // 只取後面兩個
        let initMonthAfterZero;
        // 如果initMonth第一個數字是0 ==>只取後面的數字

        if (initMonth[0] == '0') {
            //   initMonth = init[1];  // Uncaught Error: "initMonth" is read-only
            initMonthAfterZero = initMonth[1];
        } else {
            initMonthAfterZero = initMonth;
        }
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


    handleYearArr() { // renderYear的function
        const { initMonthAfterZero, oldestYearMonth } = this.state;
        const { initYearMonth, maxYearMonth } = this.props;
        let preInitYear;
        let afterInitYear;

        let parseMonth;
        // maxYearMonth
        // const regexYearMonth = ''

        // VIP 要加regex判斷  避免201813之類不符合的規範
        const validateYearMonth = /^[1|2][0-9]{3}([0][1-9]|10|11|12)/;

        if (validateYearMonth.test(initYearMonth)) {
            // console.log('oldest1993');
            // console.log('maxYearMonth in head');
            // console.log(maxYearMonth); // bug 這裡一開始抓不到
            if ( parseInt(initYearMonth) == '201812' ) {
            //     initYearMonth = '201812';
            //     // bug 當輸入201912之類的可以符合規範，但無法直接改變initYearMonth的值
            //     console.log('initYearMont>newest called');
            }

            if (initYearMonth[4] == '0') {
                parseMonth = initYearMonth.substr(initYearMonth.length - 1, 1);
            } else {
                parseMonth = initYearMonth.substr(initYearMonth.length - 2, 2);
            }

            const parseYear = initYearMonth.substr(0, 4);

            if ( parseMonth === '1') {
                console.log(' parseMonth===1');
                preInitYear = String(parseInt(parseYear) - 1);
                afterInitYear = parseYear;
                console.log(preInitYear);
            } else if ( parseMonth === '12') {
                preInitYear = parseYear;
                afterInitYear = String(parseInt(parseYear) + 1);
            } else {
                preInitYear = parseYear;
                afterInitYear = parseYear;
            }

            const renderYearArr = [preInitYear, parseYear, afterInitYear];
            this.setState({
                preInitYear: preInitYear,
                afterInitYear: afterInitYear,
                renderYearArr: renderYearArr,
                // initYear: initYear,
            });
        } else {
            alert('Wrong format type!');
        }
    }
    // 190213重構前
    // handleYearArr() {
    //     const { initMonthAfterZero, initYear } = this.state;
    //     let preInitYear;
    //     let afterInitYear;

    //     if (initMonthAfterZero === '1') {
    //         console.log('initMonthAfterZero===1');
    //         preInitYear = String(parseInt(initYear) - 1);
    //         afterInitYear = initYear;
    //         console.log(preInitYear);
    //     } else if (initMonthAfterZero === '12') {
    //         preInitYear = initYear;
    //         afterInitYear = String(parseInt(initYear) + 1);
    //     } else {
    //         preInitYear = initYear;
    //         afterInitYear = initYear;
    //     }

    //     const renderYearArr = [preInitYear, initYear, afterInitYear];
    //     this.setState({
    //         preInitYear: preInitYear,
    //         afterInitYear: afterInitYear,
    //         renderYearArr: renderYearArr,
    //         // initYear: initYear,
    //     });
    // }

    // 看起來OK 190213 RC
    handleMonthArr() {
        const { initMonthAfterZero } = this.state;
        // if (initMonthAfterZero) {
        // let parseMonth = initYearMonth[0] == '0' ? initYearMonth.substr(initYearMonth.length -1 ,1) : initYearMonth.substr(initYearMonth.length -2 ,2);
        const { initYearMonth } = this.props;
        let preInitMonth;

        // VIP 加入regex判斷來alert

        const validateYearMonth = /^[1|2][0-9]{3}([0][1-9]|10|11|12)/;
        if (validateYearMonth.test(initYearMonth)) {
            let parseMonth;
            // if (initYearMonth == '201812') {
            //     parseMonth = 11;
            // } else if (initYearMonth == '201611') {
            //     parseMonth = 10;
            // }


            if (initYearMonth[4] == '0') {
                // console.log('parseMonth if');
                // console.log(parseMonth);
                parseMonth = initYearMonth.substr(initYearMonth.length - 1, 1);
            } else {
                console.log('parseMonth else');
                console.log(parseMonth);
                parseMonth = initYearMonth.substr(initYearMonth.length - 2, 2);
            }


            if (parseMonth === '1') {
                preInitMonth = '12';
            } else {
                preInitMonth = String(parseInt(parseMonth) - 1);
            }

            let afterInitMonth;
            if (parseMonth === '12') {
                afterInitMonth = '1';
            } else {
                afterInitMonth = String(parseInt(parseMonth) + 1);
            }

            const renderMonthArr = [preInitMonth, parseMonth, afterInitMonth];
            this.setState({
                preInitMonth: preInitMonth,
                afterInitMonth: afterInitMonth,
                renderMonthArr: renderMonthArr,
            });
        } else {
            alert('Wrong format type!');
        }
        // }
    }
    // 190213 重構前
    // handleMonthArr() {
    //     const { initMonthAfterZero } = this.state;
    //     if (initMonthAfterZero) {
    //         let preInitMonth;
    //         if (initMonthAfterZero === '1') {
    //             preInitMonth = '12';
    //         } else {
    //             preInitMonth = String(parseInt(initMonthAfterZero) - 1);
    //         }

    //         let afterInitMonth;
    //         if (initMonthAfterZero === '12') {
    //             afterInitMonth = '1';
    //         } else {
    //             afterInitMonth = String(parseInt(initMonthAfterZero) + 1);
    //         }

    //         const renderMonthArr = [preInitMonth, initMonthAfterZero, afterInitMonth];
    //         this.setState({
    //             preInitMonth: preInitMonth,
    //             afterInitMonth: afterInitMonth,
    //             renderMonthArr: renderMonthArr,
    //         });
    //     }
    // }

    handleSlideClick(leftOrRight) {
        // 印出modle


        const {
            initYear,
            initMonthAfterZero,
            oldestYearMonth,
            newestYearMonth,

            oldestYear,
            oldestMonth,
            newestYear,
            newestMonth,


            initMonthRender,
        } = this.state;

        //        this.props.selectedDate('123');


        let slideYearMonth; // slidefunctiuon中目前render的YearMonth
        let slideAddZeroInitMonth;
        // 重新組裝 20181 => 201801
        if (initMonthRender.length === 1) {
            slideAddZeroInitMonth = '0' + initMonthRender;
            slideYearMonth = initYear + slideAddZeroInitMonth;
        } else {
            slideAddZeroInitMonth = initMonthRender;
            slideYearMonth = initYear + slideAddZeroInitMonth;
        }

        if (
            leftOrRight == 'left' &&
      slideYearMonth > String(parseInt(oldestYearMonth))
        ) {
            // console.log(this.leftClickRef.current);
            let leftSlideInitMonth; // 點左邊箭頭後中間的呈現的值
            let leftSlideRenderMonthArr;
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

            if (leftSlideInitMonth === oldestMonth && leftSlideInitYear === oldestYear) {
                if (leftSlideInitMonth === '11' ) {
                    leftSlideRenderYearArr = [
                        leftSlideInitYear,
                        leftSlideInitYear,
                        String(parseInt(leftSlideInitYear) + 1),
                    ];
                    leftSlideRenderMonthArr = [
                        '11', '12', '1',
                    ];
                } else if (leftSlideInitMonth === '12') {
                    leftSlideRenderYearArr = [
                        leftSlideInitYear,
                        String(parseInt(leftSlideInitYear) + 1),
                        String(parseInt(leftSlideInitYear) + 1),
                    ];
                    leftSlideRenderMonthArr = [
                        '12', '1', '2',
                    ];
                } else {
                    leftSlideRenderYearArr = [
                        leftSlideInitYear,
                        leftSlideInitYear,
                        leftSlideInitYear,
                    ];
                    leftSlideRenderMonthArr = [
                        leftSlideInitMonth,
                        String(parseInt(leftSlideInitMonth) + 1 ),
                        String(parseInt(leftSlideInitMonth) + 2 ),
                    ];
                }
            }

            this.setState(
                {
                    initMonthAfterZero: leftSlideInitMonth,
                    initYear: leftSlideInitYear,
                    initMonthRender: leftSlideInitMonth, // not sure
                    renderMonthArr: leftSlideRenderMonthArr,
                    renderYearArr: leftSlideRenderYearArr,
                },
                () => {
                    this.props.transferYearMonth(
                        // 把state的參數值(y,m)傳到父曾
                        this.state.initYear,
                        this.state.initMonthAfterZero
                    );
                }
            );
        } else if (
            leftOrRight == 'right' &&
      slideYearMonth < String(parseInt(newestYearMonth))
        ) {
            // console.log(this.rightClickRef.current);
            let rightSlideInitMonth; // 點右邊箭頭後中間的呈現的值
            let rightSlideRenderMonthArr;
            // NOTE: const 不能在外面宣告 -> 改let
            let rightSlideInitYear;
            let rightSlideRenderYearArr;

            // console.log('rightSlideInitMonth, rightclick');
            // console.log(rightSlideInitMonth);

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

            // 如果超出右邊範圍時
            if (rightSlideInitMonth === newestMonth && rightSlideInitYear === newestYear) {
                rightSlideInitMonth = newestMonth;
                rightSlideRenderYearArr = [
                    rightSlideInitYear,
                    rightSlideInitYear,
                    rightSlideInitYear,
                ];
                rightSlideRenderMonthArr = [
                    String(parseInt(rightSlideInitMonth) - 2),
                    String(parseInt(rightSlideInitMonth) - 1),
                    rightSlideInitMonth,
                ];
            }

            this.setState(
                {
                    initMonthAfterZero: rightSlideInitMonth,
                    initYear: rightSlideInitYear,
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

    handleBackgroundFunc() { // 光箱
        const { initYear, initMonthRender, initMonthAfterZero,
            oldestYearMonth, newestYearMonth } = this.state;
        const renderInitYearMonth = `${initYear}${initMonthAfterZero.length === 1 ? 0 : ''}${initMonthAfterZero}`;

        let backgroundArr = [];
        // 這邊不能用const因為const不能變更
        // console.log('renderInitYearMonth741741');
        // console.log(renderInitYearMonth);
        if ( renderInitYearMonth > oldestYearMonth && renderInitYearMonth < newestYearMonth ) {
            backgroundArr = ['', 'active', ''];
        } else if ( renderInitYearMonth <= oldestYearMonth ) {
            backgroundArr = ['active', '', ''];
        } else if ( renderInitYearMonth >= oldestYearMonth ) {
            backgroundArr = ['', '', 'active'];
        }

        return backgroundArr;
    }

    handleLightBoxText() { // span字的顏色
        const { initYear, initMonthRender, initMonthAfterZero,
            oldestYearMonth, newestYearMonth } = this.state;
        const renderInitYearMonth = `${initYear}${initMonthAfterZero.length === 1 ? 0 : ''}${initMonthAfterZero}`;

        let boxTextArr = [];
        // 這邊不能用const因為const不能變更
        // console.log('renderInitYearMonth741741');
        // console.log(renderInitYearMonth);
        if ( renderInitYearMonth > oldestYearMonth && renderInitYearMonth < newestYearMonth ) {
            boxTextArr = ['', 'activeText', ''];
        } else if ( renderInitYearMonth <= oldestYearMonth ) {
            boxTextArr = ['activeText', '', ''];
        } else if ( renderInitYearMonth >= oldestYearMonth ) {
            boxTextArr = ['', '', 'activeText'];
        }

        return boxTextArr;
    }


    //    +span的文字變紅


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
            const isActiveArr = this.handleBackgroundFunc();
            const activeTextArr = this.handleLightBoxText();
            return (
                <React.Fragment>
                    {/* <div>React Calendar</div> */}

                    <div className="calendars_tabWrap">
                        <ul className="tophead">

                            {/* 因為有分左右兩邊點擊所以要分三個寫 */}
                            <li
                                className="tophead__month"
                                ref={this.leftClickRef}
                                onClick={(e) => {
                                    this.handleSlideClick('left');
                                    this.props.printModule();
                                    console.log(e.currentTarget);
                                }}
                            >
                                <a href="#"
                                    className = { isActiveArr[0]}
                                >
                                    <div className="wrap_left">

                                        <span className="arrow_wrap_left"></span>
                                    </div>
                                    <span className= {activeTextArr[0]}>
                                        {renderYearArr[0]} {renderMonthArr[0]}月
                                    </span>
                                </a>
                            </li>

                            <li className="tophead__month">
                                <a href="#"
                                    className = { isActiveArr[1]}

                                >
                                    <span className= {activeTextArr[1]}>
                                        {renderYearArr[1]} {renderMonthArr[1]}月
                                    </span>
                                </a>
                            </li>
                            <li
                                className="tophead__month"
                                ref={this.rightClickRef}
                                onClick={(e) => {
                                    this.handleSlideClick('right');
                                    this.props.printModule();
                                    console.log(e.currentTarget);
                                }}
                            >
                                <a href="#"
                                    className = { isActiveArr[2]}
                                >
                                    <div className="wrap_right">

                                        <span className="arrow_wrap_right"

                                            onClick={() => {
                                                this.handleSlideClick('right');
                                            }}></span>

                                    </div>
                                    <span className= {activeTextArr[2]}>
                                        {renderYearArr[2]} {renderMonthArr[2]}月
                                    </span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </React.Fragment>
            );
        } else {
            return <div>nothing</div>;
        }
    }
}

export default CalendarHead;
