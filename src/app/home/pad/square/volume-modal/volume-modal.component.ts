import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Options } from 'ng5-slider';
import { SamplesService } from 'src/app/samples.service';

@Component({
  selector: 'app-volume-modal',
  templateUrl: './volume-modal.component.html',
  styleUrls: ['./volume-modal.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class VolumeModalComponent implements OnInit {

  isMobile: Boolean;
  map: Object;
  volumeOptions: Options = {
    floor: -30,
    ceil: 0
  };
  reverbOptions: Options = {
    floor: 0,
    ceil: 1,
    step: 0.05
  };
  noteLengthOptions: Options = {
    floor: 0,
    ceil: 6,
    translate: (value: number) => { return this.noteLengthMappings[value]; }
  }
  volume: number;
  reverb: number;
  delay: number;
  noteLength: string;
  volumeChanging;
  reverbChanging;
  delayChanging;
  noteLengthMappings = {
    0: "1/32",
    1: "1/16",
    2: "1/8",
    3: "1/4",
    4: "1/2",
    5: "1 bar",
    6: "2 bars",
  }

  constructor(public bsModalRef: BsModalRef,
    private samplesService: SamplesService) { }

  ngOnInit() {
    this.volume = this.samplesService.getVolume(this.map['key']);
    this.reverb = this.samplesService.getReverb(this.map['key']);
    this.delay = this.samplesService.getDelay(this.map['key']);
    this.noteLength = this.samplesService.getnoteLength(this.map['key']);
  }

  public volumeChange() {
    if (this.volumeChanging)
      clearTimeout(this.volumeChanging);
    const thisClass = this;
    this.volumeChanging = setTimeout(function () {
      thisClass.samplesService.setVolume(thisClass.map['key'], thisClass.volume);
      thisClass.samplesService.play(thisClass.map['key'], null);
    }, 500);
  }

  public reverbChange() {
    if (this.reverbChanging)
      clearTimeout(this.reverbChanging);
    const thisClass = this;
    this.reverbChanging = setTimeout(function () {
      thisClass.samplesService.setReverb(thisClass.map['key'], thisClass.reverb);
      thisClass.samplesService.play(thisClass.map['key'], null);
    }, 500);
  }

  public delayChange() {
    if (this.delayChanging)
      clearTimeout(this.delayChanging);
    const thisClass = this;
    this.delayChanging = setTimeout(function () {
      thisClass.samplesService.setDelay(thisClass.map['key'], thisClass.delay);
      thisClass.samplesService.play(thisClass.map['key'], null);
    }, 500);
  }

  public noteLengthChange() {
    this.samplesService.setnoteLength(this.map['key'], this.noteLength);
    const thisClass = this;
    setTimeout(() => { thisClass.samplesService.play(thisClass.map['key'], null); }, 200);
  }

}
