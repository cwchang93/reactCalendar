import React, {Component} from 'react';
// import ReactDOM from 'react-dom';
class CalendarHead extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //   isLoading: false,
            travelDataHead: null,
            mostPreMonth: '',
            latestMonth: '',
        };
    }

    renderDataFunc(jsonData, jsonKey) {
        const newArr = [];
        for (let i = 0; i < jsonData.length; i++) {
            newArr.push(jsonData[i][jsonKey]);
            // console.log(newArr);
        }
        console.log(newArr);
        return newArr;
    }

    sortedDateFunc(unsortedArr) {
        const sortedArr = unsortedArr.sort();
        console.log(sortedArr);
        const mostPreMonth = sortedArr[0];
        const latestMonth = sortedArr[sortedArr.length - 1];
        console.log(mostPreMonth);
        console.log(latestMonth);
        this.setState({
            mostPreMonth: mostPreMonth,
            latestMonth: latestMonth,
        });
    }

    handleCalendarFormat() {}

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
        const {travelDataHead} = this.state;

        this.getData(this.props.path);
    // this.sortedDateFunc(this.renderDataFunc(travelDataHead, 'date'));
    }

    render() {
        const {travelDataHead, mostPreMonth, latestMonth} = this.state;
        if (travelDataHead) {
            // console.log(this.state.travelDataHead);
            // console.log('fromHead', this.props.path);
            // this.renderDataFunc(travelDataHead, 'date');
            this.sortedDateFunc(this.renderDataFunc(travelDataHead, 'date'));
            // console.log(mostPreMonth);
            // console.log(latestMonth);

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
