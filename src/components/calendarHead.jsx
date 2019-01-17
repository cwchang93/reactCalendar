import React, {Component} from 'react';
// import ReactDOM from 'react-dom';
class CalendarHead extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //   isLoading: false,
            travelDataHead: null,
        };
    }

    getData(path) {
        fetch(path)
            .then((response) => {
                return response.json();
            })
            .then((travelDataHead) =>
                this.setState({
                    travelDataHead: travelDataHead,
                })
            )
            .catch((error) => console.log('parsing failed', error));
    }

    componentDidMount() {
        this.getData(this.props.path);
    }

    render() {
        const {travelDataHead} = this.state;
        if (travelDataHead) {
            console.log(this.state.travelDataHead);
            console.log('fromHead', this.props.path);
            return (
                <React.Fragment>
                    <div>CalendarHead is Me!</div>

                    <div className="calendars_tabWrap">
                        {/* <a href="#"
                            className="prev"></a> */}
                        <ul className="tophead">
                            <li className="tophead__month">
                                <a href="#">
                                    <span>2017 7月</span>
                                </a>
                            </li>
                            <li className="tophead__month">
                                <a href="#"
className="active">
                                    <span>2017 8月</span>
                                </a>
                            </li>
                            <li className="tophead__month">
                                <a href="#">
                                    <span>2017 9月</span>
                                </a>
                            </li>
                        </ul>
                        {/* <a href="#"
                            className="next"></a> */}
                    </div>
                </React.Fragment>
            );
        } else {
            return <div>nothing</div>;
        }
    }
}

export default CalendarHead;
