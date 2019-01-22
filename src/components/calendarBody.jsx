import React, { Component } from 'react';

// import tripData from '../json/data1.json'; import for testing data

class CalendarBody extends Component {
    constructor(props) {
        super(props);
        this.state = {
            travelData: null,
            weekDay: [
                '星期日',
                '星期一',
                '星期二',
                '星期三',
                '星期四',
                '星期五',
                '星期六',
            ],
            // nowYear: this.props.nowYear,   Q這邊無法傳到State再從state拿
            // nowMonth: this.props.nowMonth,
            // nowMonthLen: null, //  可設計當更改月份時就敲countMonthLen的function重新計算現在的MonthLen
        };
    }

    componentDidMount() {
        this.getData(this.props.path);
    // this.countMonthLen(this.props.nowYear, this.props.nowMonth);
    }

    getData(path) {
        fetch(path)
            .then((response) => {
                return response.json();
            })
            .then((travelData) =>
                this.setState({
                    travelData: travelData,
                })
            )
            .catch((error) => console.log('parsing failed', error));
    }

    countMonthLen(year, month) {
    // 會return 該月的天數
    // Use 1 for January, 2 for February, etc.
    // console.log(new Date(year, month, 0).getDate());
        const nowMonthLen = new Date(year, month, 0).getDate();
        this.setState({
            nowMonthLen: nowMonthLen,
        });
        return new Date(year, month, 0).getDate();
    }

    renderEmptyDays() {
    //  const { nowYear, nowMonth } = this.state;
        const { nowYear, nowMonth } = this.props;
        const currentDate = new Date(nowYear, String(parseInt(nowMonth) - 1), 1);
        const firstDay = currentDate.getDay(); // 取第一天

        const emptyContent = [];
        for (let i = 0; i < firstDay; i++) {
            emptyContent.push(i);
        }
        console.log('firstDay', firstDay);
        console.log('emptyContent', emptyContent);
        return emptyContent;
    }

    renderRealDays() {
        const { nowYear, nowMonth } = this.props;
        const nowMonthLen = new Date(nowYear, nowMonth, 0).getDate();
        const dayContent = [];
        for (let i = 0; i < nowMonthLen; i++) {
            dayContent.push(i);
        }
        return dayContent;
    }

    render() {
        const { travelData, weekDay } = this.state;
        const { nowYear, nowMonth } = this.props;
        // console.log(this.props.path);
        // console.log(weekDay);
        // console.log('55688');
        // console.log('this.props.nowYear8D');
        // console.log(this.props.nowYear);
        // console.log('this.props.nowMonth8D');
        // console.log(this.props.nowMonth);
        // this.countMonthLen(nowYear, nowMonth);
        //   console.log(weekDay);

        const renderDayContent = this.renderRealDays().map((Arr, i) => {
            return (
                <div id={i + 1}
className="day">
                    <div className="generalinfo">
                        <span className="daynum">{i + 1}</span>
                        <span className="guaranteed">成團</span>
                    </div>
                    <div className="details">
                        <span className="status">status</span>
                        <span className="sell">sell</span>
                        <span className="group">group</span>
                        <span className="price">price</span>
                    </div>
                </div>
            );
        });

        if (travelData) {
            console.log('typeof nowMonth');
            console.log(typeof nowMonth);
            console.log('9998DtripData', travelData);
            return (
                <React.Fragment>
                    <div className="bodycalendar">
                        <div className="weekcontainer">
                            {weekDay.map((wkDay, i) => {
                                return <div key={i}> {wkDay} </div>;
                            })}
                        </div>
                        <div className="daycontainer">
                            {/* {this.renderEmptyDays()} */}
                            {this.renderEmptyDays().map((arr, i) => {
                                return <div key={i}
className="day disabled" />;
                            })}
                            {renderDayContent}
                            {/* <div
                                className="day"
                                // onClick={() => {
                                //     console.log(this.props.selectedDate);
                                // }}
                            >
                                <div className="generalinfo">
                                    <span className="daynum">12</span>
                                    <span className="guaranteed">成團</span>
                                </div>
                                <div className="details">
                                    <span className="status">status</span>
                                    <span className="sell">sell</span>
                                    <span className="group">group</span>
                                    <span className="price">price</span>
                                </div>
                            </div> */}
                            {/* <div className="day">hithere2</div>
                            <div className="day">hithere3</div>
                            <div className="day">hithere4</div>
                            <div className="day">hithere5</div>
                            <div className="day">hithere6</div>
                            <div className="day">hithere7</div>
                            <div className="day">hithere8</div> */}
                        </div>
                    </div>
                </React.Fragment>
            );
        } else {
            return <div> Nothing</div>;
        }
    }
}

export default CalendarBody;
