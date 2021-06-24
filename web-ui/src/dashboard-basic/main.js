import React from 'react';
import { Route } from "react-router-dom";

import StockTicker from "./components/StockTicker";
import StockAlert from "./components/StockAlert";

const Main = (props) => (
    <main role="main" className="col-sm-9 ml-sm-auto col-md-11 pt-3">
      <h1>Trang chủ</h1>
      <Route exact path="/" render={() => <StockTicker apiUrl="http://localhost:5000/stock-ticker"/> } />
      <Route path="/stocks" render={() => <StockTicker apiUrl="http://localhost:5000/stock-ticker"/> } />
      <StockAlert apiUrl="http://localhost:5000/api/stock/alert"/>
    </main>
);

export default Main;
