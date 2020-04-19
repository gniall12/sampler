import { Component, OnInit, Input } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { SamplesService } from 'src/app/samples.service';
import { Subject } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { VolumeModalComponent } from './volume-modal/volume-modal.component';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.css']
})
export class SquareComponent implements OnInit {

  @Input() map: Object;
  @Input() keyPlayed: Subject<any>;
  @Input() isMobile: Boolean;
  clicked: Boolean;
  bsModalRef: BsModalRef;

  constructor(
    private samplesService: SamplesService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.keyPlayed.subscribe(
      res => {
        if (res.toUpperCase() === this.map['key'])
          this.onPlay();
      }
    )
  }

  public onPlay() {
    this.samplesService.play(this.map['key'], null);
    this.clicked = true;
    setTimeout(() => this.clicked = false, 100);
  }

  public onTouchEnd(event: TouchEvent | any) {
    event.preventDefault();
    this.onPlay();
  }

  public dropped(files: NgxFileDropEntry[], key) {
    for (const droppedFile of files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file(async (file: File) => {

          const src = URL.createObjectURL(file);
          this.samplesService.setSample(key, file.name, src);
        });
      }
    }
  }

  public onPlus() {
    event.stopPropagation();
    event.preventDefault();
    const initialState = {
      map: this.map,
      isMobile: this.isMobile
    };
    this.bsModalRef = this.modalService.show(VolumeModalComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Close';
  }

}
