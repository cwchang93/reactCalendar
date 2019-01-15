import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
const jsonDate = {
    dataSource: './json/data.json',
    initYearMonth: '201803',
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
    },
};
ReactDOM.render( < App {...jsonDate}/>, document.getElementById('root'));
