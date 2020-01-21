import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgxFileDropModule } from 'ngx-file-drop';
import { Ng5SliderModule } from 'ng5-slider';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PadComponent } from './home/pad/pad.component';
import { HomeComponent } from './home/home.component';
import { SquareComponent } from './home/pad/square/square.component';
import { SequencerComponent } from './home/sequencer/sequencer.component';

@NgModule({
  declarations: [
    AppComponent,
    PadComponent,
    HomeComponent,
    SquareComponent,
    SequencerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxFileDropModule,
    Ng5SliderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
