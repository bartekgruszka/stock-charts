import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';

import { ApiClientService } from './service/api-client.service';
import { CachedApiClientService } from './service/cached-api-client.service';

@Component({
  selector: 'app-root',
  providers: [ApiClientService, CachedApiClientService, DatePipe],
  templateUrl: './app.component.html'
})
export class AppComponent {

  public startDate: string;
  public endDate: string;
  public symbol: string;
  public compareWith: Array<any>;
  private chartData: Array<any>;
  private datatableData: Array<any>;
  private chartDataCompare: Array<any>;
  private companyInfo: Object;
  private stockInfo: Object;

  constructor(private apiClient:CachedApiClientService, private datepipe: DatePipe) {
    let sixMonths = 180*24*60*60*1000;
    this.endDate = this.datepipe.transform(Date.now(), 'yyyy-MM-dd');
    this.startDate = this.datepipe.transform(Date.now() - sixMonths, 'yyyy-MM-dd');
    this.symbol = "GOOGL";
    this.compareWith = [];
    this.chartDataCompare = [];
  }

  ngOnInit() {
    this.apiClient.getStockPrices(this.symbol, this.startDate, this.endDate).subscribe(response => {
      this.chartData = response;
      this.datatableData = response;
    });
    this.apiClient.getCompanyInfo(this.symbol).subscribe(response => this.companyInfo = response);
  }

  onClickedDate(value) {
    this.stockInfo = this.chartData.find((item) => {
      return this.datepipe.transform(item.date, 'yyyy-MM-dd') === value;
    });
  }

  onBrushed(brushedDates) {
    let brushedStartDate = new Date(brushedDates[0]);
    let brushedEndDate = new Date(brushedDates[1]);
    this.datatableData = this.chartData.filter((item) => {
      return (item.date >= brushedStartDate && item.date <= brushedEndDate);
    });
  }

  onChangedStartDate(newStartDate) {
    this.startDate = newStartDate;
    this.onChange();
    this.onChangedCompare(this.compareWith);
  }

  onChangedEndDate(newEndDate) {
    this.endDate = newEndDate;
    this.onChange();
    this.onChangedCompare(this.compareWith);
  }

  onChangedSymbol(value) {
    this.symbol = value;
    this.onChange();
  }

  onChangedCompare(values) {
    this.compareWith = values;
    let requests = values.map((value) => {
      return this.apiClient.getStockPrices(value, this.startDate, this.endDate);
    });

    Observable.forkJoin(requests).subscribe(res => {
      this.chartDataCompare = res.map(r => {
        return r;
      })
    })
  }

  onChange() {
    this.apiClient.getStockPrices(this.symbol, this.startDate, this.endDate).subscribe(response => {
      this.chartData = response;
      this.datatableData = response;
    });
    this.apiClient.getCompanyInfo(this.symbol).subscribe(response => this.companyInfo = response);
  }

}
