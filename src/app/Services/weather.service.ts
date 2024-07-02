import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocationDetails } from '../Models/LocationDetails';
import { WeatherForecast } from '../Models/WeatherForecast';
import { CurrentTemperature } from '../Models/CurrentTemperature';
import { TodayData } from '../Models/TodayData';
import { WeekData } from '../Models/WeekData';
import { TodaysHighlight } from '../Models/TodaysHighlight';
import { BehaviorSubject, Observable, catchError, switchMap, throwError } from 'rxjs';
import { EnvironmentVariables } from '../Environment/EnvironmentVariables';
import { response } from 'express';
import { WeekDay } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private weatherDataSubject = new BehaviorSubject<any>(null);
  weatherData$ = this.weatherDataSubject.asObservable();
 
  
  //variables which will be filled by API endpoints
  locationDetails?: LocationDetails;
  weatherForecast?: WeatherForecast;

  //variables that have extracted data from API endpoints variables
  currentTemperature: CurrentTemperature;
  
  todayData?: TodayData[] = [];
  weekData?: WeekData[] = []; //right container data

  todaysHighlight: TodaysHighlight;

  // variables to be used for API calls
  cityName:string = 'Srinagar';
  language:string = 'en-US';
  date:string = '20200622';
  units:string = 'm'; 

  currentTime:Date;

  today:boolean = false;
  week:boolean = true;

  //variables to control value
  celsius:boolean = true;
  fahrenheit:boolean = false;
  weatherData: any;

  constructor(private httpClient: HttpClient) {
    this.getData();
   }

   getSummaryImage(summary:string):string{
    //base folder address containing the images
    var baseAddress = 'assets/';

    //respective images
    var cloudySunny = 'cloudyandsunny.jpeg';
    var rainSunny = 'sunny-rainy.webp';
    var windy = 'wind.png';
    var rainy = 'rainy.png';
    var sunny = 'Sun.png';
    var cloudy = 'cloudy.png';
    var haze = 'haze.png';

    if(String(summary).includes("Partly Cloudy") || String(summary).includes("P Cloudy")) return baseAddress+cloudySunny;
    else if(String(summary).includes("Partly Rainy") || String(summary).includes("P Rainy")) return baseAddress + rainSunny;
    else if(String(summary).includes("wind")) return baseAddress + windy;
    else if(String(summary).includes("rain")) return baseAddress + rainy;
    else if(String(summary).includes("Sun")) return baseAddress + sunny;
    else if(String(summary).includes("Cloudy")) return baseAddress + cloudy;
    else if(String(summary).includes("Haze")) return baseAddress + haze;
    return baseAddress + cloudySunny;
   }


   //Method to create chunk of required data for this app left container

   fillTemperatureDataModel(){
    this.currentTime = new Date();
    this.currentTemperature.day = this.weatherForecast['v3-wx-observations-current'].dayOfWeek;
    this.currentTemperature.time = `${String(this.currentTime.getHours()).padStart(2,'0')}:${String(this.currentTime.getMinutes()).padStart(2,'0')}`;
    this.currentTemperature.temperature = this.weatherForecast['v3-wx-observations-current'].temperature;
    this.currentTemperature.location = `${this.locationDetails.location.city[0]}, ${this.locationDetails.location.country[0]}`;
    this.currentTemperature.rainPercent = this.weatherForecast['v3-wx-observations-current'].precip24Hour;
    this.currentTemperature.summaryPhrase = this.weatherForecast['v3-wx-observations-current'].wxPhraseShort;
    this.currentTemperature.summaryImage = this.getSummaryImage(this.currentTemperature.summaryPhrase);
   }

   fillWeekData(){
    var weekCount = 0;


    while(weekCount < 7){
      this.weekData.push(new WeekData());
      this.weekData[weekCount].day = this.weatherForecast['v3-wx-forecast-daily-15day'].dayOfWeek[weekCount].slice(0,3);
      this.weekData[weekCount].tempMax = this.weatherForecast['v3-wx-forecast-daily-15day'].calendarDayTemperatureMax[weekCount];
      this.weekData[weekCount].tempMin = this.weatherForecast['v3-wx-forecast-daily-15day'].calendarDayTemperatureMin[weekCount];
      this.weekData[weekCount].summaryImage = this.getSummaryImage(this.weatherForecast['v3-wx-forecast-daily-15day'].narrative[weekCount]);

      weekCount++;
    }
   }

   fillTodayData(){
    var todayCount = 0;

    while(todayCount < 7){
      this.todayData.push(new TodayData());
      this.todayData[todayCount].time = this.weatherForecast['v3-wx-forecast-hourly-10day'].validTimeLocal[todayCount].slice(11,16);
      this.todayData[todayCount].temperature = this.weatherForecast['v3-wx-forecast-hourly-10day'].temperature[todayCount];
      this.todayData[todayCount].summaryImage = this.getSummaryImage(this.weatherForecast['v3-wx-forecast-hourly-10day'].wxPhraseShort[todayCount]);
      todayCount++;
    }
  }

  getTimeFromString(localTime: string){
    return localTime.slice(11,16);
  }

  //Method to get today's highlight data from the base variable 
  fillTodaysHighlight(){
    this.todaysHighlight.airQuality = this.weatherForecast['v3-wx-globalAirQuality'].globalairquality.airQualityIndex;
    this.todaysHighlight.humidity = this.weatherForecast['v3-wx-observations-current'].relativeHumidity;
    this.todaysHighlight.sunrise = this.getTimeFromString(this.weatherForecast['v3-wx-observations-current'].sunriseTimeLocal);
    this.todaysHighlight.sunset = this.getTimeFromString(this.weatherForecast['v3-wx-observations-current'].sunsetTimeLocal);
    this.todaysHighlight.uvIndex = this.weatherForecast['v3-wx-observations-current'].uvIndex;
    this.todaysHighlight.visibility = this.weatherForecast['v3-wx-observations-current'].visibility;
    this.todaysHighlight.windStatus = this.weatherForecast['v3-wx-observations-current'].windSpeed;
  }

   prepareData():void{
    this.fillTemperatureDataModel();
    this.fillWeekData();
    this.fillTodayData();
    this.fillTodaysHighlight();
    console.log(this.currentTemperature);
    console.log(this.weekData);
    console.log(this.todayData);
    console.log(this.todaysHighlight);
   }

   onCelsiusClick() {
    this.celsius = true;
    this.fahrenheit = false;
    if (!this.celsius) {
      this.currentTemperature.temperature = this.fahrenheitToCelsius(this.currentTemperature.temperature);
    }
  }
  
  onFahrenheitClick() {
    this.celsius = false;
    this.fahrenheit = true;
    if (!this.fahrenheit) {
      this.currentTemperature.temperature = this.celsiusToFahrenheit(this.currentTemperature.temperature);
    }
  }


   celsiusToFahrenheit(celsius: number): number{
    return +((celsius * 1.8) + 32).toFixed(2);
   }

   fahrenheitToCelsius(fahrenheit: number): number{
    return +((fahrenheit - 32) * 0.555).toFixed(2);
   }

   convertTemperaturesToFahrenheit() {
    if (!this.celsius) return; // Already in Fahrenheit
  
    // Convert temperature in currentTemperature
    this.currentTemperature.temperature = this.celsiusToFahrenheit(this.currentTemperature.temperature);
  
    // Convert temperatures in todayData and weekData
    this.todayData.forEach(data => data.temperature = this.celsiusToFahrenheit(data.temperature));
    this.weekData.forEach(data => {
      data.tempMax = this.celsiusToFahrenheit(data.tempMax);
      data.tempMin = this.celsiusToFahrenheit(data.tempMin);
    });
  }
  


  //process to get location details 
  getlocationDetails(cityName: string, language: string):Observable<LocationDetails>{
    return this.httpClient.get<LocationDetails>(EnvironmentVariables.weatherApiLocationbaseURL,{
      headers: new HttpHeaders()
      .set(EnvironmentVariables.xRapidApiKeyName,EnvironmentVariables.xRapidApiKeyValue)
      .set(EnvironmentVariables.xRapidApiHostName,EnvironmentVariables.xRapidApiHostValue),
      params: new HttpParams()
      .set('query',cityName)
      .set('language',language)
    });
  }

  getWeatherReport(date:string, latitude:number, longitude: number, language:string, units:string):Observable<WeatherForecast>{
    return this.httpClient.get<WeatherForecast>(EnvironmentVariables.weatherApiForecastbaseURL, {
      headers: new HttpHeaders()
      .set(EnvironmentVariables.xRapidApiKeyName,EnvironmentVariables.xRapidApiKeyValue)
      .set(EnvironmentVariables.xRapidApiHostName,EnvironmentVariables.xRapidApiHostValue),
      params: new HttpParams()
      .set('date', date)
      .set('latitude', latitude.toString())
      .set('longitude', longitude.toString())
      .set('language', language)
      .set('units', units)
    });
  }

  getData() {
    this.todayData = [];
    this.weekData = [];
    this.currentTemperature = new CurrentTemperature();
    this.todaysHighlight = new TodaysHighlight();
    let latitude = 0;
    let longitude = 0;

    this.getlocationDetails(this.cityName, this.language).pipe(
      switchMap(response => {
        this.locationDetails = response;
        latitude = this.locationDetails.location.latitude[0];
        longitude = this.locationDetails.location.longitude[0];

        return this.getWeatherReport(this.date, latitude, longitude, this.language, this.units);
      })
    ).subscribe(response => {
      this.weatherForecast = response;
      this.prepareData();
      this.weatherDataSubject.next({
        currentTemperature: this.currentTemperature,
        todayData: this.todayData,
        weekData: this.weekData,
        todaysHighlight: this.todaysHighlight
      });
    });
  }
}

