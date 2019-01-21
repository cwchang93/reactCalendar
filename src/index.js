import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
const jsonDate = {
    // dataSource: './json/data.json',
    dataSource: './src/json/data1.json',
    initYearMonth: '201706', // 一開始的月份
    dataKeySetting: {
        // 保證出團
        guaranteed: 'guaranteed',
        // 狀態
        status: 'status',
        // 可賣團位
        available: 'availableVancancy',
        // 團位
        total: 'totalVacnacy',
        // 價格
        price: 'price',

        // status          // 關團
        // available       // 可賣 : 0
        // total           // 團位 : 40
        // price           // $40,999
    },
};
ReactDOM.render( < App {...jsonDate}/>, document.getElementById('root'));
