import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgxFileDropModule } from 'ngx-file-drop';
import { Ng5SliderModule } from 'ng5-slider';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PadComponent } from './home/pad/pad.component';
import { HomeComponent } from './home/home.component';
import { SquareComponent } from './home/pad/square/square.component';
import { SequencerComponent } from './home/sequencer/sequencer.component';
import { VolumeModalComponent } from './home/pad/square/volume-modal/volume-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    PadComponent,
    HomeComponent,
    SquareComponent,
    SequencerComponent,
    VolumeModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxFileDropModule,
    Ng5SliderModule,
    ModalModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [VolumeModalComponent]
})
export class AppModule { }
