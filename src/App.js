import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.scss';
import CalendarHead from './components/calendarHead.jsx';
import CalendarBody from './components/calendarBody.jsx';
// webpack 這邊需要加jsx才能找得到


class App extends Component {
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

    transferYearMonth = (y, m ) => {
        console.log('year: ', y);
        console.log('month ', m);
        this.setState({
            nowYear: y,
            nowMonth: m,
        });
    }

    render() {
        const { nowDate } = this.state;
        return (
            <React.Fragment>
                <div className="calendars">


                    <CalendarHead path={this.props.dataSource}
                        initYearMonth= {this.props.initYearMonth}
                        selectedDate={this.selectedDate}
                        transferYearMonth={this.transferYearMonth}
                    />

                    {/* <h1 className = 'text' > {this.props.text}</h1> */}
                    {/* <h2 className = 'test'>test2</h2> */}
                    <CalendarBody path={this.props.dataSource}
                        selectedDate={nowDate}
                        // transferYearMonth={this.transferYearMonth}
                        nowYear = {this.state.nowYear}
                        nowMonth = {this.state.nowMonth}
                    />
                </div>
            </React.Fragment>

        );
    }
}

export default App;
