import React from 'react';
import { Route } from "react-router-dom";

import StockTicker from "./components/StockTicker";
import StockChart from "./components/StockChart";
import AlertSettings from "./components/AlertSettings";

const Main = (props) => (
    <main role="main" className="col-sm-9 ml-sm-auto col-md-11 pt-3">
      <h1>Trang chủ</h1>
      <Route exact path="/" render={() => <StockTicker apiUrl="http://localhost:5000/stock-ticker"/> } />
      <Route path="/stock-ticker" render={() => <StockTicker apiUrl="http://localhost:5000/stock-ticker"/> } />
      <Route path="/stock-chart" render={() => <StockChart apiUrl="http://localhost:5000/stock-chart"/> } />
      <Route exact path="/alert-settings" render={() => <AlertSettings /> } />
    </main>
);

export default Main;
