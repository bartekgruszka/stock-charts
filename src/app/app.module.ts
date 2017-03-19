import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import {DataTableModule} from "angular2-datatable";

import { AppComponent } from './app.component';
import { LinechartComponent } from './components/linechart/linechart.component';
import { SelectComponent } from './components/select/select.component';
import { DatatableComponent } from './components/datatable/datatable.component';
import { SummaryComponent } from './components/summary/summary.component';

@NgModule({
  declarations: [
    AppComponent,
    LinechartComponent,
    SelectComponent,
    DatatableComponent,
    SummaryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    DataTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
