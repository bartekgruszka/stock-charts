import { Component, OnInit, OnChanges, ViewChild, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';

import * as d3 from 'd3';

@Component({
  selector: 'app-linechart',
  providers: [DatePipe],
  templateUrl: './linechart.component.html'
})
export class LinechartComponent implements OnInit, OnChanges {

  @ViewChild('linechart') private chartContainer: ElementRef;

  @Input() private data: Array<any>;
  @Input() private dataCompare: Array<any>;

  @Output() onClickedDate = new EventEmitter<string>();
  @Output() onBrushed = new EventEmitter<string>();

  private chart;
  private x;
  private y;
  private xPreview;
  private yPreview;
  private valueline;
  private valuelinePreview;
  private brush;
  private width: number;
  private height: number;
  private margin: number;
  private colors: Array<string>;

  constructor(private datepipe: DatePipe) {
    this.colors = [
      'crimson',
      'darkgreen',
      'aqua',
      'deeppink',
      'gold',
      'grey'
    ];
  }

  ngOnInit() {
      this.createChart();
      if (this.data) {
        this.updateChart();
      }
    }

    ngOnChanges() {
      if (this.chart) {
        this.updateChart();
      }
    }

    createChart() {
      let that = this;
      let element = this.chartContainer.nativeElement;

      this.margin = {top: 30, right: 0, bottom: 30, left: 30, between: 30};
      this.width = 850 - this.margin.left - this.margin.right;
      this.height = 400 - this.margin.top - this.margin.bottom;

      this.heightMain = this.height * 0.75;
      this.heightPreview  = this.height * 0.25 - this.margin.between;

      // Set the ranges
      this.x = d3.scaleTime().range([0, this.width]);
      this.y = d3.scaleLinear().range([this.heightMain, 0]);

      this.xPreview = d3.scaleTime().range([0, this.width]);
      this.yPreview = d3.scaleLinear().range([this.heightPreview, 0]);

      // Define the lines
      this.valueline = d3.line()
        .x(function(d) { return that.x(d.date); })
        .y(function(d) { return that.y(d.close); });

      this.valuelinePreview = d3.line()
        .x(function(d) { return that.xPreview(d.date); })
        .y(function(d) { return that.yPreview(d.close); });

      // Define brush
      this.brush = d3.brushX()
          .extent([[0, 0], [this.width, this.heightPreview]])
          .on("brush", function () {
            // On brush
            if (d3.event.sourceEvent === null) return;

            // Recalculates X domain
            that.x.domain(d3.event.selection.map(that.xPreview.invert, that.xPreview));

            // Calculates and emits brushed dates
            let brushedStartDate = that.datepipe.transform(that.xPreview.invert(d3.event.selection[0]), "yyyy-MM-dd");
            let brushedEndDate = that.datepipe.transform(that.xPreview.invert(d3.event.selection[1]), "yyyy-MM-dd");
            that.onBrushed.emit([brushedStartDate, brushedEndDate]);

            // Redraws main line
            that.chart.select(".line")
              .attr("d", that.valueline);

            // Redraws compare lines
            that.chart.selectAll(".lineCompare")
              .attr("d", that.valueline);

            // Redraws X axis
            that.chart.select(".xaxis-main")
                .call(d3.axisBottom(that.x));
          });

      // Adds the svg canvas
      this.chart = d3.select(this.chartContainer.nativeElement)
        .append("svg")
          .attr("width", this.width + this.margin.left + this.margin.right)
          .attr("height", this.height + this.margin.top + this.margin.bottom)
          .on("click", function () {
            let clickedDate = that.datepipe.transform(that.x.invert(d3.mouse(this)[0]), "yyyy-MM-dd");
            that.onClickedDate.emit(clickedDate);
          })
      ;

      // Adds clip path
      this.chart
        .append("defs")
        .append("clipPath").attr("id", "clip")
        .append("rect").attr("width", this.width).attr("height", this.heightMain)
        ;

      // Adds main line
      this.chart
        .append("path")
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .attr("transform", "translate(" + this.margin.left + ", "+this.margin.top+")")
        .attr("stroke", "steelblue")
        .attr("clip-path", "url(#clip)");

      // Adds preview line
      this.chart.append("path")
        .attr("class", "linePreview")
        .attr("fill", "none")
        .attr("transform", "translate(" + this.margin.left + ", " + (this.margin.top + this.heightMain + this.margin.between) + ")")
        .attr("stroke", "steelblue");

      // Adds axis
      this.chart.append("g")
        .attr("class", "xaxis-main")
        .attr("transform", "translate("+this.margin.left+"," + (this.heightMain + this.margin.top) + ")");

      this.chart.append("g")
        .attr("class", "yaxis-main")
        .attr("transform", "translate(" + this.margin.left + ", " + (this.margin.top) + ")");

      this.chart.append("g")
        .attr("class", "xaxis-preview")
        .attr("transform", "translate("+this.margin.left+"," + (this.heightMain + this.heightPreview + this.margin.top + this.margin.between) + ")");

      this.chart.append("g")
        .attr("class", "yaxis-preview")
        .attr("transform", "translate(" + this.margin.left + ", " + (this.margin.top + this.heightMain + this.margin.between) + ")");

      // Adds brush
      this.chart.append("g")
        .attr("class", "brush")
        .attr("transform", "translate(" + (this.margin.left + 1) + ", " + (this.margin.top + this.heightMain + this.margin.between - 1) + ")")
        .call(this.brush)
        .call(this.brush.move, this.xPreview.range());
    }

    updateChart() {
      this.x.domain(d3.extent(this.data, function(d) { return d.date; }));
      this.y.domain([d3.min(this.data, function(d) { return d.close; }), d3.max(this.data, function(d) { return d.close; })]);

      this.xPreview.domain(d3.extent(this.data, function(d) { return d.date; }));
      this.yPreview.domain([d3.min(this.data, function(d) { return d.close; }), d3.max(this.data, function(d) { return d.close; })]);

      this.chart.select(".line")
        .data([this.data])
        .attr("d", this.valueline);

      this.addCompareLines();

      // Redraws preview line
      this.chart.select(".linePreview")
        .data([this.data])
        .attr("d", this.valuelinePreview);

      // Redraws axis
      this.chart.select(".xaxis-main")
        .call(d3.axisBottom(this.x));

      this.chart.select(".xaxis-preview")
        .call(d3.axisBottom(this.xPreview));

      this.chart.select(".yaxis-main")
        .call(d3.axisLeft(this.y));

      this.chart.select(".yaxis-preview")
        .call(d3.axisLeft(this.yPreview).ticks(2));

      // Resets brush
      this.chart.selectAll(".brush")
        .call(this.brush.move, this.xPreview.range());
    }

    private addCompareLines() {
      // Remove all compare lines
      this.chart.selectAll(".lineCompare").remove();

      this.dataCompare.forEach((data, index) => {
        // Recalculates Y domain
        this.y.domain([
          Math.min(this.y.domain()[0], d3.min(data, function(d) { return d.close; })),
          Math.max(this.y.domain()[1], d3.max(data, function(d) { return d.close; }))
        ]);

        // Redraws Y axis
        this.chart.select(".yaxis-main")
            .call(d3.axisLeft(this.y));

        // Adds compare line
        this.chart
          .append("path")
          .data([data])
          .attr("class", "lineCompare")
          .attr("fill", "none")
          .attr("stroke-width", 2)
          .attr("transform", "translate(" + this.margin.left + ", "+this.margin.top+")")
          .attr("stroke", this.colors[index])
          .attr("clip-path", "url(#clip)")
          .attr("d", this.valueline);

          // Redraws main line
          this.chart.select('.line')
            .data([this.data])
            .attr("d", this.valueline);
      });
    }
}
