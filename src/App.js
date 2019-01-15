import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './App.scss';

class App extends Component {
    static propTypes = {
        text: PropTypes.string,
    };
    static defaultProps = {
        text: 'Hello world!',
    };
    render() {
        return <h1 className='text'>{this.props.text}</h1>;
    }
}

export default App;
