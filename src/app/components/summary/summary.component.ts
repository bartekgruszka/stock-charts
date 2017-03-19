import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html'
})
export class SummaryComponent {

  @Input() private data: Array<any>;
  @Input() private stockInfo: Object;

  constructor() { }

  closeAlert() {
    this.stockInfo = null;
  }

}
