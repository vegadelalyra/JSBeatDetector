// In order to use Infinite Impulse Response Filter (IIRf) we need to define a feedForward and a Feedback up to 20 data-array
const feedForward = [0.00020298, 0.0004059599, 0.00020298],
      feedBack = [1.0126964558, -1.9991880801, 0.9873035442],
      audioCtx = new AudioContext(),
      iirFilter = audioCtx.createIIRFilter(feedForward, feedBack),
// Create an empty three-second stereo buffer at the sample rate of the AudioContext
      sample = audioCtx.createBuffer(
  2,
  audioCtx.sampleRate * 3,
  audioCtx.sampleRate
)

// Fill the buffer with white noise;
// just random values between -1.0 and 1.0
for (let channel = 0; channel < sample.numberOfChannels; channel++) {
  // This gives us the actual array that contains the data
  const nowBuffering = sample.getChannelData(channel)
  for (let i = 0; i < sample.length; i++) {
    // Math.random() is in [0; 1.0]
    // audio needs to be in [-1.0; 1.0]
    nowBuffering[i] = Math.random() * 2 - 1
  }
}

function playSourceNode(audioContext, audioBuffer) {
  const soundSource = audioContext.createBufferSource()
  soundSource.buffer = audioBuffer
  soundSource.connect(audioContext.destination)
  soundSource.start()
  return soundSource
}
playButton = document.querySelector('.button-play')
filterButton = document.querySelector('.button-filter')
playButton.addEventListener('click', () => {
  if (playButton.dataset.playing === 'false') {
    srcNode = playSourceNode(audioCtx, sample)
     // …
  }
}, false)

filterButton.addEventListener('click', () => {
  if (filterButton.dataset.filteron === 'false') {
    srcNode.disconnect(audioCtx.destination)
    srcNode.connect(iirFilter).connect(audioCtx.destination)
    // …
  }
}, false)

// arrays for our frequency response
const totalArrayItems = 30
let myFrequencyArray = new Float32Array(totalArrayItems)
const magResponseOutput = new Float32Array(totalArrayItems)
const phaseResponseOutput = new Float32Array(totalArrayItems)

myFrequencyArray = myFrequencyArray.map((item, index) => 1.4 ** index)
iirFilter.getFrequencyResponse(myFrequencyArray, magResponseOutput, phaseResponseOutput)

// Create a canvas element and append it to our DOM
const canvasContainer = document.querySelector('.filter-graph')
const canvasEl = document.createElement('canvas')
canvasContainer.appendChild(canvasEl)
// Set 2d context and set dimensions
const canvasCtx = canvasEl.getContext('2d')
const width = canvasContainer.offsetWidth
const height = canvasContainer.offsetHeight
canvasEl.width = width
canvasEl.height = height
// Set background fill
canvasCtx.fillStyle = 'white'
canvasCtx.fillRect(0, 0, width, height)
// Set up some spacing based on size
const spacing = width / 16;
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