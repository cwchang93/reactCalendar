import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
const jsonDate = {
    // dataSource: './json/data.json',
    dataSource: './src/json/data3.json',
    initYearMonth: '201611', // 一開始的月份
    // 待辦:
    // Head
    // 1. ok initYearMonth輸入13或非12的月份箭頭會可以多跑一格，需用regex加在前面  head
    // 2. 版面到底背景亮  ok
    // 3. 綁點擊的箭頭  ok
    // 4. 頭尾兩邊的月份不能點=> render的變數需要更正  ok
    // Body
    // 1.

    // "certain": false,
    // "date": "2017/08/26",
    // "price": 909,
    // "onsell": 87,
    // "total": 497,
    // "state": "報名"


    dataKeySetting: {
        // 保證出團
        guaranteed: 'guaranteed', // 'certain',
        // 狀態
        status: 'status', // 'state',
        // 可賣團位
        available: 'availableVancancy', // 'onsell',
        // 團位
        total: 'totalVacnacy', // 'total', //
        // 價格
        price: 'price',

        // status          // 關團
        // available       // 可賣 : 0
        // total           // 團位 : 40
        // price           // $40,999
    },
};
ReactDOM.render( < App {...jsonDate}/>, document.getElementById('root'));
