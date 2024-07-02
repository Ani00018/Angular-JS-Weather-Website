import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { faFaceSmile } from '@fortawesome/free-solid-svg-icons';
import { faFaceFrown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { WeatherService } from '../Services/weather.service';


@Component({
  selector: 'app-right-container',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './right-container.component.html',
  styleUrls: ['./right-container.component.css'],
})
export class RightContainerComponent implements OnInit {
  faThumbsUp = faThumbsUp;
  faThumbsDown = faThumbsDown;
  faFaceSmile = faFaceSmile;
  faFaceFrown = faFaceFrown;

  weatherData: any;

  constructor(public weatherService: WeatherService) {}

  ngOnInit() {
    this.weatherService.weatherData$.subscribe(data => {
      if (data) {
        this.weatherData = data;
      }
    });
  }

  onTodayClick() {
    this.weatherService.today = true;
    this.weatherService.week = false;
  }

  onWeekClick() {
    this.weatherService.today = false;
    this.weatherService.week = true;
  }

  onCelsiusClick() {
    this.weatherService.celsius = true;
    this.weatherService.fahrenheit = false;
  }

  onFahrenheitClick() {
    this.weatherService.celsius = false;
    this.weatherService.fahrenheit = true;
  }
}