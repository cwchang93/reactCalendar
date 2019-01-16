import React, {Component} from 'react';
// import ReactDOM from 'react-dom';
class CalendarHead extends Component {
    state = { }


    render() {
        return (
            <React.Fragment>


                <div>
            CalendarHead is Me!
                </div>

                <div className="calendars_tabWrap">
                    {/* <a href="#"
                        className="prev"></a> */}
                    <ul className="tophead">
                        <li className="tophead__month">
                            <a href="#"><span>2017 7月</span></a>
                        </li>
                        <li className="tophead__month">
                            <a href="#"
                                className="active"><span>2017 8月</span></a>
                        </li>
                        <li className="tophead__month">
                            <a href="#"><span>2017 9月</span></a>
                        </li>
                    </ul>
                    {/* <a href="#"
                        className="next"></a> */}
                </div>
            </React.Fragment>
        );
    }
}


export default CalendarHead;
