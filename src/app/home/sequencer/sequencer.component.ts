import { Component, OnInit, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { SequencerService } from 'src/app/sequencer.service';
import { SamplesService } from 'src/app/samples.service';
import { KeyValue } from '@angular/common';
import { Options } from 'ng5-slider';

@Component({
  selector: 'app-sequencer',
  templateUrl: './sequencer.component.html',
  styleUrls: ['./sequencer.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SequencerComponent implements OnInit {

  sequence: Array<any>;
  keys = ['W', 'E', 'R', 'A', 'S', 'D', 'Z', 'X', 'C'];
  numbers;
  sampleMap;
  playingIndex: number;
  bpm: number;
  selected = new Set([]);
  numDivisions: number;
  mouseDown: Boolean = false;
  selecting: Boolean;
  options: Options = {
    floor: 30,
    ceil: 200
  };

  constructor(
    private sequencerService: SequencerService,
    private samplesService: SamplesService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.samplesService.sampleMapObs.subscribe(res => {
      this.sampleMap = res;
    });
    this.bpm = 128;
    this.numDivisions = 16;
    let initialNoteValue = 8;
    this.onSelectNoteValues(initialNoteValue);
    this.onInitialiseSequence();
  }

  originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  }

  public onPlaySequence() {
    this.sequencerService.playSequence(this.sequence, this.bpm, this.numDivisions);
    this.sequencerService.playingObs.subscribe(res => {
      this.playingIndex = res;
      this.cd.detectChanges();
    });
  }

  public onStopSequence() {
    this.sequencerService.stopSequence();
  }

  public onAddSquares() {
    for (const obj of this.selected) {
      const index = obj.substring(1,);
      const key = obj.charAt(0,1);
      if (!this.sequence[index].has(key)) {
        this.sequence[index].add(key);
      }
    }
  }

  public onRemoveSquares() {
    for (const obj of this.selected) {
      const index = obj.substring(1,);
      const key = obj.charAt(0,1);
      if (this.sequence[index].has(key)) {
        this.sequence[index].delete(key);
      }
    }
  }

  public isClicked(key: string, i: number): Boolean {
    return this.sequence[i].has(key);
  }

  public isSelected(key: string, index: number): Boolean {
    return this.selected.has(key + '' + index);
  }

  public onInitialiseSequence() {
    this.sequence = [
      new Set(['D', 'A']),
      new Set(['D']),
      new Set(['D']),
      new Set(['D']),
      new Set(['D', 'S']),
      new Set(['D']),
      new Set(['D']),
      new Set(['D']),
      new Set(['D', 'A']),
      new Set(['D']),
      new Set(['D']),
      new Set(['D']),
      new Set(['D', 'S']),
      new Set(['D']),
      new Set(['D']),
      new Set(['D'])
    ]
  }

  public onClearSequence() {
    this.sequence = Array.from({ length: this.numDivisions }, () => (new Set([])));
    this.onStopSequence();
  }

  public onSelectNoteValues(noteValue: number) {
    this.numDivisions = noteValue*2;
    this.numbers = new Array(+this.numDivisions).fill(0);
    this.onClearSequence();
  }

  public getStyleForNumberOfDivisions() {
    return { 'grid-template-columns': '2fr repeat(' + this.numDivisions + ', 1fr)' };
  }

  public getStyleForSequencerSquare(key: string, index: number) {
    const background = this.isClicked(key, index) ? '#B5FFE1' : '#31AFC0';
    const borderColor = index === this.playingIndex ? '#272727' : 'transparent';
    const opacity = this.isSelected(key, index) ? 0.5 : 1;
    return { 'background-color': background, 'border-color': borderColor, 'opacity': opacity };
  }


  public onMouseDown(key: string, index: number) {
    this.selecting = !this.sequence[index].has(key);
    this.selected.add(key + '' + index);
    this.mouseDown = true;
  }

  public onMouseOver(key: string, index: number) {
    if (this.mouseDown) {
      this.selected.add(key + '' + index);
      this.cd.detectChanges();
    }
  }

  public onMouseUp() {
    if (this.selecting)
      this.onAddSquares();
    else
      this.onRemoveSquares();
    this.mouseDown = false;
    this.selected.clear();
  }

}
