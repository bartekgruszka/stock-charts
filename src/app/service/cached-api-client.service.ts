import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiClient } from './api-client'
import { ApiClientService } from './api-client.service';

@Injectable()
export class CachedApiClientService implements ApiClient {

  private cacheStorage: Array<any>

  constructor(private apiClient:ApiClientService) {
    this.cacheStorage = [];
  }

  public getStockPrices(symbol:string, startDate:string, endDate:string) {
    let cacheKey = this.generateCacheKey(symbol+startDate+endDate);

    if (this.cacheStorage[cacheKey] !== undefined) {
      return this.cacheStorage[cacheKey];
    }

    let request = this.apiClient.getStockPrices(symbol, startDate, endDate);

    request.subscribe(r => {
      this.cacheStorage[cacheKey] = Observable.of(r);
    })

    return request;
  }

  public getCompanyInfo(symbol:string) {
    let cacheKey = this.generateCacheKey(symbol);

    if (this.cacheStorage[cacheKey] !== undefined) {
      return this.cacheStorage[cacheKey];
    }

    let request = this.apiClient.getCompanyInfo(symbol);

    request.subscribe(r => {
      this.cacheStorage[cacheKey] = Observable.of(r);
    });

    return request;
  }

  private generateCacheKey(key: string) {
    return encodeURI(key);
  }
}
