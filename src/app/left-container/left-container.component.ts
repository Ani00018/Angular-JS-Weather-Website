import { Component, NgModule,  Output, EventEmitter } from '@angular/core';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faLocation } from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCloud } from '@fortawesome/free-solid-svg-icons';
import { faCloudRain } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../Services/weather.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';









@Component({
  selector: 'app-left-container',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, HttpClientModule],
  templateUrl: './left-container.component.html',
  styleUrls: ['./left-container.component.css'],
})
export class LeftContainerComponent {
  faMagnifyingGlass:any = faMagnifyingGlass;
  faLocation:any = faLocation;
  faCloud:any = faCloud;
  faCloudRain:any = faCloudRain;

  @Output() celsiusClicked = new EventEmitter<void>();
  @Output() fahrenheitClicked = new EventEmitter<void>();
  @Output() locationSelected = new EventEmitter<string>();

  constructor(public weatherService: WeatherService){}
  public onSearch(location: string){
   this.weatherService.cityName = location;
   this.weatherService.getData();
   this.locationSelected.emit(location);
}


onCelsiusClick() {
  this.celsiusClicked.emit();
}

onFahrenheitClick() {
  this.fahrenheitClicked.emit();
}

celsiusTemperature: number; // Assume this is your Celsius temperature value

  convertToFahrenheit(): void {
    // Convert Celsius to Fahrenheit: F = (C * 9/5) + 32
    const fahrenheit = (this.celsiusTemperature * 9/5) + 32;
    // Update the displayed temperature (e.g., this.temperature = fahrenheit;)
  }



}