# Sampler

[sampler.niallg.ie](https://sampler.niallg.ie)

Create electronic music in the browser.

Motivation: A fun app to quickly create beats on the go. Inspired by the Drag and Drop Sampler in Apple's [Logic Pro X](https://www.apple.com/logic-pro/), a simple and flexible way to build kits using custom samples.

## Details

Created using [Tone.js](https://tonejs.github.io/), a framework for creating interactive music in the browser. Tone.js is build on the [Web Audio API](https://webaudio.github.io/web-audio-api/). 

I mainly used Tone.js for the sequencing capabilities, and based the sequencer on [this example](https://tonejs.github.io/examples/stepSequencer.html). 

Performance of the app is limited on mobile devices, since you can't drag and drop files. The pad is also slow to play on touch screens, and the sequencer can sometimes be glitchy on older phones

## Running Code

Set up Angular using the steps [here](https://angular.io/guide/setup-local)

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.
