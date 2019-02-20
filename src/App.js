import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.scss';
// import CalendarHead from './components/calendarHead.jsx';
// import CalendarBody from './components/calendarBody.jsx';
import CalendarAll from './components/calendarAll.jsx';
// webpack 這邊需要加jsx才能找得到

// const initialState = {
//     nowYear: null,
//     nowMonth: null,
//     nowDate: null, // for testing
//     isLoad: null,
//     minYearMonth: null,
//     maxYearMonth: null,
// };

class App extends Component {
    // 只要用到props就要指定型別
    static propTypes = {
        text: PropTypes.string,
        dataSource: PropTypes.string,
        // dataSource: PropTypes.array,
        initYearMonth: PropTypes.string,
        dataKeySetting: PropTypes.object,
        test: PropTypes.string,
        changeFunction: PropTypes.func,

    };
    static defaultProps = {
        // 預設值 props不能為空值
        text: 'Hello world!',
        newText: 'hithere',
    };

    constructor(props) {
        super(props);
        this.calendarAllRef = React.createRef();
        this.state = {
            isAlive: true,
            nowYear: null,
            nowMonth: null,
            nowDate: null, // for testing
            isLoad: null,
            minYearMonth: null,
            maxYearMonth: null,
        };
    }

    componentDidMount() {
        this.getFirstData(this.props.dataSource);
        this.setState({ initYearMonth: this.props.initYearMonth, isLoad: true });
    }


    // 一開始先檢測initYearMonth是否符合規定
    // 若超出範圍 => 會顯示最近的
    setInitYearMonth() {
        const { initYearMonth } = this.props;
        const { maxYearMonth, minYearMonth } = this.state;
        const validateYearMonth = /^[1|2][0-9]{3}([0][1-9]|10|11|12)/;
        if (!validateYearMonth.test(initYearMonth)) {
            alert('哥(姐)，別鬧了。不符合格式喔=> 將改為201706');
            this.setState({
                initYearMonth: '201706',
            });
        }
        // console.log('Date.parse(initYearMonth)');
        // console.log(Date.parse(initYearMonth));
        // console.log(Date.parse(maxYearMonth));
        if (Date.parse(initYearMonth) > Date.parse(maxYearMonth)) {
            alert('Hey 哥(姐)，太超過摟!!!  將設定到最後一頁');
            this.setState({
                // initYearMonth: maxYearMonth,
                initYearMonth: '201811',
            });
        } else if (Date.parse(initYearMonth) < Date.parse(minYearMonth)) {
            alert('Hey 哥(姐)，太超過摟!!!  將設定到第一頁');
            this.setState({
                // initYearMonth: minYearMonth,
                initYearMonth: '201610',
            });
        }
    }

    change = (date) => { // 從console直接更改initYearMonth
        const { minYearMonth, maxYearMonth } = this.state;
        const { initYearMonth } = this.props;
        const validateYearMonth = /^[1|2][0-9]{3}([0][1-9]|10|11|12)/;
        if (!validateYearMonth.test(date)) {
            alert('哥(姐)，別鬧了。不符合格式喔');
            return;
        }
        if (Date.parse(date) > Date.parse(maxYearMonth) ) { // 超出右邊範圍
            // let maxYear;
            // let maxMonth;
            const preMaxYearMonth = String(parseInt(maxYearMonth - 1));


            this.setState({
                initYearMonth: preMaxYearMonth,
                // nowYear:
            });
            return;
        } else if (Date.parse(date) < Date.parse(minYearMonth) ) { // 超出左邊範圍
            const preMinYearMonth = String(parseInt(minYearMonth) + 1 );
            this.setState({
                initYearMonth: preMinYearMonth,

            });
            return;
        }
        const nowYearRender = initYearMonth.substr(0, 4);
        let nowMonthRender;
        if (initYearMonth[4] == '0') {
            nowMonthRender = initYearMonth.substr(initYearMonth.length - 1, 1);
        } else {
            nowMonthRender = initYearMonth.substr(initYearMonth.length - 2, 2);
        }
        // let nowMonthRender = initYearMonth.substr()
        this.setState({
            initYearMonth: date,
            nowYear: nowYearRender,
            nowMonth: nowMonthRender,
        });
    }

    switch = () => {
        // console.log('switch was called');
        // console.log('this', this);
        // console.log(this.calendarAllRef);
        this.calendarAllRef.current.changeModeFunc();
    }

    input = (newData) => {
        this.calendarAllRef.current.calendarAllInput(newData);
    }

    resetData(resetData) {
        this.calendarAllRef.current.calendarAllReset(resetData);
    }

    selectedDate = (val) => {
        // console.log('parent: ', val);
        this.setState({ nowDate: val });
    }

    transferYearMonth = (y, m ) => {
        console.log('transferYMFunc');
        console.log('year: ', y);
        console.log('month ', m);
        this.setState({
            nowYear: y,
            nowMonth: m,
        });
    }


    getFirstData(path) {
        fetch(path)
            .then((response) => {
                return response.json();
            })
            .then((calendarData) =>
            // return 變數
                this.setState(
                    {
                        calendarData: calendarData,
                    },
                    () => {
                        this.findBorderYearMonthFunc(calendarData, 'date');
                    }
                )
            )
            .catch((error) => console.log('parsing failed', error));
    }

    findBorderYearMonthFunc(jsonData, jsonKey) { // 原本為renderDataFunc
        const newArr = [];
        for (let i = 0; i < jsonData.length; i++) {
            newArr.push(jsonData[i][jsonKey]);
        }
        const sortedArr = newArr.sort();
        const minYear = sortedArr[0].substr(0, 4); // 找出整理後array的第一個的年
        const minMonth = sortedArr[0].substr(5, 2); // 找出整理後array的第一個的月
        const maxMonth = sortedArr[sortedArr.length - 1].substr(5, 2); // 找出整理後array的第一個月
        const maxYear = sortedArr[sortedArr.length - 1].substr(0, 4); // 找出整理後array的第一個年

        const minYearMonth = minYear + minMonth; // string
        const maxYearMonth = maxYear + maxMonth; // string

        this.setState({
            minYearMonth: minYearMonth,
            maxYearMonth: maxYearMonth,
        }, () => {
            this.setInitYearMonth();
        });
    }

    printModule = () => {
        console.log(this);
    }

    nextMonth = () => {
        this.calendarAllRef.current.calendarAllNextMonth();
        console.log(this);
    }

    prevMonth = () => {
        this.calendarAllRef.current.calendarAllPrevMonth();
        console.log(this);
    }

    destroy() {
        console.log('destroy was called');
        // this.calendarAllRef.current.componentWillUnmount();
        this.setState({
            isAlive: false,
        });
        // console.log();
        // console.log(this.calendarAllRef).queryselector();
    }

    alive() {
        this.setState({
            isAlive: true,
        });
    }

    render() {
        // const { minYearMonth, maxYearMonth } = this.state;
        // console.log('安安');
        // console.log(minYearMonth);
        // console.log(maxYearMonth);

        return (
            <React.Fragment>

                {this.state.isLoad && this.state.isAlive &&
                    <CalendarAll
                        ref = {this.calendarAllRef}
                        path={this.props.dataSource}
                        initYearMonth= {this.state.initYearMonth}
                        dataKeySetting= {this.props.dataKeySetting}
                        printModule = {this.printModule}
                    />
                }


            </React.Fragment>

        );
    }
}

export default App;
