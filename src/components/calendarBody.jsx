import React, {Component} from 'react';
class CalendarBody extends Component {
    state = { }

    render() {
        return (
            <React.Fragment>
                <div className="bodycalendar">
                    <div className="weekcontainer">
                        <div>星期日</div>
                        <div>星期一</div>
                        <div>星期二</div>
                        <div>星期三</div>
                        <div>星期四</div>
                        <div>星期五</div>
                        <div>星期六</div>
                    </div>
                    <div className="daycontainer">
                        <div className="day">
                            <span className="daynum">12</span>
                            <span></span>
                            hithere1
                        </div>
                        <div className="day">
                            hithere2
                        </div>
                        <div className="day">
                            hithere3
                        </div>
                        <div className="day">
                            hithere4
                        </div>
                        <div className="day">
                            hithere5
                        </div>
                        <div className="day">
                            hithere6
                        </div>
                        <div className="day">
                            hithere7
                        </div>
                        <div className="day">
                            hithere8
                        </div>


                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default CalendarBody;
