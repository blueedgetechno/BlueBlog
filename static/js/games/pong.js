var win = window,
    doc = document,
    docElem = doc.documentElement,
    body = doc.getElementsByTagName('body')[0],
    x1 = win.innerWidth || docElem.clientWidth || body.clientWidth,
    y1 = win.innerHeight|| docElem.clientHeight|| body.clientHeight;

var w=x1
var h=y1-10

function setup() {
  createCanvas(w, h);
}

function g(){
  return 2 * Math.round(Math.random()) - 1
}
var b = 10,
  l = 70
var loc = w-36
var opp = 36-b
var yx = h / 2 - l


var r = 12
var x = w / 2,
  y = h / 2
var d = [g(),g()]
var spd = 4

var over = false
var won = false
var dk = Math.round(Math.random())
var c = 0
var z = 3
var diff = 6
var start = true

function mousePressed() {
  if (over) {
    yx = h / 2 - l
    x = w / 2
    y = h / 2
    d = [g(),g()]
    spd = 5
    over = false
    won = false
    dk = Math.round(Math.random())
    c = 0
  }
}

function draw() {
  if (!start) {
    if (!over && !won) {
      if (dk) {
        background(255);
        fill(0)
        rect(loc, min(mouseY, h - l), b, l)
        rect(opp, max(0, min(yx, h - l)), b, l)
        ellipse(x, y, r)
      } else {
        background(0);
        fill(255)
        rect(loc, min(mouseY, h - l), b, l)
        fill(255)
        rect(opp, max(0, min(yx, h - l)), b, l)
        fill(255)
        ellipse(x, y, r)
      }
      x += d[0] * spd
      y += d[1] * spd

      if (y > h - r || y < r) d[1] *= -1

      if (x >= loc - r && x <= loc && y >= mouseY && y <= mouseY + l) {
        d[0] *= -1
        c += 1
        if (c % z == 0) dk ^= 1
        if (c % diff == 0) spd += 1
      }
      go()

      if (x >= opp - r &&x<=opp + b && y >= yx && y <= yx + l) d[0] *= -1

      if (x < r) won = true
      if (x >= w) over = true

      textSize(40)
      text(c.toString(), w / 2 - 20, 60)
    } else {
      background(255 * dk)
      fill(255*(dk^1))
      textSize(60)
      if (won) msg = "You won"
      else if (over) msg = "Game Over"
      else msg = "Error"

      text(msg, w / 2 - 150, h / 2)
      textSize(30)
      text("Your score : " + c.toString(), w / 2 - 80, h / 2 + 45)
      textSize(20)
      text("Press Left mouse to start", w / 2 - 98, h / 2+80)
    }
  } else {
    background(255*dk)
    fill(255*(dk^1))
    textSize(60)
    text("Welcome", w / 2 - 150, h / 2 - 50)
    textSize(30)
    text("Press Left mouse to start", w / 2 - 190, h / 2)
    if (mouseIsPressed) start = false
  }

}

function go() {
  if (d[0] == -1) {
    if (d[1] == -1) yx = abs(x - y - opp)
    else {
      var t = x + y - opp
      yx = h - abs(h - t)
    }
    yx -= l / 2
  }
}
