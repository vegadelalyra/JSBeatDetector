const audioContext = new AudioContext(), oscList = [],
keyboard = document.querySelector(".keyboard"),
wavePicker = document.querySelector("select[name='waveform']"),
volumeControl = document.querySelector("input[name='volume']")
let [mainGainNode, noteFreq, customWaveform, sineTerms, cosineTerms] = Array(5).fill(null)

function createNoteTable() {
    const noteFreq = []
    for (let i=0; i < 9; i++) {
      noteFreq[i] = []
    }
  
    noteFreq[0]["A"] = 27.500000000000000
    noteFreq[0]["A#"] = 29.135235094880619
    noteFreq[0]["B"] = 30.867706328507756
  
    noteFreq[1]["C"] = 32.703195662574829
    noteFreq[1]["C#"] = 34.647828872109012
    noteFreq[1]["D"] = 36.708095989675945
    noteFreq[1]["D#"] = 38.890872965260113
    noteFreq[1]["E"] = 41.203444614108741
    noteFreq[1]["F"] = 43.653528929125485
    noteFreq[1]["F#"] = 46.249302838954299
    noteFreq[1]["G"] = 48.999429497718661
    noteFreq[1]["G#"] = 51.913087197493142
    noteFreq[1]["A"] = 55.000000000000000
    noteFreq[1]["A#"] = 58.270470189761239
    noteFreq[1]["B"] = 61.735412657015513 

    noteFreq[2]["C"] = 65.40639132514966
    noteFreq[2]["C#"] = 69.29565774421802
    noteFreq[2]["D"] = 73.4161919793519
    noteFreq[2]["D#"] = 77.78174593052023
    noteFreq[2]["E"] = 82.40688922821748
    noteFreq[2]["F"] = 87.30705785825097
    noteFreq[2]["F#"] = 92.4986056779086
    noteFreq[2]["G"] =  97.99885899543732
    noteFreq[2]["G#"] = 103.82617439498628
    noteFreq[2]["A"] = 110
    noteFreq[2]["A#"] = 116.54094037952248
    noteFreq[2]["B"] = 123.47082531403103

    noteFreq[3]["C"] =	130.8127827
    noteFreq[3]["C#"] =	138.5913155
    noteFreq[3]["D"] =	146.832384
    noteFreq[3]["D#"] =	155.5634919
    noteFreq[3]["E"] =	164.8137785
    noteFreq[3]["F"] =	174.6141157
    noteFreq[3]["F#"] =	184.9972114
    noteFreq[3]["G"] =	195.997718
    noteFreq[3]["G#"] =	207.6523488
    noteFreq[3]["A"] =	220
    noteFreq[3]["A#"] =	233.0818808
    noteFreq[3]["B"] =	246.9416506

    noteFreq[4]["C"] =	261.6255653005986
    noteFreq[4]["C#"] =	277.1826309768721
    noteFreq[4]["D"] =	293.6647679174076
    noteFreq[4]["D#"] =	311.1269837220809
    noteFreq[4]["E"] =	329.6275569128699
    noteFreq[4]["F"] =	349.2282314330039
    noteFreq[4]["F#"] =	369.9944227116344
    noteFreq[4]["G"] =	391.99543598174927
    noteFreq[4]["G#"] =	415.3046975799451
    noteFreq[4]["A"] =	440
    noteFreq[4]["A#"] =	466.1637615180899
    noteFreq[4]["B"] =	493.8833013

    noteFreq[5]["C"] =	523.2511306011972
    noteFreq[5]["C#"] =	554.3652619537442
    noteFreq[5]["D"] =	587.3295358348151
    noteFreq[5]["D#"] =	622.2539674441618
    noteFreq[5]["E"] =	659.2551138257398
    noteFreq[5]["F"] =	698.4564628660078
    noteFreq[5]["F#"] =	739.9888454232688
    noteFreq[5]["G"] =	783.9908719634985
    noteFreq[5]["G#"] =	830.6093951598903
    noteFreq[5]["A"] =	880
    noteFreq[5]["A#"] =	932.3275230361799
    noteFreq[5]["B"] =	987.7666025

    noteFreq[6]["C"] =	1046.5022612023945
    noteFreq[6]["C#"] =	1108.7305239074883
    noteFreq[6]["D"] =	1174.6590716696303
    noteFreq[6]["D#"] =	1244.5079348883237
    noteFreq[6]["E"] =	1318.5102276514797
    noteFreq[6]["F"] =	1396.9129257320155
    noteFreq[6]["F#"] =	1479.9776908465376
    noteFreq[6]["G"] =	1567.981743926997
    noteFreq[6]["G#"] =	1661.2187903197805
    noteFreq[6]["A"] =	1760
    noteFreq[6]["A#"] =	1864.6550460723597
    noteFreq[6]["B"] =	1975.533205

    noteFreq[7]["C"] = 2093.004522404789077
    noteFreq[7]["C#"] = 2217.461047814976769
    noteFreq[7]["D"] = 2349.318143339260482
    noteFreq[7]["D#"] = 2489.015869776647285
    noteFreq[7]["E"] = 2637.020455302959437
    noteFreq[7]["F"] = 2793.825851464031075
    noteFreq[7]["F#"] = 2959.955381693075191
    noteFreq[7]["G"] = 3135.963487853994352
    noteFreq[7]["G#"] = 3322.437580639561108
    noteFreq[7]["A"] = 3520.000000000000000
    noteFreq[7]["A#"] = 3729.310092144719331
    noteFreq[7]["B"] = 3951.066410048992894

    noteFreq[8]["C"] = 4186.009044809578154
    return noteFreq
}

