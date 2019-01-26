import $ from 'jquery'
import format from 'conditionaljs';
import Chart from 'chart.js';


const donutColors = format.generateTwoWayGradient('#0B486B', '#F56217', 10);

const tableVals = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];

let donutChart = null;
let lineAreaChart = null;

/**
 * 
 * @param {string[]} colors 
 */
async function PlotDonut(colors) {
  return new Promise(resolve => {
    let ctx = $('#donut-plot');

    const data = new Array();
    const labels = new Array();
    for (let i = 0; i < colors.length; i++) {
      data.push(Math.round(Math.random() * 10));
      labels.push('Label ' + i);
    }

    donutChart = new Chart(ctx, {
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

async function PlotTable(data) {
  return new Promise(resolve => {
    const tableColors = format.generateThreeWayGradient('#f8696b', '#fded84', '#6aba7d', tableVals.length);

    const tableRowTemplate = '<tr style="background-color: {color}"><td>{value}</td><td>{colorVal}</td></tr>';

    const min = Math.min(...data);
    const max = Math.max(...data);
    for (let d of data) {
      const cellColor = format.getConditionalValueColor(d, min, max, tableColors);
      const tableRow = tableRowTemplate.replace('{color}', cellColor).replace('{value}', d).replace('{colorVal}', cellColor);
      $('#table-body').append(tableRow);
    }
    resolve(true);
  });
}

async function PlotLineChart() {
  return new Promise(resolve => {
    const line1Data = new Array();
    const line2Data = new Array();
    const line3Data = new Array();
    const line4Data = new Array();
    const labels = new Array();
    const colors = format.generateTwoWayGradient('#ffd89b', '#19547b', 4);
    // const colors = format.generateTwoWayGradient('#C33764', '#1D2671', 4);
    for (let i = 0; i < 10; i++) {
      line1Data.push(Math.round(Math.random() * 10));
      line2Data.push(Math.round(Math.random() * 10));
      line3Data.push(Math.round(Math.random() * 10));
      line4Data.push(Math.round(Math.random() * 10));
      labels.push('Point ' + i);
    }

    const ctx = $('#line-area-plot');
    lineAreaChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Dataset 1',
          borderColor: colors[0],
          backgroundColor: colors[0],
          data: line1Data
        }, {
          label: 'Dataset 2',
          borderColor: colors[1],
          backgroundColor: colors[1],
          data: line2Data
        }, {
          label: 'Dataset 3',
          borderColor: colors[2],
          backgroundColor: colors[2],
          data: line3Data
        }, {
          label: 'Dataset 3',
          borderColor: colors[3],
          backgroundColor: colors[3],
          data: line4Data
        }]
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
        }
      }
    });
  });
}

$(() => {
  PlotDonut(donutColors).then(done => console.log('Donut plotted'));
  PlotTable(tableVals).then(done => console.log('Table generated'));
  PlotLineChart().then(done => console.log('Area chart plotted'));
});