export interface ApiClient {

  public getStockPrices(symbol:string, startDate:string, endDate:string) ;

  public getCompanyInfo(symbol:string)

}
