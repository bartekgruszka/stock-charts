import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { ApiClient } from './service/api-client'

@Injectable()
export class ApiClientService implements ApiClient {

  constructor(private http:Http) {
    this.http = http;
  }

  public getStockPrices(symbol:string, startDate:string, endDate:string) {
    let query = 'select * from yahoo.finance.historicaldata where symbol = "{symbol}" and startDate = "{startDate}" and endDate = "{endDate}"';
    query = query.replace("{symbol}", symbol).replace("{startDate}", startDate).replace("{endDate}", endDate);

    return this.executeQuery(query).map(res => {
      let response = res.json();
      if (response.query.results == null) {
        return [];
      }

      return response.query.results.quote.map((d) => {
        return {
          date: new Date(d.Date),
          open: d.Open,
          high: d.High,
          low: d.Low,
          close: d.Close,
          volume: d.Volume,
          adj_close: d.Adj_Close
        };
      });

    });
  }

  public getCompanyInfo(symbol:string) {
    let query = 'select * from yahoo.finance.quotes where symbol = "{symbol}"';
    query = query.replace("{symbol}", symbol);

    return this.executeQuery(query).map(res => {
      let response = res.json();
      if (response.query.results == null) {
        return {};
      }

      return {
        symbol: response.query.results.quote.symbol,
        name: response.query.results.quote.Name,
        currency: response.query.results.quote.Currency,
        lastTradeDate: response.query.results.quote.LastTradeDate,
        lastTradePriceOnly: response.query.results.quote.LastTradePriceOnly,
        change: response.query.results.quote.Change,
        percentChange: response.query.results.quote.PercentChange,
        marketCapitalization: response.query.results.quote.MarketCapitalization
      }
    });
  }

  private executeQuery(query:string) {
    return this.http.get("https://query.yahooapis.com/v1/public/yql?q="+encodeURI(query)+"&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys")
  }

}
