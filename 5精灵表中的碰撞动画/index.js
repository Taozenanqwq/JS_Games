const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
canvas.width = 500
canvas.height = 700
ctx.fillStyle = 'white'
ctx.fillRect(50, 50, 100, 150)
let gameFrame = 5
let canvasPosition = canvas.getBoundingClientRect()
const audio = new Audio()

const explosion = []
class Explosion {
  constructor(x, y) {
    this.spriteHeight = 179
    this.spriteWidth = 200
    this.width = this.spriteWidth / 2
    this.height = this.spriteHeight / 2
    this.x = x - this.width / 2
    this.y = y - this.height / 2
    this.image = new Image()
    this.image.src = './images/boom.png'
    this.frame = 0
    this.f = 0
    //每次爆炸声音有持续时间，为了让每次点击都产生需要给每个explosion一个audio
    this.sound = new Audio()
    this.sound.src = './audios/Ice attack 2.wav'
  }
  update() {
    if (this.frame == 0) this.sound.play()
    this.f++
    if (this.f % 5 == 0) {
      this.frame++
    }
  }
  draw() {
    ctx.drawImage(
      this.image,
      this.spriteWidth * this.frame,
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
window.addEventListener('click', (e) => {
  let posX = e.x - canvasPosition.left
  let posY = e.y - canvasPosition.top
  explosion.push(new Explosion(posX, posY))
})
window.addEventListener('resize', (e) => {
  canvasPosition = canvas.getBoundingClientRect()
})
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for (let i = 0; i < explosion.length; i++) {
    explosion[i].update()
    explosion[i].draw()
    if (explosion[i].frame >= 5) {
      explosion.splice(i, 1)
    }
  }
  requestAnimationFrame(animate)
}
animate()
