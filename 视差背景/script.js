const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
const CANVAS_HEIGHT = (canvas.height = 700)
const CANVAS_WIDTH = (canvas.width = 800)
let gameSpeed = 5

class ImageManager {
  constructor(img) {
    this.img = img
    this.width = 2400
    this.height = 700
    this.gameFrame = 0
    this.speedModifier = 1
    this.speed = gameSpeed * this.speedModifier
  }
  drawImage(ctx, x, y) {
    ctx.drawImage(this.img, x, y)
  }
  animateImg(ctx) {
    this.speed = gameSpeed * this.speedModifier
    this.gameFrame = Math.floor(this.gameFrame - this.speed) % this.width
    this.drawImage(ctx, this.gameFrame, 0)
    this.drawImage(ctx, this.gameFrame + this.width, 0)
  }
  getImg() {
    return this.img
  }
}

function createImgList(srcList) {
  const imgList = []
  for (let src of srcList) {
    const img = new Image()
    img.src = src
    const imgManager = new ImageManager(img)
    imgList.push(imgManager)
  }
  return imgList
}

const srcList = [
  './imgs/layer-1.png',
  './imgs/layer-2.png',
  './imgs/layer-3.png',
  './imgs/layer-4.png',
  './imgs/layer-5.png'
]
const imgManagerList = createImgList(srcList)

window.addEventListener('load', () => {
  function animate(imgManagerList) {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    for (let imgManager of imgManagerList) {
      imgManager.animateImg(ctx, 5)
    }
    requestAnimationFrame(animate.bind(null, imgManagerList))
  }
  animate(imgManagerList)

  const range = document.getElementsByTagName('input')[0]
  range.onchange = (e) => {
    gameSpeed = (e.target.value / 100) * 25
    console.log(gameSpeed)
  }
})
