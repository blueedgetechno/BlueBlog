var win = window,
  doc = document,
  docElem = doc.documentElement,
  body = doc.getElementsByTagName('body')[0],
  x1 = win.innerWidth || docElem.clientWidth || body.clientWidth,
  y1 = win.innerHeight || docElem.clientHeight || body.clientHeight;

var w = x1
var h = y1 - 10

function setup() {
  createCanvas(w, h);
}

function f() {
  return 2 * Math.round(Math.random()) - 1
}


var l = 15,
  b = 80,
  n = Math.floor(w / b),
  m = Math.floor((15 * h) / 580),
  r = 15,
  spd = 5,
  over = 0,
  start = 1,
  dw = 50,
  sc = 0,
  ran = m * 10,
  init = ran,
  tot = n * m,
  high = 0,
  p = (w % b) / 2,
  life = 3,
  lp = 25,
  ps=36,
  pau=0

class Stick {
  constructor(y, b) {
    this.y = y
    this.b = b
    this.x = w / 2
  }
  draw() {
    fill(0)
    this.x = min(w - this.b, mouseX)
    rect(this.x, this.y, this.b, 12)
  }
}

class Brick {
  constructor(x, y, scr, c) {
    this.x = x
    this.y = y
    this.b = b
    this.l = l
    this.c = c
    this.v = 1
    this.scr = scr
  }
  draw() {
    noStroke()
    fill(this.c)
    rect(this.x, this.y, this.b, this.l)
  }
  inv() {
    this.v = 0
    sc += this.scr
    tot -= 1
    if (tot == 0) over = 1
    else {
      if ((n * m - tot) % Math.round((n * m) / 5) == 0) ball.spd += 1
      // console.log(ball.spd)
    }
  }
}

class Ball {
  constructor(x, y) {
    // console.log(x, y)
    this.x = x
    this.y = y
    this.r = r
    this.d = [f(), -1]
    this.spd = spd
  }
  draw() {
    fill(0)
    ellipse(this.x, this.y, this.r)
  }
  move() {
    this.x += this.d[0] * this.spd
    this.y += this.d[1] * this.spd

    if (this.y >= st.y - r && this.y <= st.y && this.x >= st.x && this.x <= st.x + st.b) {
      this.d[1] = -1
      if (this.d[0] * (st.x + st.b / 2 - this.x) > 0) this.d[0] *= -1
    }
    if (this.y <= this.r) this.d[1] *= -1
    if (this.x <= this.r || this.x > w - this.r) this.d[0] *= -1

    if (this.y >= h - this.r) {
      life -= 1
      pau+=1
      if (life == 0) {
        over = 1
      } else {
        this.x = w/2+f()*Math.round(Math.random()*(mouseX)/2)
        this.y = h - 60
        this.d[0] = f()
        this.d[1] = -1
        this.draw()
      }
    }

  }
  detect() {
    for (var i = 0; i < n * m; i++) {
      if (!br[i].v) continue
      //Down
      if (this.x >= br[i].x && this.x <= br[i].x + br[i].b) {
        if (this.y < br[i].y) {
          if (br[i].y - this.y <= this.r) {
            this.d[1] *= -1
            br[i].inv()
          }
        } else {
          if (this.y - br[i].y <= br[i].l + this.r) {
            this.d[1] *= -1
            br[i].inv()
          }
        }
      } else {
        if (this.x <= br[i].x) {
          if (br[i].x - this.x <= this.r && this.y >= br[i].y && this.y <= br[i].y + br[i].l) {
            this.d[0] *= -1
            br[i].inv()
          }
        } else {
          if (this.x - br[i].x <= this.r + br[i].b && this.y >= br[i].y && this.y <= br[i].y + br[i].l) {
            this.d[0] *= -1
            br[i].inv()
          }
        }
      }
    }
  }
}

var st = new Stick(h - 50, 100)
var br = []
for (var j = 0; j < m; j++) {
  p = (w % b) / 2
  for (var i = 0; i < n; i++) {
    // console.log(ran)
    br.push(new Brick(p, dw, ran, init - ran))
    p += b + 1
  }
  dw += l + 1
  ran -= 10
}

function drawlife() {
  var j = lp
  for (var i = 0; i < life; i++) {
    fill(255, 0, 0)
    ellipse(j, lp, 20)
    j += lp
  }
}

var ball = new Ball(w / 2, h - 60)

function draw() {
  if(pau%ps){
    pau+=1
  }
  if(pau%ps>2){
    return
  }
  if (!start) {
    if (!over) {
      background(255)
      drawlife()
      textSize(30)
      text(sc, w / 2 - 5, 35)
      st.draw()
      for (var i = 0; i < n * m; i++) {
        if (br[i].v) br[i].draw()
      }
      ball.draw()
      ball.move()
      ball.detect()
    } else if (tot == 0) {
      background(0)
      textSize(50)
      fill(255)
      text("Congratulation, you won", w / 2 - 270, h / 2 - 40)
      textSize(25)
      text("Press Left mouse to play again", w / 2 - 170, h / 2 + 20)
      if (mouseIsPressed) reset()
    } else {
      background(0)
      textSize(80)
      fill(255)
      high = max(high, sc)
      text("Game Over", w / 2 - 220, h / 2 - 40)
      textSize(38)
      text("Your Score : " + sc, w / 2 - 150, h / 2 + 10)
      textSize(20)
      text("Highest Score : " + high, w / 2 - 100, h / 2 + 50)
      if (mouseIsPressed) reset()
      textSize(20)
      text("Press Left mouse to play again", w / 2 - 150, h / 2 + 90)
    }
  } else {
    background(0)
    textSize(80)
    fill(255)
    text("Welcome", w / 2 - 180, h / 2 - 40)
    textSize(25)
    text("Press Left mouse to play", w / 2 - 150, h / 2 + 20)
    if (mouseIsPressed) start = 0

  }
}

function reset() {
  if (over) {
    over = 0
    sc = 0
    life = 3
    pau=0
    tot = n * m
    for (var i = 0; i < n * m; i++) {
      br[i].v = 1
    }
    ball.x = w / 2
    ball.y = h - 60
    ball.d[0] = f()
    ball.d[1] = -1
    ball.spd = spd
  }
}
