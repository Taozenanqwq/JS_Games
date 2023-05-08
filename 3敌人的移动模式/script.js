let gameFrame = 0
const CANVAS_WIDTH = 350
const CANVAS_HEIGHT = 700
const enemyCount = 10
const layers = [{}, {}, {}, {}]
const ImgParamRecorder = [
  { src: './imgs/enemy1.png', width: 1758, height: 155, frame: 6 },
  { src: './imgs/enemy2.png', width: 1596, height: 188, frame: 6 },
  { src: './imgs/enemy3.png', width: 1308, height: 177, frame: 6 },
  { src: './imgs/enemy4.png', width: 1917, height: 212, frame: 9 }
]
class AbstractEnemyFactory {
  constructor(src, imgWidth, imgHeight, frame) {
    this.img = new Image()
    this.img.src = src
    //图片大小相关
    this.spriteWidth = imgWidth / frame
    this.spriteHeight = imgHeight
    this.width = this.spriteWidth / 4
    this.height = this.spriteHeight / 4
    this.imgWidth = imgWidth
    //初始位置
    this.x = Math.random() * (CANVAS_WIDTH - this.width)
    this.y = Math.random() * (CANVAS_HEIGHT - this.height)
    // 动画相关
    this.frame = 0
    this.animateSpeed = Math.ceil(3 * Math.random()) + 2
  }
  update() {}
  draw(ctx) {
    if (gameFrame % this.animateSpeed == 0) {
      this.frame += this.spriteWidth
      if (this.frame >= this.imgWidth) this.frame = 0
    }
    ctx.drawImage(
      this.img,
      this.frame,
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

class Enemy1 extends AbstractEnemyFactory {
  constructor(...params) {
    super(...params)
  }
  update() {
    //晃动
    this.x += Math.random() * 3 - 1.5
    this.y += Math.random() * 3 - 1.5
  }
}
class Enemy2 extends AbstractEnemyFactory {
  constructor(...params) {
    super(...params)
    this.angle = Math.random() * 2
    this.angleSpeed = Math.random() * 0.22
    this.speed = Math.random() * 2
    this.curve = Math.random() * 7
  }
  update() {
    //左侧移动并重复出现
    this.x -= 1
    this.y += this.curve * Math.sin(this.angle)
    this.angle += this.angleSpeed
    if (this.x < -this.width) this.x = CANVAS_WIDTH
  }
}
class Enemy3 extends AbstractEnemyFactory {
  constructor(...params) {
    super(...params)
    this.angle = Math.random() * 2
    this.angleSpeed = Math.random() * 0.5 + 1.5
    this.curve = Math.random() * 150 + 50
  }
  update() {
    this.x =
      (CANVAS_WIDTH / 2) * Math.sin((this.angle * Math.PI) / 90) +
      (CANVAS_WIDTH / 2 - this.width / 2)
    this.y =
      (CANVAS_HEIGHT / 2) * Math.cos((this.angle * Math.PI) / 180) +
      (CANVAS_HEIGHT / 2 - this.height / 2)
    this.angle += this.angleSpeed
  }
}
class Enemy4 extends AbstractEnemyFactory {
  constructor(...params) {
    super(...params)
    this.newX = Math.random() * (CANVAS_WIDTH - this.width)
    this.newY = Math.random() * (CANVAS_HEIGHT - this.height)
    this.freq = Math.floor(50 + Math.random() * 30)
    this.moveSpeed = Math.random() * 30 + 30
  }
  update() {
    if (gameFrame % this.freq == 0) {
      this.newX = Math.random() * (CANVAS_WIDTH - this.width)
      this.newY = Math.random() * (CANVAS_HEIGHT - this.height)
    }
    let dx = this.x - this.newX
    let dy = this.y - this.newY
    this.x -= dx / this.moveSpeed
    this.y -= dy / this.moveSpeed
  }
}
const enemyTypes = [Enemy1, Enemy2, Enemy3, Enemy4]
for (let i = 0; i < layers.length; i++) {
  const canvas = document.getElementById(`canvas${i + 1}`)
  const ctx = canvas.getContext('2d')
  const img = ImgParamRecorder[i]
  canvas.width = CANVAS_WIDTH
  canvas.height = CANVAS_HEIGHT
  const cur = layers[i]
  cur.canvas = canvas
  cur.ctx = ctx
  const enemyList = []
  for (let j = 0; j < enemyCount; j++) {
    enemyList.push(new enemyTypes[i](img.src, img.width, img.height, img.frame))
  }
  cur.enemies = enemyList
}

function animate() {
  gameFrame++
  for (let layer of layers) {
    const enemies = layer.enemies
    const ctx = layer.ctx
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    enemies.forEach((enemy) => {
      enemy.update()
      enemy.draw(ctx)
    })
  }
  requestAnimationFrame(animate)
}
animate()
