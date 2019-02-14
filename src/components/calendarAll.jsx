import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CalendarHead from './calendarHead.jsx';
import CalendarBody from './calendarBody.jsx';
import '../App.scss';

// webpack 這邊需要加jsx才能找得到


class CalendarAll extends Component {
    // 只要用到props就要指定型別
    static propTypes = {
        text: PropTypes.string,
        dataSource: PropTypes.string,
        initYearMonth: PropTypes.string,


    };
    static defaultProps = {
        // 預設值 props不能為空值
        text: 'Hello world!',
        newText: 'hithere',
    };

    constructor(props) {
        super(props);
        this.state = {
            calendarData: null,
            nowYear: null,
            nowMonth: null,
            nowDate: null, // for testing
            mode: 'bodycalendar_month_mode',
            minYearMonth: '',
            maxYearMonth: '',
            isLoadedData: false,
        };
    }

    componentDidMount() {
        const { calendarData } = this.props;
        this.getFirstData(this.props.path);
        // this.findBorderYearMonthFunc(calendarData, 'date');
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
        });
    }

    selectedDate = (val) => {
        console.log('parent: ', val);
        this.setState({ nowDate: val });
    }

    // 把子組件傳到父組件的call back function

    transferYearMonth = (y, m) => {
        const initYearMonth = this.props;
        console.log('transferYMFunc');
        console.log('year: ', y);
        console.log('month ', m);
        console.log('initYearMonth in transferYearMonth');
        // console.log(this.props.initYearMonth);
        if (m) { // 避免第一次render時沒有資料，須設定m存在時
            let nowYearMonth;
            nowYearMonth = `${y}${ m.length === 1 ? '0' : '' }${m}`;
            console.log('nowYearMonthintransferYearMonth');
            console.log(nowYearMonth);
            if (nowYearMonth > '201812') {
                y = '2018';
                m = '12';
            } else if (nowYearMonth < '201611') {
                y = '2016';
                m = '11';
            }
        }

        this.setState({
            nowYear: y,
            nowMonth: m,
        });
    }

    changeModeFunc = () => {
        const { mode } = this.state;
        if (mode === 'bodycalendar_month_mode') {
            this.setState({
                mode: 'bodycalendar_list_mode',
            });
        } else {
            this.setState({
                mode: 'bodycalendar_month_mode',
            });
        }
    }


    render() {
        const { nowDate } = this.state;
        // if (minYearMonth) {
        const { minYearMonth } = this.props;
        // console.log('minYearMonth123123');
        // console.log(minYearMonth);
        // console.log('maxYearMonth456456');
        // console.log(maxYearMonth);
        return (
            <React.Fragment>
                <div className="calendars">

                    <div className="underLine"
                        onClick={this.changeModeFunc}>
                        切換{ this.state.mode === 'bodycalendar_month_mode' ? '列表' : '月曆'}顯示
                    </div>
                    <CalendarHead path={this.props.path}
                        initYearMonth= {this.props.initYearMonth}
                        selectedDate={this.selectedDate}
                        transferYearMonth={this.transferYearMonth}
                        maxYearMonth={this.state.maxYearMonth}
                        minYearMonth={this.state.minYearMonth}
                    />
                    {/* <h1 className = 'text' > {this.props.text}</h1> */}
                    {/* <h2 className = 'test'>test2</h2> */}
                    <CalendarBody path={this.props.path}
                        selectedDate={nowDate}
                        // transferYearMonth={this.transferYearMonth}
                        nowYear = {this.state.nowYear}
                        nowMonth = {this.state.nowMonth}
                        dataKeySetting= {this.props.dataKeySetting}
                        mode={this.state.mode}
                    />
                </div>
            </React.Fragment>

        );
        // } else {
        //     <div>
        //         Nothing
        //     </div>;
        // }
    }
}

export default CalendarAll;
