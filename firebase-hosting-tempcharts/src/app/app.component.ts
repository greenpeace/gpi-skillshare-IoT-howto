import { Component } from '@angular/core';
import { WeatherService } from './weather.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
 chart = []; // This will hold our chart info

  constructor(private weather: WeatherService) {}

  ngOnInit() {
     this.weather.reportData()
        .subscribe(res => {
//        console.log(res);
        let maxTempData = res.map(res => res.max_temp);
        let avgTempData = res.map(res => res.avg_temp);
        let minTempData = res.map(res => res.min_temp);

        let maxHumData  = res.map(res => res.max_hum);
        let avgHumData = res.map(res => res.avg_hum);
        let minHumData = res.map(res => res.min_hum);

        let labels = res.map(res => res.data_hora.value);

        this.buildLineChart(
          'tempLineChart',
          'Temperature in C°',
          labels,
          '#E64D3D',
          avgTempData
        );
        this.buildLineChart(
          'humLineChart',
          'Humidity in %',
          labels,
          '#0393FA',
          avgHumData
        );
      })
     }

    buildLineChart(el, label, labels, color, avgData) {
      const elNode = document.getElementById(el);
      new Chart(elNode, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: label,
              data: avgData,
              borderWidth: 1,
              fill: true,
              spanGaps: true,
              lineTension: 0.2,
              backgroundColor: color,
              borderColor: '#3A4250',
              pointRadius: 2
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            xAxes: [
              {
                type: 'time',
                distribution: 'series',
                ticks: {
                  source: 'labels'
                }
              }
            ],
            yAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: label
                },
                ticks: {
                  stepSize: 0.5
                }
              }
            ]
          }
        }
      })
    }
}