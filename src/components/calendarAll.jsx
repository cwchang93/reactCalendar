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
            nowYear: null,
            nowMonth: null,
            nowDate: null, // for testing
        };
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

    render() {
        const { nowDate } = this.state;
        console.log('appjsPath');
        console.log(this.props.path);
        return (
            <React.Fragment>
                <div className="calendars">

                    <div className="underLine">
                        切換列表顯示
                    </div>

                    <CalendarHead path={this.props.path}
                        initYearMonth= {this.props.initYearMonth}
                        selectedDate={this.selectedDate}
                        transferYearMonth={this.transferYearMonth}
                    />

                    {/* <h1 className = 'text' > {this.props.text}</h1> */}
                    {/* <h2 className = 'test'>test2</h2> */}
                    <CalendarBody path={this.props.path}
                        selectedDate={nowDate}
                        // transferYearMonth={this.transferYearMonth}
                        nowYear = {this.state.nowYear}
                        nowMonth = {this.state.nowMonth}
                        dataKeySetting= {this.props.dataKeySetting}
                    />
                </div>
            </React.Fragment>

        );
    }
}

export default CalendarAll;
