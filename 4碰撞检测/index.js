const rect1 = { x: 5, y: 5, width: 50, height: 50 }
const rect2 = { x: 20, y: 10, width: 10, height: 10 }
const c1 = { x: 10, y: 10, radius: 300 }
const c2 = { x: 500, y: 500, radius: 150 }

//矩形碰撞检测
class Collisiondetector {
  constructor() {}
  detectSquare(rect1, rect2) {
    if (
      rect1.x + rect2.width < rect2.x ||
      rect1.x > rect2.x + rect1.width ||
      rect1.y + rect1.height > rect2.y ||
      rect1.y < rect2.y + rect2.height
    ) {
      return false
    } else {
      return true
    }
  }
  //检测圆形碰撞
  detectCircle(c1, c2) {
    const gap = Math.sqrt(Math.pow(c2.x - c1.x, 2) + Math.pow(c2.y - c1.y, 2))
    if (gap >= c1.radius + c2.radius) {
      return false
    } else {
      return true
    }
  }
  // 其他碰撞检测，如多边形等
}
