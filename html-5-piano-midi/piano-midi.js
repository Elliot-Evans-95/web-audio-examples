import { WebMidi } from "webmidi";

const WHITE_KEYS = ['z', 'x', 'c', 'v', 'b', 'n', 'm']
const BLACK_KEYS = ['s', 'd', 'g', 'h', 'j']

const keys = document.querySelectorAll('.key')
const whiteKeys = document.querySelectorAll('.key.white')
const blackKeys = document.querySelectorAll('.key.black')

function playNote(key) {
    const attr = `[data-note="${key}"]`;
    const noteElement = document.querySelector(attr);
    const noteAudio = document.getElementById(key);

    console.log(noteAudio);

    noteAudio.currentTime = 0
    noteAudio.play()
    noteElement.classList.add('active')
    noteAudio.addEventListener('ended', () => {
        noteElement.classList.remove('active')
    })
}

const onEnabled = () => {
    // Viewing available inputs and outputs
    console.log(WebMidi.inputs);
    console.log(WebMidi.outputs);

    // const launchkeyMiniMK3Input = WebMidi.getInputById("1827547939");
    const launchkeyMiniMK3Input = WebMidi.getInputById("-1901997988");

    launchkeyMiniMK3Input.addListener('noteon',
        e => {
            console.log("Received 'noteon' message (" + e.note.name + e.note.octave + ").");
            console.log(e);
            const notes = e.note.identifier.includes('#') ? `${e.note.name}#`: e.note.name;

            console.log(notes);

            playNote(notes)
        }
    );

    launchkeyMiniMK3Input.addListener('pitchbend',
        e => {
            console.log("Received 'pitchbend' message.", e);
        }
    );

    launchkeyMiniMK3Input.addListener('controlchange',
        e => {
            console.log("Received 'controlchange' message.", e);
        }
    );

    launchkeyMiniMK3Input.addListener('keyaftertouch',
        e => {
            console.log("Received 'controlchange' message.", e);
        }
    );

};

keys.forEach(key => {
    key.addEventListener('click', () => playNote(key))
})

document.addEventListener('keydown', e => {
    if (e.repeat) return
    const key = e.key
    const whiteKeyIndex = WHITE_KEYS.indexOf(key)
    const blackKeyIndex = BLACK_KEYS.indexOf(key)

    if (whiteKeyIndex > -1) playNote(whiteKeys[whiteKeyIndex])
    if (blackKeyIndex > -1) playNote(blackKeys[blackKeyIndex])
})

WebMidi
    .enable()
    .then(onEnabled)
    .catch(err => alert(err));
