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
  numbers: Array<number>;
  sampleMap;
  playingIndex: number;
  bpm: number;
  selected = new Set([]);
  selectedKey: string;
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
    const key = this.selectedKey;
    for (const obj of this.selected) {
      const index = obj;
      if (!this.sequence[index].has(key)) {
        this.sequence[index].add(key);
      }
    }
  }

  public onRemoveSquares() {
    const key = this.selectedKey;
    for (const obj of this.selected) {
      const index = obj;
      if (this.sequence[index].has(key)) {
        this.sequence[index].delete(key);
      }
    }
  }

  public isClicked(key: string, i: number): Boolean {
    return this.sequence[i].has(key);
  }

  public isSelected(key: string, index: number): Boolean {
    return this.selectedKey === key && this.selected.has(index);
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
    let originalSequence: Array<any>;
    if (this.sequence)
      originalSequence = this.sequence.map((x) => x);
    this.numDivisions = noteValue * 2;
    this.numbers = new Array(+this.numDivisions).fill(0); // to allow for loop in view
    this.onClearSequence();
    // Copy original sequence if it exists
    if (originalSequence) {
      let differenceFactor: number;
      if (this.sequence.length < originalSequence.length) {
        differenceFactor = originalSequence.length / this.sequence.length;
        for (let i = 0; i < this.sequence.length; i++) {
          this.sequence[i] = originalSequence[i * differenceFactor];
        }
      } else {
        differenceFactor = this.sequence.length / originalSequence.length;
        for (let i = 0; i < originalSequence.length; i++) {
          this.sequence[i * differenceFactor] = originalSequence[i];
        }
      }
    }
  }

  public getStyleForNumberOfDivisions() {
    return { 'grid-template-columns': '2fr repeat(' + this.numDivisions + ', 1fr)' };
  }

  public getStyleForSequencerSquare(key: string, index: number) {
    const background = this.isClicked(key, index) ? '#B5FFE1' : '#31AFC0';
    const borderColor = index === this.playingIndex ? '#272727' : 'transparent';
    const opacity = this.isSelected(key, index) ? 0.5 : 1;
    const brightness = index % 4 == 0 ? '125%' : '100%';
    return {
      'background-color': background, 'border-color': borderColor, 'opacity': opacity,
      'filter': 'brightness(' + brightness + ')'
    };
  }

  public onMouseDown(key: string, index: number) {
    event.preventDefault();
    this.selecting = !this.sequence[index].has(key);
    this.selectedKey = key;
    this.selected.add(index);
    this.mouseDown = true;
  }

  public onTouchStart(event: TouchEvent | any, key: string, index: number) {
    event.preventDefault();
    this.selecting = !this.sequence[index].has(key);
    this.selectedKey = key;
    this.selected.add(index);
    this.mouseDown = true;
  }

  public onMouseOver(index: number) {
    if (this.mouseDown) {
      this.selected.add(index);
      this.cd.detectChanges();
    }
  }

  public onTouchMove(event: TouchEvent | any) {
    let elt = document.elementFromPoint(
      event.changedTouches[0].clientX,
      event.changedTouches[0].clientY
    );
    if (elt !== null && elt.getAttribute('class') === 'seq-square') {
      const index = +elt.getAttribute('index')
      this.selected.add(index);
    }
  }

  public onMouseUp() {
    if (this.selecting)
      this.onAddSquares();
    else
      this.onRemoveSquares();
    this.mouseDown = false;
    this.selected.clear();
    this.selectedKey = '';
  }

  public onTouchEnd() {
    if (this.selecting)
      this.onAddSquares();
    else
      this.onRemoveSquares();
    this.mouseDown = false;
    this.selected.clear();
    this.selectedKey = '';
  }

}
