import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SamplesService {

  private sampleMapValues = {
    "Q": { name: "Hat.wav", url: "assets/Hat.wav" },
    "W": { name: "Open Hat.wav", url: "assets/Open Hat.wav" },
    "E": { name: "Perc.wav", url: "assets/Perc.wav" },
    "A": { name: "Kick.wav", url: "assets/Kick.wav" },
    "S": { name: "Snare.wav", url: "assets/Snare.wav" },
    "D": { name: "Clap.wav", url: "assets/Clap.wav" }
  };
  private sampleMap: BehaviorSubject<any> = new BehaviorSubject<any>(this.sampleMapValues);
  sampleMapObs: Observable<any> = this.sampleMap.asObservable();

  players;

  constructor() {
    this.sampleMap.next(this.sampleMapValues);
    this.setPlayers()
  }

  public play(key: string, time: number) {
    key = key.toUpperCase();
    const vel = Math.random() * 0.5 + 0.5;
    if (key in this.sampleMapValues && this.sampleMapValues[key] !== "") {
      this.players[key].start(time, 0, "2n", 0, vel);
    }
  }

  public setSample(key: string, filename: string, url: string) {
    this.sampleMapValues[key] = { name: filename, url: url };
    this.players[key].load(url);
    this.sampleMap.next(this.sampleMapValues);
  }

  public setPlayers() {
    this.players = {
      "Q": new Tone.Player(this.sampleMapValues["Q"]["url"]).toMaster(),
      "W": new Tone.Player(this.sampleMapValues["W"]["url"]).toMaster(),
      "E": new Tone.Player(this.sampleMapValues["E"]["url"]).toMaster(),
      "A": new Tone.Player(this.sampleMapValues["A"]["url"]).toMaster(),
      "S": new Tone.Player(this.sampleMapValues["S"]["url"]).toMaster(),
      "D": new Tone.Player(this.sampleMapValues["D"]["url"]).toMaster()
    }
  }

}
