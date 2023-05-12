const colorCanvas = document.getElementById('colorCanvas')
const colorCtx = colorCanvas.getContext('2d', { willReadFrequently: true })
colorCanvas.width = window.innerWidth
colorCanvas.height = window.innerHeight
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

let score = 0
let gameover = false

function drawScore() {
  ctx.font = 'bold 50px Impact'
  ctx.fillStyle = 'black'
  ctx.fillText('Score: ' + score, 50, 75)
  ctx.fillStyle = 'white'
  ctx.fillText('Score: ' + score, 55, 80)
}

let ravens = []
let explosions = []
let particles = []
class Raven {
  constructor() {
    this.img = new Image()
    this.img.src = './images/raven.png'
    this.spriteWidth = 271
    this.spriteHeight = 194
    this.aspectRatio = 0.4
    this.width = this.spriteWidth * this.aspectRatio
    this.height = this.spriteHeight * this.aspectRatio

    this.x = canvas.width
    this.y = Math.random() * (canvas.height - this.height)
    this.frameInterval = Math.random() * 30 + 30
    this.xSpeed = -((this.frameInterval - 30) / 30) * 4 + 8
    this.ySpeed = Math.random() * 5 - 2.5

    this.frame = 0
    this.curTime = 0
    this.lastTime = 0

    this.shouldBeDeleted = false
    this.color = `rgb(${Math.floor(Math.random() * 256)},${Math.floor(
      Math.random() * 256
    )},${Math.floor(Math.random() * 256)})`

    this.hasTrail = Math.random() > 0.5
  }
  update(updateTime) {
    this.curTime += updateTime - this.lastTime
    if (this.curTime >= this.frameInterval) {
      this.frame = (this.frame + 1) % 6
      this.curTime = 0
      if (this.hasTrail) {
        for (let i = 0; i < 5; i++) {
          particles.push(new Particle(this.x, this.y, this.width, this.color))
        }
      }
    }
    this.lastTime = updateTime
    this.x -= this.xSpeed
    if (this.x < -this.width) {
      this.shouldBeDeleted = true
      gameover = true
    }
    this.y += this.ySpeed
    if (this.y <= 0 || this.y >= canvas.height - this.height) {
      this.ySpeed = -this.ySpeed
    }
  }
  draw() {
    colorCtx.fillStyle = this.color
    colorCtx.fillRect(this.x, this.y, this.width, this.height)
    ctx.drawImage(
      this.img,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    )
  }
}
class Explosions {
  constructor(x, y) {
    this.img = new Image()
    this.img.src = './images/boom.png'
    this.spriteWidth = 200
    this.spriteHeight = 179
    this.aspectRatio = 0.5
    this.width = this.spriteWidth * this.aspectRatio
    this.height = this.spriteHeight * this.aspectRatio
    this.audio = new Audio()
    this.audio.src = './audios/Ice attack 2.wav'
    this.x = x
    this.y = y
    this.frame = 0
    this.totalFrame = 5
    this.frameInterval = 100
    this.curTime = 0
    this.lastTime = Date.now()
    this.shouldBeDeleted = false
  }
  update(start) {
    if (this.frame == 0) this.audio.play()
    this.curTime += start - this.lastTime
    if (this.curTime >= this.frameInterval) {
      this.frame++
      if (this.frame == this.totalFrame) this.shouldBeDeleted = true
      this.curTime = 0
    }
    this.lastTime = start
  }
  draw() {
    ctx.drawImage(
      this.img,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    )
  }
}
class Particle {
  constructor(x, y, size, color) {
    this.size = size
    this.x = x + this.size / 2
    this.y = y + this.size / 3 + (30 * Math.random() - 15)
    this.radius = ((Math.random() * this.size) / 2 + this.size / 2) / 10
    this.maxRadius = Math.random() * 15 + 20
    this.shouldBeDeleted = false
    this.xSpeed = Math.random() + 0.5
    this.color = color
  }
  update() {
    this.x -= this.xSpeed
    this.radius += 0.2
    if (this.radius >= this.maxRadius) this.shouldBeDeleted = true
  }
  draw() {
    ctx.save()
    ctx.globalAlpha = 1 - this.radius / this.maxRadius
    ctx.beginPath()
    ctx.fillStyle = this.color
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}
window.addEventListener('mousedown', (e) => {
  const [r, g, b, ..._] = colorCtx.getImageData(e.x, e.y, 1, 1).data
  ravens = ravens.filter((raven) => {
    if (raven.color == `rgb(${r},${g},${b})`) {
      score++
      return false
    }
    return true
  })
  explosions.push(new Explosions(e.x, e.y))
})
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  colorCanvas.width = window.innerWidth
  colorCanvas.height = window.innerHeight
  if (gameover) animate(0)
})
let last = 0
let curTime = 0
let ravenInterval = 500
function animate(start) {
  colorCtx.clearRect(0, 0, colorCanvas.width, colorCanvas.height)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawScore()
  if (!gameover) {
    let delttime = start - last
    last = start
    curTime += delttime
    if (curTime >= ravenInterval) {
      ravens.push(new Raven())
      curTime = 0
    }
    ;[...explosions, ...particles, ...ravens].forEach((raven) => raven.update(start))
    explosions = explosions.filter((item) => !item.shouldBeDeleted)
    particles = particles.filter((item) => !item.shouldBeDeleted)
    ravens = ravens.filter((item) => !item.shouldBeDeleted)
    ;[...explosions, ...particles, ...ravens].forEach((raven) => raven.draw())
    requestAnimationFrame(animate.bind(this, Date.now()))
  } else {
    ctx.textAlign = 'center'
    ctx.fillStyle = 'rgba(0,174,236,.3)'
    ctx.fillText('Game Over !  your score is ' + score, canvas.width / 2, canvas.height / 2)
    ctx.fillStyle = 'rgb(0,174,236)'
    ctx.fillText('Game Over !  your score is ' + score, canvas.width / 2 + 5, canvas.height / 2 + 5)
  }
}
animate(Date.now())
