import React, { Component } from 'react';
import axios from 'axios';
import { tsvParse, csvParse } from  "d3-dsv";
import { timeParse } from "d3-time-format";

import ReactDOM from "react-dom";

import Chart from "./CandleStickChartHighlightCandle";
import hammerCandle from '../../candle-patterns/hammer';
import invertedHammerCandle from '../../candle-patterns/invertedHammer';
import morningStar from '../../candle-patterns/morningStar';
import eveningStar from '../../candle-patterns/eveningStar';
import bullishEngulfing from '../../candle-patterns/bullishEngulfing';
import bearishEngulfing from '../../candle-patterns/bearishEngulfing';
import threeWhiteSoliders from '../../candle-patterns/threeWhiteSoliders';
import threeBlackCrows from '../../candle-patterns/threeBlackCrows';

export default class StockChart extends Component {

    constructor(props) {
        super(props);

        this.apiUrl = props.apiUrl;
        const query = new URLSearchParams(window.location.search);
        this.code = query.get('code');

        this.state = { 
            plotData: []
        };
        this.parseDate = timeParse("%Y%m%d");
    }

    componentDidMount() {
        fetch(`data/excel_${this.code.toLocaleLowerCase()}.csv`)
		.then(response => response.text())
		.then(data => csvParse(data, d => {
			d.date = new Date(this.parseDate(d.date).getTime());
			d.open = +d.open;
			d.high = +d.high;
			d.low = +d.low;
			d.close = +d.close;
			d.volume = +d.vol;

			return d;
		}))
		.then(data => {
            console.log(data);
			this.state.plotData = data;
            ReactDOM.render(<Chart code={this.code} data={this.state.plotData} type="hybrid"/>, document.getElementById("chart"));
		});
    }

    componentWillUnmount () {

    }

    onHammerSelect(event) {
        let plotData = this.state.plotData;
        let highlightCandles = hammerCandle(plotData);
        ReactDOM.render(<Chart code={this.code} data={this.state.plotData} type="hybrid" highlightCandle={highlightCandles}/>, document.getElementById("chart"));
    }

    onInvertedHammerSelect(event) {
        let plotData = this.state.plotData;
        let highlightCandles = invertedHammerCandle(plotData);
        ReactDOM.render(<Chart code={this.code} data={this.state.plotData} type="hybrid" highlightCandle={highlightCandles}/>, document.getElementById("chart"));
    }

    onMorningStarSelect(event) {
        let plotData = this.state.plotData;
        let highlightCandles = morningStar(plotData);
        ReactDOM.render(<Chart code={this.code} data={this.state.plotData} type="hybrid" highlightCandle={highlightCandles}/>, document.getElementById("chart"));
    }

    onEveningStarSelect(event) {
        let plotData = this.state.plotData;
        let highlightCandles = eveningStar(plotData);
        ReactDOM.render(<Chart code={this.code} data={this.state.plotData} type="hybrid" highlightCandle={highlightCandles}/>, document.getElementById("chart"));
    }

    onBullishEngulfingSelect(event) {
        let plotData = this.state.plotData;
        let highlightCandles = bullishEngulfing(plotData);
        ReactDOM.render(<Chart code={this.code} data={this.state.plotData} type="hybrid" highlightCandle={highlightCandles}/>, document.getElementById("chart"));
    }

    onBearishEngulfingSelect(event) {
        let plotData = this.state.plotData;
        let highlightCandles = bearishEngulfing(plotData);
        ReactDOM.render(<Chart code={this.code} data={this.state.plotData} type="hybrid" highlightCandle={highlightCandles}/>, document.getElementById("chart"));
    }

    onThreeWhiteSolidersSelect(event) {
        let plotData = this.state.plotData;
        let highlightCandles = threeWhiteSoliders(plotData);
        ReactDOM.render(<Chart code={this.code} data={this.state.plotData} type="hybrid" highlightCandle={highlightCandles}/>, document.getElementById("chart"));
    }

    onThreeBlackCrowsSelect(event) {
        let plotData = this.state.plotData;
        let highlightCandles = threeBlackCrows(plotData);
        ReactDOM.render(<Chart code={this.code} data={this.state.plotData} type="hybrid" highlightCandle={highlightCandles}/>, document.getElementById("chart"));
    }

    render() {
        return (<>
            <div>
                <input type="radio" onChange={this.onHammerSelect.bind(this)} name="pattern"/>
                <label style={{ marginLeft: '10px' }}>Mẫu hình Hammer</label>
            </div>
            <div>
                <input type="radio" onChange={this.onInvertedHammerSelect.bind(this)} name="pattern"/>
                <label style={{ marginLeft: '10px' }}>Mẫu hình Inverted Hammer</label>
            </div>
            <div>
                <input type="radio" onChange={this.onMorningStarSelect.bind(this)} name="pattern"/>
                <label style={{ marginLeft: '10px' }}>Mẫu hình Morning Star</label>
            </div>
            <div>
                <input type="radio" onChange={this.onEveningStarSelect.bind(this)} name="pattern"/>
                <label style={{ marginLeft: '10px' }}>Mẫu hình Evening Star</label>
            </div>
            <div>
                <input type="radio" onChange={this.onBullishEngulfingSelect.bind(this)} name="pattern"/>
                <label style={{ marginLeft: '10px' }}>Mẫu hình Bullish Engulfing</label>
            </div>
            <div>
                <input type="radio" onChange={this.onBearishEngulfingSelect.bind(this)} name="pattern"/>
                <label style={{ marginLeft: '10px' }}>Mẫu hình Bearish Engulfing</label>
            </div>
            <div>
                <input type="radio" onChange={this.onThreeWhiteSolidersSelect.bind(this)} name="pattern"/>
                <label style={{ marginLeft: '10px' }}>Mẫu hình Three White Soliders</label>
            </div>
            <div>
                <input type="radio" onChange={this.onThreeBlackCrowsSelect.bind(this)} name="pattern"/>
                <label style={{ marginLeft: '10px' }}>Mẫu hình Three Black Crows</label>
            </div>
            <hr></hr>
            <div id="chart" class="react-stockchart"></div>
        </>);
    }
}