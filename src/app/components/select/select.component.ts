import { Component, OnInit, OnChanges, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html'
})
export class SelectComponent implements OnInit {

  @Output() onChangedValue = new EventEmitter<string>();
  @Output() onChangedCompare = new EventEmitter<string>();

  public selectedValue:string;
  public compareWith::Array<string>;
  public choices:Array<string>;

  constructor() {
    // just mocked
    this.choices = [
      'GOOGL',
      'AMZN',
      'ISRG',
      'CHTR',
      'NTES'
    ];
  }

  ngOnInit() {
    this.selectedValue = this.choices[0];
    this.filteredChoices = this.choices.filter((item) => {
      return item !== this.selectedValue;
    })
  }

  onChange(newValue) {
    this.selectedValue = newValue;
    this.onChangedValue.emit(newValue);
    this.filteredChoices = this.choices.filter((item) => {
      return item !== this.selectedValue;
    })
  }

  onChangeCompare(newValues) {
    this.compareWith = newValues
    this.onChangedCompare.emit(newValues);
  }
}
