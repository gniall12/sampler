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

  public playSequence(sequence, bpm: number, noteValues: number) {
    Tone.Transport.cancel();
    const noteArray = Array.from(Array(+noteValues).keys());

    const x = this.samplesService;
    const y = this;
    
    new Tone.Sequence(function(time, col){
      let column = sequence[col];
      y.playing.next(col);
      for(let note of column){
        x.play(note, "+0.1");
      }
    }, noteArray, noteValues + "n").start(0);
    Tone.Transport.bpm.value = bpm;
    Tone.Transport.start();
   }

  public stopSequence() {
    Tone.Transport.stop();
  }
}
