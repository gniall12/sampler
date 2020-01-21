import { Component, OnInit, HostListener } from '@angular/core';
import { KeyValue } from '@angular/common';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { SamplesService } from 'src/app/samples.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-pad',
  templateUrl: './pad.component.html',
  styleUrls: ['./pad.component.css']
})
export class PadComponent implements OnInit {

  clicked = [];

  sampleMap;

  keyPlayed:Subject<any> = new Subject();

  constructor(
    private samplesService: SamplesService
  ) { }

  ngOnInit() {
    this.samplesService.sampleMapObs.subscribe(res => {
      this.sampleMap = res;
    });
  }

  originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    this.keyPlayed.next(event.key);
  }

}
