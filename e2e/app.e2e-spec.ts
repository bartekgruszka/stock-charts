import { StockChartsPage } from './app.po';

describe('stock-charts App', () => {
  let page: StockChartsPage;

  beforeEach(() => {
    page = new StockChartsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
