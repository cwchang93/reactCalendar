import React, {Component} from 'react';
// import ReactDOM from 'react-dom';
class CalendarHead extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //   isLoading: false,
            initialYearMonth: '',
            travelDataHead: null,
            oldestMonth: '',
            oldestYear: '',
            newestMonth: '',
            newestYear: '',
            renderYearArr: [],
            renderMonthArr: [],
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
    // sort=> 整理array排序後

        const sortedArr = unsortedArr.sort();
        console.log(sortedArr);
        const oldestMonth = sortedArr[0].substr(5, 2); // 找出整理後array的第一個的月
        const oldestYear = sortedArr[0].substr(0, 4); // 找出整理後array的第一個的年
        const newestMonth = sortedArr[sortedArr.length - 1].substr(5, 2); // 找出整理後array的第一個月
        const newestYear = sortedArr[sortedArr.length - 1].substr(0, 4); // 找出整理後array的第一個年
        console.log('test in sortedDateFunc');
        console.log('oldestMonth', oldestMonth); // 最左邊月份
        console.log('oldestYear', oldestYear); // 最左邊月份
        console.log('newestMonth', newestMonth); // 最右邊月份
        console.log('newestYear', newestYear); // 最右邊月份
    // this.setState({  這邊若setState會報錯
    //    oldestMonth:oldestMonth,
    //    oldestYear:oldestYear,
    //     newestMonth: newestMonth,
    //     newestYear: newestYear,
    // });
    }

    handleCalendarFormat() {}

    handleRenderYearArr() {}

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
        const {travelDataHead, oldestMonth, newestMonth} = this.state;
        if (travelDataHead) {
            // console.log(this.state.travelDataHead);
            // console.log('fromHead', this.props.path);
            // this.renderDataFunc(travelDataHead, 'date');
            this.sortedDateFunc(this.renderDataFunc(travelDataHead, 'date'));
            // console.log(mostPreMonth);
            // console.log(newestMonth);

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
