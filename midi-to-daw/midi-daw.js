import { WebMidi } from "webmidi";

const abletonIACDriverInputID = "321211976"
const abletonIACDriverOutputID = "-924666097"
const START = 41;
const NOTE_ON = 144; //0x90
const NOTE_OFF = 128; //0x80
const NOTE_DURATION = 180; //20 is an 8th
const LAST_INT = 127 //0x7f

let currentSequenceId = -1;
let intervals = [0, 4, 7, 11, 12, 11, 7, 4];
let sequence =  intervals.map(x => x + START);

const playNote = () => {
    const midiToAbletonOutput = WebMidi.getOutputById(abletonIACDriverInputID)

    if (currentSequenceId >= 0) {
        midiToAbletonOutput.send([NOTE_OFF, sequence[currentSequenceId], LAST_INT]);
    }

    currentSequenceId++;
    if (currentSequenceId >= sequence.length) {
        currentSequenceId = 0;
    }
    midiToAbletonOutput.send([NOTE_ON, sequence[currentSequenceId], LAST_INT]);

    setTimeout(playNote, NOTE_DURATION);
}

const onEnabled = () => {
    const midiToAbletonInput = WebMidi.getInputById(abletonIACDriverOutputID)
    const button = document.getElementById('sendMIDI')

    button.addEventListener("click", playNote);

    // midiToAbletonInput.addListener('noteon',
    //     e => {
    //         console.log(e);
    //     }
    // );

}

WebMidi
    .enable()
    .then(onEnabled)
    .catch(err => alert(err));
