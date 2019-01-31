import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.scss';
// import CalendarHead from './components/calendarHead.jsx';
// import CalendarBody from './components/calendarBody.jsx';
import CalendarAll from './components/calendarAll.jsx';
// webpack 這邊需要加jsx才能找得到


class App extends Component {
    // 只要用到props就要指定型別
    static propTypes = {
        text: PropTypes.string,
        dataSource: PropTypes.string,
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
        console.log('transferYMFunc');
        console.log('year: ', y);
        console.log('month ', m);
        this.setState({
            nowYear: y,
            nowMonth: m,
        });
    }

    render() {
        console.log('dataKeySetting, app.js');
        console.log(this.props.dataKeySetting);
        console.log('changeFunc');
        console.log(this.props.changeFunction[1]);
        console.log('this.props.test');
        console.log(this.props.test);

        return (
            <React.Fragment>

                <CalendarAll path={this.props.changeFunction[0] || this.props.dataSource}
                    initYearMonth= {this.props.changeFunction[1] || this.props.initYearMonth}
                    dataKeySetting= {this.props.dataKeySetting}

                />


            </React.Fragment>

        );
    }
}

export default App;
