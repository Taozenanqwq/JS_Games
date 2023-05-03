const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')

const CANVAS_WIDTH = (canvas.width = 600)
const CANVAS_HEIGHT = (canvas.height = 600)

const playerImage = new Image()
playerImage.src = './imgs/shadow_dog.png'

const totalHeight = 5230
const totalWidth = 6876
const spriteWitdh = 575
const spriteHeight = 523
const staggeredFrames = 5
const animationStates = {
  idle: {
    name: 'idle',
    frames: 7,
    y: 0
  },
  jump: {
    name: 'jump',
    frames: 7,
    y: 1
  },
  fall: {
    name: 'fall',
    frames: 7,
    y: 2
  },
  run: {
    name: 'run',
    frames: 9,
    y: 3
  },
  dizzy: {
    name: 'dizzy',
    frames: 11,
    y: 4
  },
  sit: {
    name: 'sit',
    frames: 5,
    y: 5
  },
  roll: {
    name: 'roll',
    frames: 7,
    y: 6
  },
  bite: {
    name: 'bite',
    frames7: 7,
    y: 7
  },
  ko: {
    name: 'ko',
    frames: 12,
    y: 8
  },
  gitHit: {
    name: 'gitHit',
    frames: 7,
    y: 9
  }
}
let playerState = 'fall'
//控制动画速度
let gameFrame = 0
function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  let pos = Math.floor(gameFrame / staggeredFrames) % animationStates[playerState].frames
  frameX = pos * spriteWitdh
  frameY = animationStates[playerState].y
  ctx.drawImage(
    playerImage,
    frameX,
    frameY * spriteHeight,
    spriteWitdh,
    spriteHeight,
    0,
    0,
    CANVAS_WIDTH,
    CANVAS_HEIGHT
  )
  gameFrame++
  requestAnimationFrame(animate)
}
animate()
