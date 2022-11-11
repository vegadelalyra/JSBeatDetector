// Create a new AudioContext to start designing our audio graph
const feedForward = [0.00020298, 0.0004059599, 0.00020298],
feedBack = [1.0126964558, -1.9991880801, 0.9873035442],
audioCtx = new AudioContext(),
iirFilter = audioCtx.createIIRFilter(feedForward, feedBack)

let sample = audioCtx.createBufferSource(document.querySelector('audio'))
// Function to add and play our source node --POSSIBLE ERRORS DERIVE FROM LACKING A SOURCE.
function playSourceNode(audioContext, audioBuffer) {
    const soundSource = audioContext.createBufferSource()
    soundSource.buffer = audioBuffer
    soundSource.connect(audioContext.destination)
    soundSource.start()
    return soundSource
}

// Click event for the play/pause audio button HTML 
const playButton = document.querySelector('.button-play'),
      filterButton = document.querySelector('.button-filter')

playButton.addEventListener('click', () => {
    if (playButton.dataset.playing === 'false') {
      srcNode = playSourceNode(audioCtx, sample)
       // …
    }
  }, false)

// Filter button that toggles IIRf node to our audio graph
filterButton.addEventListener('click', () => {
    if (filterButton.dataset.filteron === 'false') {
      srcNode.disconnect(audioCtx.destination)
      srcNode.connect(iirfilter).connect(audioCtx.destination)
      // …
    }
  }, false)

// arrays for our frequency response
const totalArrayItems = 30,
      magResponseOutput = new Float32Array(totalArrayItems),
      phaseResponseOutput = new Float32Array(totalArrayItems)
let myFrequencyArray = new Float32Array(totalArrayItems)
// gather all of that data
myFrequencyArray = myFrequencyArray.map((item, index) => 1.4 ** index)
iirFilter.getFrequencyResponse(myFrequencyArray, magResponseOutput, phaseResponseOutput)


// Canvas to create a canvas visualization of all of this.

// Create a canvas element and append it to our DOM
const canvasContainer = document.querySelector('.filter-graph'),
      canvasEl = document.createElement('canvas')

canvasContainer.appendChild(canvasEl)

// Set 2d context and set dimensions
const canvasCtx = canvasEl.getContext('2d'),
      width = canvasContainer.offsetWidth,
      height = canvasContainer.offsetHeight

canvasEl.width = width
canvasEl.height = height

// Set background fill
canvasCtx.fillStyle = 'white'
canvasCtx.fillRect(0, 0, width, height)

// Set up some spacing based on size
const spacing = width / 16
const fontSize = Math.floor(spacing / 1.5)

// Draw our axis
canvasCtx.lineWidth = 2
canvasCtx.strokeStyle = 'grey'

canvasCtx.beginPath()
canvasCtx.moveTo(spacing, spacing)
canvasCtx.lineTo(spacing, height-spacing)
canvasCtx.lineTo(width-spacing, height-spacing)
canvasCtx.stroke()

// Axis is gain by frequency -> make labels
canvasCtx.font = `${fontSize}px sans-serif`
canvasCtx.fillStyle = 'grey'
canvasCtx.fillText('1', spacing - fontSize, spacing + fontSize)
canvasCtx.fillText('g', spacing - fontSize, (height - spacing + fontSize) / 2)
canvasCtx.fillText('0', spacing - fontSize, height - spacing + fontSize)
canvasCtx.fillText('Hz', width / 2, height - spacing + fontSize)
canvasCtx.fillText('20k', width - spacing, height - spacing + fontSize)

// Loop over our magnitude response data and plot our filter
canvasCtx.beginPath()

magResponseOutput.forEach((magResponseData, i) => {
  if (i === 0) {
    canvasCtx.moveTo(
      spacing,
      height - magResponseData * 100 - spacing,
    )
  } else {
    canvasCtx.lineTo(
      width / totalArrayItems * i,
      height - magResponseData * 100 - spacing,
    )
  }
})

canvasCtx.stroke()