function setup() {
    noteFreq = createNoteTable()
  
    volumeControl.addEventListener("change", changeVolume, false)
  
    mainGainNode = audioContext.createGain()
    mainGainNode.connect(audioContext.destination)
    mainGainNode.gain.value = volumeControl.value
  
    // Create the keys skip any that are | or flat for
    // our purposes we don't need them. Each octave is inserted
    // into a <div> of class "octave".
  
    noteFreq.forEach((keys, idx) => {
      const keyList = Object.entries(keys),
      octaveElem = document.createElement("div")
    
      octaveElem.className = "octave"
  
      keyList.forEach((key) => {
        if (key[0].length === 1) {
          octaveElem.appendChild(createKey(key[0], idx, key[1]))
        }
      })
  
      keyboard.appendChild(octaveElem)
    })
  
    document.querySelector("div[data-note='B'][data-octave='5']").scrollIntoView(false)
  
    sineTerms = new Float32Array([0, 0, 1, 0, 1])
    cosineTerms = new Float32Array(sineTerms.length)
    customWaveform = audioContext.createPeriodicWave(cosineTerms, sineTerms)
  
    for (let i = 0; i < 9; i++) {
      oscList[i] = {}
    }
}
  
setup()

function createKey(note, octave, freq) {
    const keyElement = document.createElement("div"),
            labelElement = document.createElement("div")

    keyElement.className = "key"
    keyElement.dataset["octave"] = octave
    keyElement.dataset["note"] = note
    keyElement.dataset["frequency"] = freq

    labelElement.innerHTML = `${note}<sub>${octave}</sub>`
    keyElement.appendChild(labelElement)

    keyElement.addEventListener("mousedown", notePressed, false)
    keyElement.addEventListener("mouseup", noteReleased, false)
    keyElement.addEventListener("mouseover", notePressed, false)
    keyElement.addEventListener("mouseleave", noteReleased, false)

    return keyElement
}

function playTone(freq) {
    const osc = audioContext.createOscillator()
    osc.connect(mainGainNode)

    const type = wavePicker.options[wavePicker.selectedIndex].value

    if (type === "custom") {
        osc.setPeriodicWave(customWaveform)
    } else {
        osc.type = type
    }

    osc.frequency.value = freq
    osc.start()

    return osc
}

function notePressed(event) {
    if (event.buttons & 1) {
    const dataset = event.target.dataset

        if (!dataset["pressed"]) {
        const octave = Number(dataset["octave"])
        oscList[octave][dataset["note"]] = playTone(dataset["frequency"])
        dataset["pressed"] = "yes"
        }
    }
}

function noteReleased(event) {
    const dataset = event.target.dataset
  
   if (dataset && dataset["pressed"]) {
     const octave = Number(dataset["octave"])
     oscList[octave][dataset["note"]].stop()
     delete oscList[octave][dataset["note"]]
     delete dataset["pressed"]
   }
 }

function changeVolume(event) {
    mainGainNode.gain.value = volumeControl.value
}