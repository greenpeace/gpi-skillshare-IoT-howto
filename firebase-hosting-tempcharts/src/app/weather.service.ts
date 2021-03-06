import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class WeatherService {

  constructor(private _http: HttpClient) { }

  reportData() {
    return this._http.get<any[]>("<Your Weather Data")
      .pipe(map((result: any) => result));
  }
}