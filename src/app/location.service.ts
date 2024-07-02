import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private locationSource = new BehaviorSubject<string>(null);
  currentLocation = this.locationSource.asObservable();

  constructor() { }

  changeLocation(location: string) {
    this.locationSource.next(location);
  }
}
