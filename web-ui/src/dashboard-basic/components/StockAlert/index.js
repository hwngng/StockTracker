import axios from 'axios';
import React, { Component } from 'react';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

export default class StockAlert extends Component {

    constructor(props) {
        super(props);

        this.apiUrl = props.apiUrl;

        this.state = { 
            
        };

        this.alertOption = {
            "highestInRange": {
                "fromDate": "2020-06-22",
                "toDate": "2021-06-22"
            },
            "lowestInRange": {
                "fromDate": "2020-06-22",
                "toDate": "2021-06-22"
            },
            "priceTrendPattern": [1, -1, 1, -2],
            "TASignals": {
                "sma": 1
            },
            "stockCodes": ["FLC","HAG","HSG","MBB","PDR","PVD","SHB","VIC","VND"]
        }
        
        this.alertResult = {
            "highestInRange": [],
            "lowestInRange": [],
            "priceTrendPattern": [],
            "taSignals": {
            }
        };
    }

    showAlert (type, stockCode) {
        switch (type) {
            case "highestInRange":
                NotificationManager.info(`${stockCode} giá tăng phá đỉnh 1 năm`, "", 3000);
                break;
            case "lowestInRange":
                NotificationManager.info(`${stockCode} giá giảm thủng đáy 1 năm`, "", 3000);
                break;
            case "priceTrendPattern":
                NotificationManager.info(`${stockCode} giá giảm 3 phiên liên tục`, "", 3000);
                break;
            default:
                break;
        }
    }

    createAlerts (alertQueue, stockAlert) {
        let timeout = 100;
        Object.keys(alertQueue).forEach(function (key) {
            if (key !== "taSignals") {
                alertQueue[key].forEach(function(el) {
                    setTimeout(stockAlert.showAlert, (timeout+=1000), key, el);
                });
            }
        });
    }

    removeOldAlert (alertQueue, stockAlert) {
        Object.keys(alertQueue).forEach(function (key) {
            if (key in stockAlert.alertResult) {
                if (key !== "taSignals") {
                    stockAlert.alertResult[key] = stockAlert.alertResult[key].filter(function(value, index, arr){
                        return !alertQueue[key].includes(value);
                    });
                }
            }
        });
    }

    stockAlertSchedule (stockAlert) {
        let alertOption = stockAlert.alertOption;
        let alertQueue = {};
        
        axios.post(stockAlert.apiUrl, alertOption)
        .then(function (response) {
            let tmpAlertResult = response.data;
            Object.keys(tmpAlertResult).forEach(function(key) {
                if (key in stockAlert.alertResult) {
                    if (key !== "taSignals") {
                        // merge arrays
                        tmpAlertResult[key].forEach(function(el) {
                            if (!stockAlert.alertResult[key].includes(el)) {
                                stockAlert.alertResult[key].push(el);
                                if (!(key in alertQueue)) {
                                    alertQueue[key] = [];
                                }
                                alertQueue[key].push(el);
                            }
                        })
                    }
                }
            });
            if (alertQueue && Object.keys(alertQueue).length > 0) {
                stockAlert.createAlerts(alertQueue, stockAlert);
                setTimeout(stockAlert.removeOldAlert, 60000, alertQueue, stockAlert);
            }
        })
    }

    notifyTest() {
        NotificationManager.info('Moshi moshi');
    }

    componentDidMount() {
        let stockAlert = this;
        setInterval(this.stockAlertSchedule, 1500, stockAlert);
    }

    render() {
        return (<NotificationContainer />);
    }
}