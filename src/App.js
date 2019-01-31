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
            isLoad: null,
        };
    }

    componentDidMount() {
        this.setState({ initYearMonth: this.props.initYearMonth, isLoad: true });
    }


    change = (date) => {
        this.setState({ initYearMonth: date });
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

    changePropsData(dataPath, newYear) {
        this.setState({

        });
        // let propsDataSource;
        // propsDataSource = window.myCalendar.props.dataSource;
        // propsDataSource = `./src/json/${data}.json`;
        // console.log(propsDataSource);
        // // console.log('this.props');
        // // console.log(this);
        // console.log(this);
        // console.log(jsonDate['dataSource']);
        // // jsonDate['dataSource'] = propsDataSource;
        // const propsArr = [dataPath, newYear];
        // return propsArr;
        // console.log(propsArr);
        // this.initYearMonth = newYear;
        // this.dataSource = dataPath;

        // return newObj;
    }

    render() {
        return (
            <React.Fragment>
                {this.state.isLoad &&
                    <CalendarAll
                        path={this.props.dataSource}
                        initYearMonth= {this.state.initYearMonth}
                        dataKeySetting= {this.props.dataKeySetting}

                    />
                }


            </React.Fragment>

        );
    }
}

export default App;
