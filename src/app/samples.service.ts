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

  players: Object;
  reverbs: Object;
  delays: Object;

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

  public setVolume(key: string, volume: number) {
    this.players[key].volume.value = volume;
  }

  public getVolume(key: string) {
    return this.players[key].volume.value;
  }

  public setReverb(key: string, wet: number) {
    const player = this.players[key];
    const reverb = this.reverbs[key];
    const delay = this.delays[key];
    reverb.wet.value = wet;
    player.disconnect();
    player.chain(delay, reverb, Tone.Master)
  }

  public getReverb(key: string) {
    return this.reverbs[key].wet.value;
  }

  public setDelay(key: string, wet: number) {
    const player = this.players[key];
    const reverb = this.reverbs[key];
    const delay = this.delays[key];
    delay.wet.value = wet;
    player.disconnect();
    player.chain(delay, reverb, Tone.Master)
  }

  public getDelay(key: string) {
    return this.delays[key].wet.value;
  }

  public setPlayers() {
    this.players = {};
    this.reverbs = {};
    this.delays = {};
    for (const key in this.sampleMapValues) {
      const player = new Tone.Player(this.sampleMapValues[key]["url"]).toMaster();
      player.volume.value = -10;
      this.players[key] = player;

      const reverb = new Tone.Freeverb();
      reverb.roomSize.value = 0.75;
      reverb.wet.value = 0;
      this.reverbs[key] = reverb;

      const delay = new Tone.PingPongDelay();
      delay.wet.value = 0;
      this.delays[key] = delay;
    }
  }

}
