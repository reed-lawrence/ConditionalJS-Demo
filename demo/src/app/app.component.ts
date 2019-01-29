import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Chart } from 'chart.js';
import { bootstrap } from 'bootstrap';
import * as prism from 'prismjs';
import * as format from 'conditionaljs';
import { TableVal } from './classes/table-val';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild('donutcanvas') donutcanvas: ElementRef;
  @ViewChild('stackedlinecanvas') stackedlinecanvas: ElementRef;

  // Prism highlights
  test = null;

  // Donut variables
  donutChart: Chart = null;
  donutStartColor = '#e96443';
  donutEndColor = '#904e95';
  donutData: number[] = [];
  donutCodeShown = false;

  // Stacked line chart variables
  stackedLineChart: Chart = null;
  stackedLineChartStartColor = '#ffd89b';
  stackedLineChartEndColor = '#19547b';
  stackedLineChartData: number[][] = [];
  stackedLineChartCodeShown = false;

  // Conditional formatting table variables
  tableValsOrdered: TableVal[] = [];
  tableValsUnordered: TableVal[] = [];
  tableValsColorStart = '#f8696b';
  tableValsColorMiddle = '#fded84';
  tableValsColorEnd = '#6aba7d';
  tableValsCodeShown = false;


  ToggleEle(ele: any){
    $(ele).slideToggle('fast');
  }

  async PlotDonut(colorStart: string, colorEnd: string, data: any[]): Promise<boolean> {
    return new Promise(resolve => {
      const colors = format.generateTwoWayGradient(colorStart, colorEnd, data.length);
      console.log(colors);
      const labels = [];

      for (let i = 0; i < data.length; i++) {
        labels.push('Label ' + i);
      }

      this.donutChart = new Chart(this.donutcanvas.nativeElement, {
        type: 'doughnut',
        data: {
          datasets: [{
            data: data,
            backgroundColor: colors,
          }],
          labels: labels
        },
        options: {
          responsive: true,
          legend: {
            display: false
          },
          animation: {
            onComplete: (animation) => {
              resolve(true);
            }
          }
        }
      });
    });
  }

  async GenerateTableVals(data: number[]): Promise<TableVal[]> {
    return new Promise(resolve => {
      const tableColors = format.generateThreeWayGradient('#f8696b', '#fded84', '#6aba7d', data.length);

      const min = Math.min(...data);
      const max = Math.max(...data);
      const arr: TableVal[] = [];
      for (const d of data) {
        arr.push({
          color: format.getConditionalValueColor(d, min, max, tableColors),
          value: d
        });
      }
      resolve(arr);
    });
  }

  async PlotLineChart(dataplots: number[][]): Promise<boolean> {
    return new Promise(resolve => {
      const colors = format.generateTwoWayGradient(this.stackedLineChartStartColor, this.stackedLineChartEndColor, dataplots.length);
      console.log(colors);
      const labels: string[] = [];

      const datasets: Chart.ChartDataSets[] = [];
      for (let i = 0; i < dataplots.length; i++) {
        datasets.push({
          label: 'Dataset ' + (i + 1),
          borderColor: colors[i],
          backgroundColor: colors[i],
          data: dataplots[i]
        });
      }

      for (let i = 0; i < dataplots[0].length; i++) {
        labels.push('X' + (i + 1));
      }

      this.stackedLineChart = new Chart(this.stackedlinecanvas.nativeElement, {
        type: 'line',
        data: {
          labels: labels,
          datasets: datasets
        },
        options: {
          responsive: true,
          tooltips: {
            mode: 'index',
          },
          hover: {
            mode: 'index'
          },
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              display: false,
              scaleLabel: {
                display: false,
                labelString: 'Month'
              }
            }],
            yAxes: [{
              display: false,
              stacked: true,
              scaleLabel: {
                display: false,
                labelString: 'Value'
              }
            }]
          },
          animation: {
            onComplete: (animation) => {
              resolve(true);
            }
          }
        }
      });
    });
  }

  ngOnInit() {
    for (let i = 0; i < 10; i++) {
      this.donutData.push(Math.round(Math.random() * 10));
    }

    for (let i = 0; i < 4; i++) {
      this.stackedLineChartData.push([]);
      for (let j = 0; j < 10; j++) {
        this.stackedLineChartData[i].push(Math.round(Math.random() * 10));
      }
    }

    const randomVals: Promise<number[]> =  new Promise(resolve => {
      const unorderedVals = [];
      const promises: Promise<boolean>[] = [];
      for (let i = 0; i < 11; i++) {
        promises.push(new Promise(res => {
          setTimeout(() => {
            unorderedVals.push(Math.floor(Math.random() * 20));
            res(true);
          }, 50);
        }));
      }
      Promise.all(promises).then(done => resolve(unorderedVals));
    });
    

    this.PlotDonut(this.donutStartColor, this.donutEndColor, this.donutData).then(done => console.log('Donut plotted'));
    this.GenerateTableVals([-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]).then(vals => this.tableValsOrdered = vals);
    randomVals.then(unorderedVals => this.GenerateTableVals(unorderedVals).then(vals => this.tableValsUnordered = vals));
    this.PlotLineChart(this.stackedLineChartData).then(done => console.log('Area chart plotted'));

    prism.highlightAll();
  }
}
