import { Component, OnInit, Input } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { SamplesService } from 'src/app/samples.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.css']
})
export class SquareComponent implements OnInit {

  @Input() map: Object;
  @Input() keyPlayed: Subject<any>;
  clicked: Boolean;

  constructor(
    private samplesService: SamplesService
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

}
