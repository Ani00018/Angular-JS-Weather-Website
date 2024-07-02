import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LeftContainerComponent } from "./left-container/left-container.component";
import { RightContainerComponent } from "./right-container/right-container.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
//import {HttpClientModule, provideHttpClient, withFetch} from '@angular/common/http';
import { SharedModule } from './shared.module';
import { WeatherService } from './Services/weather.service';




@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    imports: [CommonModule, RouterOutlet, LeftContainerComponent, RightContainerComponent, FontAwesomeModule, SharedModule],
    providers: [WeatherService]
})
export class AppComponent {
  title = 'WeatherApp';
  selectedLocation: string;

  onLocationSelected(location: string) {
    this.selectedLocation = location; // Update selected location
  }

}