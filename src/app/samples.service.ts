import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SamplesService {

  private sampleMapValues = {
    "Q": { name: "A1.mp3", url: "assets/A1.mp3" },
    "W": { name: "D2.mp3", url: "assets/D2.mp3" },
    "E": { name: "E2.mp3", url: "assets/E2.mp3" },
    "A": { name: "Kick.wav", url: "assets/Kick.wav" },
    "S": { name: "Snare.wav", url: "assets/Snare.wav" },
    "D": { name: "Hat.wav", url: "assets/Hat.wav" }
  };
  private sampleMap: BehaviorSubject<any> = new BehaviorSubject<any>(this.sampleMapValues);
  sampleMapObs: Observable<any> = this.sampleMap.asObservable();

  players;
  private loaded = false;

  constructor() {
    this.sampleMap.next(this.sampleMapValues);
    this.setPlayers()
  }

  public play(key: string, time: number) {
    key = key.toUpperCase();
    const vel = Math.random() * 0.5 + 0.5;
    if (this.loaded && key in this.sampleMapValues && this.sampleMapValues[key] !== "") {
      this.players.get(key).start(time, 0, "2n", 0, vel);
    }
  }

  public setSample(key: string, filename: string, url: string) {
    this.sampleMapValues[key] = { name: filename, url: url };
    this.setPlayers();
    this.sampleMap.next(this.sampleMapValues);
  }

  public setPlayers() {
    this.players = new Tone.Players({
      "Q": this.sampleMapValues["Q"]["url"],
      "W": this.sampleMapValues["W"]["url"],
      "E": this.sampleMapValues["E"]["url"],
      "A": this.sampleMapValues["A"]["url"],
      "S": this.sampleMapValues["S"]["url"],
      "D": this.sampleMapValues["D"]["url"],
    }, {
      "onload": () => this.loaded = true,
      "volume": -10
    }).toMaster();
  }

}
