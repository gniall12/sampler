import { Injectable } from '@angular/core';
import { SamplesService } from './samples.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SequencerService {
  private playing: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  playingObs: Observable<any> = this.playing.asObservable();

  constructor(
    private samplesService: SamplesService
  ) { }

  public playSequence(sequence, bpm: number, numDivisions: number) {
    const noteValues = numDivisions / 2;
    Tone.Transport.cancel();
    const noteArray = Array.from(Array(+numDivisions).keys());

    const sampService = this.samplesService;
    const thisClass = this;

    new Tone.Sequence(function (time, col) {
      let column = sequence[col];
      thisClass.playing.next(col);
      column.forEach(function (val, i) {
        var vel = Math.random() * 0.5 + 0.5;
        sampService.players.get(val).start(time, 0, "8n", 0, vel);
      });
    }, noteArray, noteValues + "n").start(0);
    Tone.Transport.bpm.value = bpm;
    Tone.Transport.start();
  }

  public stopSequence() {
    Tone.Transport.stop();
  }
}
