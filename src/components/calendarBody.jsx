import React, { Component } from 'react';

// import tripData from '../json/data1.json'; import for testing data

class CalendarBody extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            travelData: null,
            // propData: this.props,
            weekDay: [
                '星期日',
                '星期一',
                '星期二',
                '星期三',
                '星期四',
                '星期五',
                '星期六',
            ],
        };
    }

    // 不能直接把變數寫在外面render  =>會報錯
    // const weekDay = ['星期日', '星期一', '星期二','星期三',
    //                 '星期四','星期五','星期六'];

  printTest = (num) => {
      console.log(num);
  };

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

  //   renderWeek() {
  //     const weekDay = [];

  //   }

  componentDidMount() {
      this.getData(this.props.path);
      console.log();
  }

  render() {
      const { travelData, weekDay } = this.state;
      console.log(this.props.path);
      //   this.printTest(13);
      //   console.log(travelData);
      console.log(weekDay);

      //   console.log(weekDay);
      if (travelData) {
          return (
              <React.Fragment>
                  <div className="bodycalendar">
                      <div className="weekcontainer">
                          {weekDay.map((wkDay, i) => {
                              return <div key={i}> {wkDay} </div>;
                          })}
                      </div>
                      <div className="daycontainer">
                          <div
                              className="day"
                              onClick={() => {
                                  console.log(this.props.selectedDate);
                              }}
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
                          </div>
                          <div className="day">hithere2</div>
                          <div className="day">hithere3</div>
                          <div className="day">hithere4</div>
                          <div className="day">hithere5</div>
                          <div className="day">hithere6</div>
                          <div className="day">hithere7</div>
                          <div className="day">hithere8</div>
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
