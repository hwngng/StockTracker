import React, { Component } from 'react';

export default class AlertSettings extends Component {

    constructor(props) {
        super(props);

        this.alertOptionChoices = {
            "highestInRange": {
                desc: "Cao nhất trong thời gian"
            },
            "lowestInRange": {
                desc: "Thấp nhất trong thời gian"
            },
            "priceTrendPattern": {
                desc: "Xu hướng giá"
            },
            "TASignals": {
                desc: "Dựa trên tín hiệu kỹ thuật"
            }
        };
       
        this.PriceTrend = {
            '1': {
                value: 1,
                desc: "Tăng"
            },
            '-1': {
                value: -1,
                desc: "Giảm"
            },
            '0': {
                value: 0,
                desc: "Không đổi"
            },
            '-2': {
                value: -2,
                desc: "Bỏ qua"
            }
        }

        this.TASignalCondition = {
            "0": {
                value: 0,
                desc: "giá hiện tại cắt lên"
            },
            "1": {
                value: 1,
                desc: "giá hiện tại cắt xuống"
            }
        }

        this.TechnicalIndicator = {
            sma: {
                value: "sma",
                desc: "đường SMA"
            }
        }

        this.AvailStockCodes = ["FLC","HAG","HSG","MBB","PDR","PVD","SHB","VIC","VND"];

        this.state = { 
            alertOptions: {
                // "highestInRange": {
                //     "fromDate": "2020-06-22",
                //     "toDate": "2021-06-22"
                // },
                // "lowestInRange": {
                //     "fromDate": "2020-06-22",
                //     "toDate": "2021-06-22"
                // },
                // "priceTrendPattern": [1, -1, 1, -2],
                // "TASignals": {
                //     "sma": 1
                // },
                "stockCodes": [...this.AvailStockCodes]
            }
        };

        let localAlertOptions = localStorage.getItem("alertOptions");
        if (localAlertOptions) {
            try {
                this.state.alertOptions = JSON.parse(localAlertOptions);
            } catch (e) {
               
            }
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

    componentDidMount() {
        
    }

    handleChangeOption(event, alertOptionKeyOld) {
        let alertOptions = this.state.alertOptions;
        let alertOptionKeyNew = event.target.value;
        if (alertOptionKeyNew in alertOptions) {
            alert("Đã tồn tại điều kiện này!");
            return;
        }
        if (alertOptionKeyOld != alertOptionKeyNew) {
            Object.defineProperty(alertOptions, alertOptionKeyNew, Object.getOwnPropertyDescriptor(alertOptions, alertOptionKeyOld));
            delete alertOptions[alertOptionKeyOld];
            switch(alertOptionKeyNew) {
                case "highestInRange":
                case "lowestInRange":
                    alertOptions[alertOptionKeyNew] = {"toDate": this.formatDate(new Date())};
                    break;
                case "TASignals":
                    alertOptions[alertOptionKeyNew] = {sma:0};
                    break;
                case "priceTrendPattern":
                    alertOptions[alertOptionKeyNew] = [];
                    break;
                default:
                    alertOptions[alertOptionKeyNew] = {};
                    break;

            }
            
        }
        this.setState({alertOptions});
    }

    handleChangeTrend(event, idx) {
        let alertOptions = this.state.alertOptions;
        alertOptions["priceTrendPattern"][idx] = event.target.value;
        this.setState({alertOptions});
    }

    handleChangePriceTrendDay(event) {
        let alertOptions = this.state.alertOptions;
        if (parseInt(event.target.value) > 0) {
            alertOptions["priceTrendPattern"] = Array(parseInt(event.target.value)).fill(-2);
        } else {
        }
        this.setState({alertOptions});
    }

    handleChangeRangeHighestToDate(event) {
        let alertOptions = this.state.alertOptions;
        alertOptions["highestInRange"]["toDate"] = event.target.value;
        this.setState({alertOptions});
    }

    handleChangeRangeHighestFromDate(event) {
        let alertOptions = this.state.alertOptions;
        alertOptions["highestInRange"]["fromDate"] = event.target.value;
        this.setState({alertOptions});
    }

    handleChangeRangeLowestToDate(event) {
        let alertOptions = this.state.alertOptions;
        alertOptions["lowestInRange"]["toDate"] = event.target.value;
        this.setState({alertOptions});
    }

    handleChangeRangeLowestFromDate(event) {
        let alertOptions = this.state.alertOptions;
        alertOptions["lowestInRange"]["fromDate"] = event.target.value;
        this.setState({alertOptions});
    }

    handleChangeTA(event, taKeyOld) {
        let alertOptions = this.state.alertOptions;
        let taKeyNew = event.target.value;
        if (taKeyOld != taKeyNew) {
            Object.defineProperty(alertOptions, taKeyNew, Object.getOwnPropertyDescriptor(alertOptions, taKeyOld));
            delete alertOptions[taKeyOld];
            switch(taKeyNew) {
                case "sma":
                    alertOptions[taKeyNew] = 10;
                default:
                    alertOptions[taKeyNew] = {};
                    break;

            }
            
        }
        this.setState({alertOptions});
    }

    handleChangeTACondition(event, taKey, taConditionOld) {
        let alertOptions = this.state.alertOptions;
        let taConditionNew = event.target.value;
        if (taConditionOld != taConditionNew) {
            switch(taKey) {
                case "sma":
                    alertOptions["TASignals"][taKey] = taConditionNew;
                default:
                    alertOptions["TASignals"][taKey] = taConditionNew;
                    break;

            }
            
        }
        this.setState({alertOptions});
    }

    renderTAParameters(taKey) {
        switch (taKey) {
            case "sma":
                return (
                    <>
                        <label> 10 ngày</label>
                    </>
                );
                break;
            default:
                break;
        }
    }

    renderAlertOptionInput (alertOptionKey, alertOptionValue) {
        console.log(alertOptionValue);
        switch (alertOptionKey) {
            case 'highestInRange':
                return (
                    <>
                        <select value={alertOptionKey} onChange={(e) => this.handleChangeOption(e, alertOptionKey)}>
                            {Object.keys(this.alertOptionChoices).map(choiceKey => {
                                return (<option value={choiceKey} key={choiceKey}>{this.alertOptionChoices[choiceKey].desc}</option>)
                            })}
                        </select>
                        <label> tính ngược từ ngày </label>
                        <input type="date" value={alertOptionValue.toDate ? alertOptionValue.toDate : this.formatDate(new Date())} onChange={this.handleChangeRangeHighestToDate.bind(this)}/>
                        <label> trở về </label>
                        <input type="text" pattern="[0-9]*" value={alertOptionValue.fromDate ?? "0"} onChange={this.handleChangeRangeHighestFromDate.bind(this)} />
                        <label> ngày trước</label>
                    </>
                );
            case 'lowestInRange':
                return (
                    <>
                        <select value={alertOptionKey} onChange={this.handleChangeOption.bind(this)}>
                            {Object.keys(this.alertOptionChoices).map(choiceKey => {
                                return (<option value={choiceKey} key={choiceKey}>{this.alertOptionChoices[choiceKey].desc}</option>)
                            })}
                        </select>
                        <label> tính ngược từ ngày </label>
                        <input type="date" value={alertOptionValue.toDate ?? this.formatDate(new Date())} onChange={this.handleChangeRangeLowestToDate.bind(this)}/>
                        <label> trở về </label>
                        <input type="text" pattern="[0-9]*" value={alertOptionValue.fromDate ?? "0"} onChange={this.handleChangeRangeLowestFromDate.bind(this)} />
                        <label> ngày trước</label>
                    </>
                );
            case 'priceTrendPattern':
                return (
                    <>
                        <select value={alertOptionKey} onChange={(e) => this.handleChangeOption(e, alertOptionKey)}>
                            {Object.keys(this.alertOptionChoices).map(choiceKey => {
                                return (<option value={choiceKey} key={choiceKey}>{this.alertOptionChoices[choiceKey].desc}</option>)
                            })}
                        </select>
                        <label> trong </label>
                        <input type="number" min="1" max="10" step="1" value={alertOptionValue.length} onChange={this.handleChangePriceTrendDay.bind(this)}></input>
                        <label> ngày gần nhất (cho tới hôm nay): </label>
                        {alertOptionValue.map((trend, idx) => {
                            return (
                                <select value={trend} onChange={(e) => this.handleChangeTrend(e, idx)}>
                                    {Object.keys(this.PriceTrend).map((trendKey, idx) => {
                                        return (<option value={trendKey} key={idx}>{this.PriceTrend[trendKey].desc}</option>)
                                    })}
                                </select>
                            );
                        })}
                    </>
                );
            case "TASignals":
                return (
                    <>
                        {Object.keys(alertOptionValue).map(taKey => {
                            return (
                                <>
                                    <select value={alertOptionKey} onChange={(e) => this.handleChangeOption(e, alertOptionKey)}>
                                        {Object.keys(this.alertOptionChoices).map(choiceKey => {
                                            return (<option value={choiceKey} key={choiceKey}>{this.alertOptionChoices[choiceKey].desc}</option>)
                                        })}
                                    </select>
                                    <select value={taKey} onChange={(e) => this.handleChangeTA(e, taKey)}>
                                        {Object.keys(this.TechnicalIndicator).map(ta => {
                                                        return (<option value={ta} key={ta}>{this.TechnicalIndicator[ta].desc}</option>)
                                        })}
                                    </select>
                                    <>{this.renderTAParameters(taKey)}</>
                                    <select value={alertOptionValue[taKey]} onChange={(e) => this.handleChangeTACondition(e, taKey, alertOptionValue[taKey])}>
                                        {Object.keys(this.TASignalCondition).map(taCond => {
                                                return (<option value={taCond} key={taCond}>{this.TASignalCondition[taCond].desc}</option>)
                                        })}
                                    </select>
                                </>
                            );    
                        })}
                    </>
                );
            default:
                return (
                    <>
                        <select onChange={(e) => this.handleChangeOption(e, alertOptionKey)} value={alertOptionKey}>
                            <option value="-1" key="-1">Lựa chọn điều kiện</option>
                            {Object.keys(this.alertOptionChoices).map(choiceKey => {
                                return (<option value={choiceKey} key={choiceKey}>{this.alertOptionChoices[choiceKey].desc}</option>)
                            })}
                        </select>
                    </>
                );
        }
    }

    addCondition(event) {
        event.preventDefault();
        let alertOptions = this.state.alertOptions;
        
        alertOptions['option'+(Object.keys(alertOptions).length+1)] = null;
        this.setState({alertOptions});
    }

    submitForm(event) {
        event.preventDefault();
        let alertOptions = this.state.alertOptions;
        
        console.log(alertOptions);
        localStorage.setItem("alertOptions", JSON.stringify(alertOptions));
    }

    handleChangeStockCode(event) {
        let alertOptions = this.state.alertOptions;
        let stockCode = event.target.value;
        let idx = alertOptions["stockCodes"].indexOf(stockCode);
        if (idx !== -1) {
            alertOptions["stockCodes"].splice(idx, 1);
        }
        this.setState({alertOptions});
    }

    resetCondition(event) {
        event.preventDefault();
        let alertOptions = this.state.alertOptions;
        alertOptions = {"stockCodes": alertOptions["stockCodes"]};
        this.setState({alertOptions});
    }

    render() {
        return (
            <form onSubmit={this.submitForm.bind(this)}>
                <div>
                    {Object.keys(this.state.alertOptions).map(alertOptionKey => {
                        if (alertOptionKey != 'stockCodes') {
                            return (
                                <div key={alertOptionKey}>
                                    {this.renderAlertOptionInput(alertOptionKey, this.state.alertOptions[alertOptionKey])}
                                </div>
                            );
                        }
                    })}
                </div>
                <div>
                    <label>Theo dõi những mã: </label>
                    <div>
                        {this.AvailStockCodes.map(stockCode => {
                            return (
                                <>
                                <input type="checkbox" checked={this.state.alertOptions["stockCodes"].includes(stockCode)} value={stockCode} onChange={this.handleChangeStockCode.bind(this)}/>
                                <label>{stockCode}</label>
                                <br></br>
                                </>
                            );
                        })}
                    </div>
                </div>
                <div>
                    <button onClick={this.addCondition.bind(this)}>Thêm điều kiện</button>
                    <button onClick={this.resetCondition.bind(this)}>Reset điều kiện</button>
                </div>
                <div>
                    <input type="submit" value="Lưu thiết lập"/>
                </div>
            </form>
        );
    }
}