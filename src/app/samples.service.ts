import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SamplesService {
  private sampleMapValues: Object;
  private drumSampleValues = {
    Q: { name: "Hat.wav", url: "assets/Hat.wav", noteLength: 4 },
    W: { name: "Open Hat.wav", url: "assets/Open Hat.wav", noteLength: 4 },
    E: { name: "Perc.wav", url: "assets/Perc.wav", noteLength: 4 },
    A: { name: "Kick.wav", url: "assets/Kick.wav", noteLength: 4 },
    S: { name: "Snare.wav", url: "assets/Snare.wav", noteLength: 4 },
    D: { name: "Clap.wav", url: "assets/Clap.wav", noteLength: 4 },
  };
  private casioSampleValues = {
    Q: { name: "A1.mp3", url: "assets/Casio/A1.mp3", noteLength: 4 },
    W: { name: "B1.mp3", url: "assets/Casio/B1.mp3", noteLength: 4 },
    E: { name: "C2.mp3", url: "assets/Casio/C2.mp3", noteLength: 4 },
    A: { name: "D2.mp3", url: "assets/Casio/D2.mp3", noteLength: 4 },
    S: { name: "E2.mp3", url: "assets/Casio/E2.mp3", noteLength: 4 },
    D: { name: "F2.mp3", url: "assets/Casio/F2.mp3", noteLength: 4 },
  };
  private sampleMap: BehaviorSubject<any> = new BehaviorSubject<any>(
    this.sampleMapValues
  );
  sampleMapObs: Observable<any> = this.sampleMap.asObservable();

  players: Object;
  reverbs: Object;
  delays: Object;
  isDrumSamplesActive: Boolean;
  noteLengthMappings = {
    0: "32n",
    1: "16n",
    2: "8n",
    3: "4n",
    4: "2n",
    5: "1n",
    6: "2m"
  }

  constructor() {
    this.sampleMapValues = this.drumSampleValues;
    this.isDrumSamplesActive = true;
    this.sampleMap.next(this.sampleMapValues);
    this.setPlayers();
  }

  public play(key: string, time: number) {
    key = key.toUpperCase();
    const vel = Math.random() * 0.5 + 0.5;
    if (key in this.sampleMapValues && this.sampleMapValues[key] !== "") {
      const noteLengthNum = this.sampleMapValues[key]["noteLength"]
      const noteLength = this.noteLengthMappings[noteLengthNum];
      this.players[key].start(time, 0, noteLength, 0, vel);
    }
  }

  switchDefaultSamples() {
    if(this.isDrumSamplesActive) {
      this.sampleMapValues = this.casioSampleValues;
      this.isDrumSamplesActive = false;
    } else {
      this.sampleMapValues = this.drumSampleValues;
      this.isDrumSamplesActive = true;
    }
    this.sampleMap.next(this.sampleMapValues);
    this.setPlayers();
  }

  public setSample(key: string, filename: string, url: string) {
    this.sampleMapValues[key] = { name: filename, url: url, noteLength: 4 };
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
    const reverb = this.reverbs[key];
    reverb.wet.value = wet;
    this.chainEffects(key);
  }

  public getReverb(key: string) {
    return this.reverbs[key].wet.value;
  }

  public setDelay(key: string, wet: number) {
    const delay = this.delays[key];
    delay.wet.value = wet;
    this.chainEffects(key);
  }

  public getDelay(key: string) {
    return this.delays[key].wet.value;
  }

  public chainEffects(key: string) {
    const player = this.players[key];
    const reverb = this.reverbs[key];
    const delay = this.delays[key];
    player.disconnect();
    if (reverb.wet.value === 0 && delay.wet.value === 0) {
      player.chain(Tone.Master)
    } else if (reverb.wet.value !== 0 && delay.wet.value === 0) {
      player.chain(reverb, Tone.Master)
    } else if (reverb.wet.value === 0 && delay.wet.value !== 0) {
      player.chain(delay, Tone.Master)
    } else {
      player.chain(delay, reverb, Tone.Master)
    }
  }

  public setnoteLength(key: string, noteLength: string) {
    this.sampleMapValues[key]["noteLength"] = noteLength;
  }

  public getnoteLength(key: string) {
    return this.sampleMapValues[key]["noteLength"];
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

      const delay = new Tone.PingPongDelay("8n", 0.5);
      delay.wet.value = 0;
      this.delays[key] = delay;
    }
  }
}
