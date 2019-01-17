import React, {Component} from 'react';
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

    };
    static defaultProps = {
        // 預設值 props不能為空值
        text: 'Hello world!',
        newText: 'hithere',
    };
    render() {
        return (
            <React.Fragment>
                <div className="calendars">


                    <CalendarHead path={this.props.dataSource}/>
                    {/* <h1 className = 'text' > {this.props.text}</h1> */}
                    {/* <h2 className = 'test'>test2</h2> */}
                    <CalendarBody path={this.props.dataSource}/>
                </div>
            </React.Fragment>

        );
    }
}

export default App;
