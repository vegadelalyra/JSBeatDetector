/*
    TESTING AUDIO WEB API
        Audio is composed of three parts: 
            1- samples: analog signal conversed into floating point digital values. Each sample can be a channel.
            2- frames: Lot of samples or channels in one space. The amount of frames defines the Buffer length.
            3- framerate (Hz): frames played per second. The most common fr for HQ audio it's 44.1KHz.
        Buffer: interface of an audio asset residing in memory.
        source: audio inputs ; destination. audio output
*/

const audioContext = new AudioContext(), // first, create an audioContext, which is the API
      audioElement = document.querySelector("audio"), // get any audio element, 
      track = audioContext.createMediaElementSource(audioElement) // use the audio element as a source.

/* audio graph = source + modification + destination  
    IMPORTANT REMINDER: It can only be one audio graph per audioCxt. In fact, the audioCxt is the audio graph.
track.connect(audioContext.destination) */

// Select our play button
const playButton = document.querySelector("button"),
      click = new Event('click')

playButton.addEventListener(
  "click",
    () => {
    //Check if context is in suspended state (autoplay policy)
    audioContext.state === 'suspended' ? audioContext.resume() : null
    
    // Play or pause track depending on state
    switch (playButton.dataset.playing) {
        case 'false':
            audioElement.play()        
            playButton.dataset.playing = "true"
            break
    
        default:
            audioElement.pause()
            playButton.dataset.playing = "false"
            break
    }
  },
  false
)

// Retake the play button to "off" once the song has ended.
audioElement.addEventListener(
    "ended",
    () => {
      playButton.dataset.playing = "false"
    },
    false
  )

/* LET'S USE SOME HANDY AUDIO WEB API METHODS
** DOWN HERE WE HAVE VOLUME CONTROL ON THE INPUT */
const gainNode = audioContext.createGain(),
      volumeControl = document.querySelector("#volume")

volumeControl.addEventListener(
   "input", ()=> gainNode.gain.value = volumeControl.value
  )
  
  // Control the input and play button with the mouse wheel

  // We create a document's events handler
  const handler = e => {
    switch (e.type) {
      case 'wheel':
        e.deltaY <= 0 
        ? gainNode.gain.value >= 1 
          ? gainNode.gain.value = 1 
          : gainNode.gain.value += 0.1 
        : gainNode.gain.value <= 0 
          ? gainNode.gain.value = 0
          : gainNode.gain.value -= 0.1
      volumeControl.value = gainNode.gain.value
        break
    
      case 'mouseup':
        e.button != 1 
        ? false 
        : playButton.dispatchEvent(click)
        break
      
      default :
        break
    }
  }

// We create an array of document's events listener
['wheel', 'mouseup'].forEach( evt => {
  document.addEventListener(evt, handler)
} )

  // modify the audio graph to add the gainNode modification
// create a stereoPannerNode from audio context audio web API object
const panner = new StereoPannerNode(audioContext, {pan: 0})


/* all AUDIO GRAPH variables must be declared before type it down. 
(It's better to let the audio graph at the end) */
track.connect(gainNode).connect(audioContext.destination)

