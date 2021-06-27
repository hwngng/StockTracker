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
        this.alertOption = {};
        let alertOptionsStr = localStorage.getItem("alertOptions");
        let alertOptions = {}
        if (alertOptionsStr) {
            try {
                alertOptions = JSON.parse(alertOptionsStr);
                if ("highestInRange" in alertOptions) {
                    alertOptions["highestInRange"].toDate = this.formatDate(new Date(alertOptions["highestInRange"].toDate));
                    let dateOffset = (24*60*60*1000)*parseInt(alertOptions["highestInRange"].fromDate);
                    let fromDate = new Date();
                    fromDate.setTime(new Date(alertOptions["highestInRange"].toDate).getTime() - dateOffset);
                    alertOptions["highestInRange"].fromDate = this.formatDate(new Date(fromDate));
                }
                if ("lowestInRange" in alertOptions) {
                    alertOptions["lowestInRange"].toDate = this.formatDate(new Date(alertOptions["lowestInRange"].toDate));
                    let dateOffset = (24*60*60*1000)*parseInt(alertOptions["lowestInRange"].fromDate);
                    let fromDate = new Date();
                    fromDate.setTime(new Date(alertOptions["lowestInRange"].toDate).getTime() - dateOffset);
                    alertOptions["lowestInRange"].fromDate = this.formatDate(new Date(fromDate));
                }
                this.alertOption = alertOptions;
            } catch (e) {

            }
        }

        console.log(this.alertOption);
        
        this.alertResult = {
            "highestInRange": [],
            "lowestInRange": [],
            "priceTrendPattern": [],
            "taSignals": {
            }
        };

        this.apiRequestIntervalID = 0;
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

    formatDate(date) {
        let year = date.getFullYear();
        let month = date.getMonth()+1;
        let day = date.getDate();
        if (!year) {
            let currentDate = new Date();
            year = currentDate.getFullYear();
            month = currentDate.getMonth();
            day = currentDate.getDate();
        } else if (!month) {
            month = 1;
            day = 1;
        } else if (!day) {
            day = 1;
        }

        return `${year}-${month < 10 ? '0'+month : month}-${day < 10 ? '0'+day : day}`;
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
        this.apiRequestIntervalID = setInterval(this.stockAlertSchedule, 1500, stockAlert);
    }

    componentWillUnmount () {
        clearInterval(this.apiRequestIntervalID);
    }

    render() {
        return (<NotificationContainer />);
    }
}