import { HttpClientModule } from '@angular/common/http';
import { WeatherService } from './weather.service';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule             // Add this
  ],
  providers: [WeatherService],   // Add this
  bootstrap: [AppComponent]
})
export class AppModule { }