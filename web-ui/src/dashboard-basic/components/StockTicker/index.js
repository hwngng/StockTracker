import React, { Component } from 'react';
import { HubConnectionBuilder, } from '@microsoft/signalr';
import axios from 'axios';

export default class StockTicker extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            stocks: [], 
            loading: true, 
            error: null,
            isMarketOpened : false,
            stockObjs: []
        };

        this.connection = null;
        this.apiUrl = props.apiUrl;

        this.format = {}
        this.format["SFU"] = {};
        this.format["SFU"]["ST"] = [
            "code",
            "stockType",
            "floorCode",
            "basicPrice",
            "floorPrice",
            "ceilingPrice",
            "bidPrice01",
            "bidPrice02",
            "bidPrice03",
            "bidPrice04",
            "bidPrice05",
            "bidPrice06",
            "bidPrice07",
            "bidPrice08",
            "bidPrice09",
            "bidPrice10",
            "bidQtty01",
            "bidQtty02",
            "bidQtty03",
            "bidQtty04",
            "bidQtty05",
            "bidQtty06",
            "bidQtty07",
            "bidQtty08",
            "bidQtty09",
            "bidQtty10",
            "offerPrice01",
            "offerPrice02",
            "offerPrice03",
            "offerPrice04",
            "offerPrice05",
            "offerPrice06",
            "offerPrice07",
            "offerPrice08",
            "offerPrice09",
            "offerPrice10",
            "offerQtty01",
            "offerQtty02",
            "offerQtty03",
            "offerQtty04",
            "offerQtty05",
            "offerQtty06",
            "offerQtty07",
            "offerQtty08",
            "offerQtty09",
            "offerQtty10",
            "totalBidQtty",
            "totalOfferQtty",
            "tradingSessionId",
            "buyForeignQtty",
            "sellForeignQtty",
            "highestPrice",
            "lowestPrice",
            "accumulatedVal",
            "accumulatedVol",
            "matchPrice",
            "matchQtty",
            "currentPrice",
            "currentQtty",
            "projectOpen",
            "totalRoom",
            "currentRoom",
          ];
          this.format["SFU"]["S"] = [
            "code",
            "stockType",
            "floorCode",
            "basicPrice",
            "floorPrice",
            "ceilingPrice",
            "bidPrice01",
            "bidPrice02",
            "bidPrice03",
            "bidQtty01",
            "bidQtty02",
            "bidQtty03",
            "offerPrice01",
            "offerPrice02",
            "offerPrice03",
            "offerQtty01",
            "offerQtty02",
            "offerQtty03",
            "totalBidQtty",
            "totalOfferQtty",
            "tradingSessionId",
            "buyForeignQtty",
            "sellForeignQtty",
            "highestPrice",
            "lowestPrice",
            "accumulatedVal",
            "accumulatedVol",
            "matchPrice",
            "matchQtty",
            "currentPrice",
            "currentQtty",
            "projectOpen",
            "totalRoom",
            "currentRoom",
          ];
          this.format["SMA"] = {};
          this.format["SMA"]["S"] = this.format["SMA"]["ST"] = [
            "code",
            "stockType",
            "tradingSessionId",
            "buyForeignQtty",
            "sellForeignQtty",
            "highestPrice",
            "lowestPrice",
            "accumulatedVal",
            "accumulatedVol",
            "matchPrice",
            "matchQtty",
            "currentPrice",
            "currentQtty",
            "projectOpen",
            "totalRoom",
            "currentRoom",
          ];
          this.format["SBA"] = {};
          this.format["SBA"]["S"] = [
            "code",
            "stockType",
            "bidPrice01",
            "bidPrice02",
            "bidPrice03",
            "bidQtty01",
            "bidQtty02",
            "bidQtty03",
            "offerPrice01",
            "offerPrice02",
            "offerPrice03",
            "offerQtty01",
            "offerQtty02",
            "offerQtty03",
            "totalBidQtty",
            "totalOfferQtty",
            ];
            this.format["SBA"]["ST"] = [
                "code",
                "stockType",
                "bidPrice01",
                "bidPrice02",
                "bidPrice03",
                "bidPrice04",
                "bidPrice05",
                "bidPrice06",
                "bidPrice07",
                "bidPrice08",
                "bidPrice09",
                "bidPrice10",
                "bidQtty01",
                "bidQtty02",
                "bidQtty03",
                "bidQtty04",
                "bidQtty05",
                "bidQtty06",
                "bidQtty07",
                "bidQtty08",
                "bidQtty09",
                "bidQtty10",
                "offerPrice01",
                "offerPrice02",
                "offerPrice03",
                "offerPrice04",
                "offerPrice05",
                "offerPrice06",
                "offerPrice07",
                "offerPrice08",
                "offerPrice09",
                "offerPrice10",
                "offerQtty01",
                "offerQtty02",
                "offerQtty03",
                "offerQtty04",
                "offerQtty05",
                "offerQtty06",
                "offerQtty07",
                "offerQtty08",
                "offerQtty09",
                "offerQtty10",
                "totalBidQtty",
                "totalOfferQtty",
              ];
        this.format["sep"] = "|";

        this.comparer = [
            {
                type: 'up',
                class: 'sort-up',
                fn: (fieldName) => {
                    return (stock1, stock2) => {
                        let val1 = this.parseField(stock1[fieldName]);
                        let val2 = this.parseField(stock2[fieldName]);
                        if (val1 < val2)
                            return -1;
                        else if (val1 > val2)
                            return 1;
                        else 
                            return 0;
                    }
                }
            },
            {
                type: 'down',
                class: 'sort-down',
                fn: (fieldName) => {
                    return (stock1, stock2) => {
                        let val1 = this.parseField(stock1[fieldName]);
                        let val2 = this.parseField(stock2[fieldName]);
                        if (val1 > val2)
                            return -1;
                        else if (val1 < val2)
                            return 1;
                        else 
                            return 0;
                    }
                }
            }
        ];
        this.sortBy =  { fieldName: '', direction: 0, updateCount: 0};
    }

    componentDidMount() {
        let stockTicker = this;

        this.sortBy.fieldName = 'code';
        this.sortBy.direction = 0;


        this.connection = this.connect();
        axios.get('http://localhost:5000/api/stock/snapshot?stockCodes=FLC,HAG,HSG,MBB,PDR,PVD,SHB,VIC,VND')
        .then(function (response) {
            let snapshots = response.data;
            let stockObjs = []
            for (let snapshot of snapshots) {
                let snapshotObj = stockTicker.tryParseMsg(snapshot);
                stockObjs.push(snapshotObj);
            }
            stockObjs = stockTicker.sortStock(stockObjs);
            console.log(stockObjs);
            stockTicker.setState({stockObjs});
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    updateStockMessage(msg) {
        let stockObj = this.tryParseMsg(msg);
        let stockObjs = this.state.stockObjs;

        // if (stockObj['code'] in stockObjs) {
        //     Object.keys(stockObjs[stockObj['code']]).forEach(updateKey => {
        //         if (updateKey in stockObj) {
        //             stockObjs[stockObj['code']][updateKey] = stockObj[updateKey];
        //         }
        //     })
        // }
        let updateIdx = stockObjs.findIndex(s => s['code'] === stockObj['code']);
        let hasSortField = false;
        Object.keys(stockObjs[updateIdx] ?? {}).forEach(updateKey => {
            if (updateKey in stockObj) {
                stockObjs[updateIdx][updateKey] = stockObj[updateKey];
                if (updateKey === this.sortBy.fieldName)
                    hasSortField = true;
            }
        });

        if (hasSortField === true) {
            this.sortBy.updateCount++;
        }
        if (this.sortBy.updateCount > 5) {
            this.sortStock(stockObjs);
            this.sortBy.updateCount = 0;
        }

        this.setState({stockObjs});
    }

    formatFloat(floatStr, precision) {
        if (isNaN(floatStr)) {
            return '';
        }

        let num = parseFloat(floatStr);

        if (!isNaN(num)) {
            return num.toFixed(precision);
        }

        return floatStr;
    }

    connect() {

        let connection = new HubConnectionBuilder()
            .withUrl(this.apiUrl)
            // .configureLogging(LogLevel.Trace)
            .build();

        connection.onclose(
            (e) => {
                if (e) {
                    this.setState({ error: e });
                    console.error('Connection closed with error: ' + e);
                }
                else {
                    console.info('Disconnected');
                }
            }
        );

        connection.on("OnMessageArrived", (message) => {
            this.updateStockMessage(message);
        });

        connection.start()
        .then(() => {  
            console.info('Connected successfully'); 
            this.setState({ loading: false });
        })
        .catch(err => {
            this.setState({ error: err });
            console.error(err.toString());
        });

        return connection;
    }

    parseField(fieldValue) {
        let num = parseFloat(fieldValue);

        if (isNaN(num)) {
            return fieldValue;
        }

        return num;
    }

    sortStock(stockArr) {
        if (this.sortBy.direction < this.comparer.length) {
            stockArr.sort(this.comparer[this.sortBy.direction].fn(this.sortBy.fieldName));
        }

        return stockArr;
    }

    onSortChange(e, fieldName) {
        if (this.sortBy.fieldName != fieldName) {
            this.sortBy.fieldName = fieldName;
            this.sortBy.direction = 0;
        } else {
            this.sortBy.direction = (this.sortBy.direction+1) % this.comparer.length;
        }
        let stockObjs = this.state.stockObjs;
        this.sortStock(stockObjs);
        
        this.setState({stockObjs});
    }

    calcChange(matchPrice, basicPrice) {
        let fbasicPrice = parseFloat(basicPrice);
        let fmatchPrice = parseFloat(matchPrice);

        if (isNaN(fbasicPrice) || isNaN(fmatchPrice)) {
            return NaN;
        } else {
            return fmatchPrice - fbasicPrice;
        }
    }

    calcAvgPrice(accumulatedVal, accumulatedVol) {
        let faccumulatedVal = parseFloat(accumulatedVal);
        let faccumulatedVol = parseFloat(accumulatedVol);
        
        if (isNaN(accumulatedVal) || isNaN(accumulatedVol)) {
            return NaN;
        } else {
            return faccumulatedVal*10e7/(faccumulatedVol*10);
        }
    }

    renderStockTable(stockObjs) {
        return (
            <div>
                <div className="table-responsive">
                    <table className="table table-striped table-bordered align-middle price-table">
                        <colgroup>
                            <col className="col-symbol"></col>
                            <col className="col-price"></col>
                            <col className="col-price"></col>
                            <col className="col-price"></col>
                            <col className="col-vol-lg"></col>
                            <col className="col-price-lg"></col>
                            <col className="col-price"></col>
                            <col className="col-vol"></col>
                            <col className="col-price"></col>
                            <col className="col-vol"></col>
                            <col className="col-price"></col>
                            <col className="col-vol"></col>
                            <col className="col-price"></col>
                            <col className="col-vol"></col>
                            <col className="col-price-sm"></col>
                            <col className="col-price"></col>
                            <col className="col-vol"></col>
                            <col className="col-price"></col>
                            <col className="col-vol"></col>
                            <col className="col-price"></col>
                            <col className="col-vol"></col>
                            <col className="col-price"></col>
                            <col className="col-price"></col>
                            <col className="col-price"></col>
                            <col className="col-vol"></col>
                            <col className="col-vol"></col>
                        </colgroup>
                        <thead>
                            <tr>
                                <th rowSpan="2" className="align-middle sortable" onClick={e => this.onSortChange(e, "code")}>Mã</th>
                                <th rowSpan="2" className="align-middle sortable" onClick={e => this.onSortChange(e, "basicPrice")}>TC</th>
                                <th rowSpan="2" className="align-middle sortable" onClick={e => this.onSortChange(e, "ceilingPrice")}>Trần</th>
                                <th rowSpan="2" className="align-middle sortable" onClick={e => this.onSortChange(e, "floorPrice")}>Sàn</th>
                                <th rowSpan="2" className="align-middle sortable" onClick={e => this.onSortChange(e, "accumulatedVol")}>Tổng KL (x10)</th>
                                <th rowSpan="2" className="align-middle sortable" onClick={e => this.onSortChange(e, "accumulatedVal")}>Tổng GT (Tỷ VND)</th>
                                <th colSpan="6" className="align-middle">Bên mua</th>
                                <th colSpan="3" className="align-middle">Khớp lệnh</th>
                                <th colSpan="6" className="align-middle">Bên bán</th>
                                <th colSpan="3" className="align-middle">Giá</th>
                                <th colSpan="2" className="align-middle">NN</th>
                            </tr>
                            <tr>
                                <th className="align-middle">Giá 3</th>
                                <th className="align-middle">KL 3</th>
                                <th className="align-middle">Giá 2</th>
                                <th className="align-middle">KL 2</th>
                                <th className="align-middle">Giá 1</th>
                                <th className="align-middle">KL 1</th>
                                <th className="align-middle sortable" onClick={e => this.onSortChange(e, "matchPrice")}>Giá</th>
                                <th className="align-middle sortable" onClick={e => this.onSortChange(e, "matchQtty")}>KL</th>
                                <th className="align-middle sortable" onClick={e => this.onSortChange(e, "change")}>+/-</th>
                                <th className="align-middle">Giá 1</th>
                                <th className="align-middle">KL 1</th>
                                <th className="align-middle">Giá 2</th>
                                <th className="align-middle">KL 2</th>
                                <th className="align-middle">Giá 3</th>
                                <th className="align-middle">KL 3</th>
                                <th className="align-middle sortable" onClick={e => this.onSortChange(e, "highestPrice")}>Cao</th>
                                <th className="align-middle sortable" onClick={e => this.onSortChange(e, "avgPrice")}>TB</th>
                                <th className="align-middle sortable" onClick={e => this.onSortChange(e, "lowestPrice")}>Thấp</th>
                                <th className="align-middle sortable" onClick={e => this.onSortChange(e, "buyForeignQtty")}>Mua</th>
                                <th className="align-middle sortable" onClick={e => this.onSortChange(e, "sellForeignQtty")}>Bán</th>
                            </tr>
                        </thead>
                        <tbody>
                        {stockObjs.map(s =>
                            <tr key={s.code}>
                                <td>{s.code}</td>
                                <td>{this.formatFloat(s.basicPrice, 2)}</td>
                                <td>{this.formatFloat(s.ceilingPrice, 2)}</td>
                                <td>{this.formatFloat(s.floorPrice, 2)}</td>
                                <td>{s.accumulatedVol}</td>
                                <td>{this.formatFloat(s.accumulatedVal, 2)}</td>
                                <td>{this.formatFloat(s.bidPrice03, 2)}</td>
                                <td>{s.bidQtty03}</td>
                                <td>{this.formatFloat(s.bidPrice02, 2)}</td>
                                <td>{s.bidQtty02}</td>
                                <td>{this.formatFloat(s.bidPrice01, 2)}</td>
                                <td>{s.bidQtty01}</td>
                                <td>{this.formatFloat(s.matchPrice, 2)}</td>
                                <td>{s.matchQtty}</td>
                                <td>{this.formatFloat(Math.round((s.change = this.calcChange(s.matchPrice, s.basicPrice))*100)/100, 2)}</td>
                                <td>{this.formatFloat(s.offerPrice01, 2)}</td>
                                <td>{s.offerQtty01}</td>
                                <td>{this.formatFloat(s.offerPrice02, 2)}</td>
                                <td>{s.offerQtty02}</td>
                                <td>{this.formatFloat(s.offerPrice03, 2)}</td>
                                <td>{s.offerQtty03}</td>
                                <td>{this.formatFloat(s.highestPrice, 2)}</td>
                                <td>{this.formatFloat(Math.round((s.avgPrice = this.calcAvgPrice(s.accumulatedVal, s.accumulatedVol))*100)/100, 2)}</td>
                                <td>{this.formatFloat(s.lowestPrice, 2)}</td>
                                <td>{s.buyForeignQtty}</td>
                                <td>{s.sellForeignQtty}</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    tryParseMsg (msg) {
        let msgArr = msg.split(this.format["sep"]);
        let msgObj = {};
        let msgType = msgArr[0];
        let stockType = msgArr[2];
        
        if (!msgType || !stockType) {
            return msgObj;
        }

        if (!(msgType in this.format) || !(stockType in this.format[msgType])) {
            return msgObj;
        }

        if (this.format[msgType][stockType].length + 1 !== msgArr.length) {
            return msgObj;
        }

        for (let i = 0; i < this.format[msgType][stockType].length; ++i) {
            msgObj[this.format[msgType][stockType][i]] = msgArr[i+1];
        }

        return msgObj;
    }
        
    render() {
        let contents = this.state.error
        ? <p><em>Error: {this.state.error.message}</em></p>
        : this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderStockTable(this.state.stocks);
        
        contents = this.renderStockTable(this.state.stockObjs);
        return (
            <div>
                <h2>Bảng giá</h2>
                {contents}
            </div>
        );
    }
}