import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './App.scss';
import CalendarHead from './components/calendarHead.jsx';
import CalendarBody from './components/calendarBody.jsx';
// webpack 這邊需要加jsx才能找得到


class App extends Component {
    static propTypes = {
        text: PropTypes.string,
    };
    static defaultProps = {
        text: 'Hello world!',
        newText: 'hithere',
    };
    render() {
        return (
            <React.Fragment>
                <div className="calendars">


                    <CalendarHead />
                    {/* <h1 className = 'text' > {this.props.text}</h1> */}
                    {/* <h2 className = 'test'>test2</h2> */}
                    <CalendarBody />
                </div>
            </React.Fragment>

        );
    }
}

export default App;
