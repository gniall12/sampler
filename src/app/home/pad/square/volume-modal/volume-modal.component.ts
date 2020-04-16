import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
  map: Object;
  options: Options = {
    floor: -30,
    ceil: 0
  };
  volume: number;
  volumeChanging;

  constructor(public bsModalRef: BsModalRef,
    private samplesService: SamplesService) { }

  ngOnInit() {
    this.volume = this.samplesService.getVolume(this.map['key']);
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

}
