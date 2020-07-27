document.addEventListener('contextmenu', event => event.preventDefault());

var win = window,
  doc = document,
  docElem = doc.documentElement,
  body = doc.getElementsByTagName('body')[0],
  x1 = win.innerWidth || docElem.clientWidth || body.clientWidth,
  y1 = win.innerHeight || docElem.clientHeight || body.clientHeight;

var w = x1
var h = y1-4

function setup() {
  createCanvas(w, h)
}

var z = 40
var r = Math.floor(w / z)
var c = Math.floor(h / z)
var mn = Math.floor(r*c*40/252)
var flags = mn

var colors = [
  [72, 133, 237, 47, 86, 154],
  [0, 135, 68, 0, 88, 44],
  [182, 72, 242, 118, 47, 157],
  [219, 50, 54, 142, 33, 35],
  [244, 194, 13, 159, 126, 8],
  [244, 132, 13, 159, 86, 8],
  [72, 230, 241, 47, 150, 157]
]

class Box {
  constructor(x, y, v, col) {
    this.x = x
    this.y = y
    this.s = 0
    this.f = 0
    this.v = v
    this.col = col
    if (this.v == -1) {
      this.cols = colors[Math.floor(Math.random() * 7)]
    }
  }
  draw() {
    noStroke()
    if (this.s) {
      if (this.col) {
        fill(229, 194, 159)
      } else {
        fill(215, 184, 153)
      }

      rect(this.x * z, this.y * z, z, z)

      if (this.v == 1) fill(47, 126, 203)
      else if (this.v == 2) fill(59, 143, 62)
      else if (this.v == 3) fill(212, 54, 52)
      else if (this.v == 4) fill(123, 32, 162)
      else if (this.v == 5) fill(128, 0, 0)
      else if (this.v == 6) fill(183, 97, 17)
      else fill(100)
      if (this.v > 0) {
        textSize(22)
        textStyle(BOLD)
        text(this.v, this.x * z + z / 3, this.y * z + 2 * z / 3)
      }
      if (this.v == -1) {
        fill(this.cols[0], this.cols[1], this.cols[2])
        rect(this.x * z, this.y * z, z, z)
        fill(this.cols[3], this.cols[4], this.cols[5])
        circle(z / 2 + this.x * z, z / 2 + this.y * z, z / 2)
      }
    } else {
      if (this.col) {
        fill(170, 215, 81)
      } else {
        fill(162, 209, 73)
      }
      rect(this.x * z, this.y * z, z, z)
      if(isvalid(this.x+1,this.y)){
        if(boxes[this.x+1][this.y].s){
          stroke(136,176,59)
          strokeWeight(4)
          line((this.x+1)*z,this.y*z,(this.x+1)*z,(this.y+1)*z)
        }
      }
      if(isvalid(this.x-1,this.y)){
        if(boxes[this.x-1][this.y].s){
          stroke(136,176,59)
          strokeWeight(2)
          line((this.x)*z,this.y*z,(this.x)*z,(this.y+1)*z)
        }

      }
      if(isvalid(this.x,this.y-1)){
        if(boxes[this.x][this.y-1].s){
          stroke(136,176,59)
          strokeWeight(2)
          line(this.x*z,this.y*z,(this.x+1)*z,this.y*z)
        }

      }
      if(isvalid(this.x,this.y+1)){
        if(boxes[this.x][this.y+1].s){
          stroke(136,176,59)
          strokeWeight(4)
          line(this.x*z,(this.y+1)*z,(this.x+1)*z,(this.y+1)*z)
        }
      }


      if (this.f) {
        fill(242, 54, 7)
        stroke(242, 54, 7)
        var vt = [
          1.5 * z / 5 + this.x * z,
          z / 5 + this.y * z,
          4 * z / 5 + this.x * z,
          2 * z / 5 + this.y * z,
          1.5 * z / 5 + this.x * z,
          3 * z / 5 + this.y * z
        ]
        triangle(vt[0], vt[1], vt[2], vt[3], vt[4], vt[5])
        strokeWeight(4)
        line(1.5 * z / 5 + this.x * z,
          1.25 * z / 5 + this.y * z,
          1.5 * z / 5 + this.x * z,
          4 * z / 5 + this.y * z)
        arc(1.5 * z / 5 + this.x * z, 4 * z / 5 + this.y * z, z / 8, z / 8, PI, 0, CHORD)
      }
    }
  }
}

var a = []
for (var i = 0; i < r; i++) {
  a.push([])
  for (var j = 0; j < c; j++) {
    a[i].push(0)
  }
}

function g(sx) {
  return [Math.floor(sx / c), sx % c]
}

function f() {
  var px = Math.floor(Math.random() * r * c)
  var py = g(px)
  if (a[py[0]][py[1]] == -1) {
    f()
  } else {
    a[py[0]][py[1]] = -1
  }
}

for (var i = 0; i < mn; i++) {
  f()
}

function isvalid(rx, ry) {
  return rx > -1 && rx < r && ry > -1 && ry < c
}

function values(x, y) {
  var cn = 0
  for (var i = -1; i < 2; i++) {
    for (var j = -1; j < 2; j++) {
      if (i != 0 || j != 0) {
        if (isvalid(x + i, y + j)) {
          if (a[x + i][y + j] == -1) {
            cn += 1
          }
        }
      }
    }
  }
  return cn
}


for (var i = 0; i < r; i++) {
  for (var j = 0; j < c; j++) {
    if (a[i][j] != -1) {
      a[i][j] = values(i, j)
    }
  }
}

var boxes = []
for (var i = 0; i < r; i++) {
  boxes.push([])
  for (var j = 0; j < c; j++) {
    boxes[i].push(new Box(i, j, a[i][j], (i + j) % 2))
  }
}

function go(x, y) {
  for (var i = -1; i < 2; i++) {
    for (var j = -1; j < 2; j++) {
      if (i != 0 || j != 0) {
        if (isvalid(x + i, y + j)) {
          if (boxes[x + i][y + j].v == 0 && boxes[x + i][y + j].s == 0) {
            boxes[x + i][y + j].s = 1
            go(x + i, y + j)
          } else {
            boxes[x + i][y + j].s = 1
          }
        }
      }
    }
  }
}

var won = 3

function draw() {
  background(170, 215, 81)
  var tot = 0
  for (var i = 0; i < r; i++) {
    for (var j = 0; j < c; j++) {
      boxes[i][j].draw()
      if (boxes[i][j].s) tot += 1
    }
  }
  if (tot == r * c - mn) {
    won = 1
  }

	fill(255,100)
	textSize(24)
	text("flags : "+flags, w-110, 30)

  if (won) {
    fill(100, 100)
    rect(0, 0, w, h)
    fill(255, 70, 29)
    rect(w / 2 - w / 4, h / 2 - h / 4, w / 2, h / 2, z / 2)
    fill(220, 255, 29)
    textSize(72)
    if (won == 1) {
      text("You Won", w / 2 - w / 5, h / 2 - h / 15)
    } else if (won == 2) {
      text("You Lose", w / 2 - w / 5, h / 2 - h / 15)
    } else {
      text("Lets Start", w / 2 - w / 5, h / 2 - h / 15)
    }

    fill(235, 140, 43)
    if (won != 3) rect(w / 2 - w / 6, h / 2 + h / 40, w / 3, h / 8, z / 3)
    fill(255)
    if (won == 3) {
      textSize(30)
      text("Left mouse to dig", w / 2 - w / 7, h / 2 + h / 30)
      text("Right right to flag", w / 2 - w / 7, h / 2 + h / 8)
    } else {
      textSize(36)
      text("Play again", w / 2 - w / 9, h / 2 + h / 10)
    }
  }
}

function mousePressed() {
  if (won == 0) {
    var x = Math.floor(mouseX / z)
    var y = Math.floor(mouseY / z)
    x = Math.min(x, r - 1)
    y = Math.min(y, c - 1)
    if (x < 0) x = 0
    if (y < 0) y = 0
    if (mouseButton == LEFT) {
      if (boxes[x][y].f == 0) {
        if (boxes[x][y].s == 0) {
          boxes[x][y].s = 1
          if (boxes[x][y].v == -1) {
            show()
            won = 2
            return
          }
          if (boxes[x][y].v == 0) {
            go(x, y)
          }
        }
      }
    } else {
      if (boxes[x][y].s == 0) {
        if(boxes[x][y].f){
					flags+=1
				}else{
					flags-=1
				}
				boxes[x][y].f^=1
      }
    }
  } else {
    if(w!=3){
			reset()
		}else{
			w=0
		}
  }
}

function show() {
  for (i = 0; i < r; i++) {
    for (j = 0; j < c; j++) {
      if (boxes[i][j].v == -1) {
        boxes[i][j].s = 1
      }
    }
  }
}

function reset() {
  won = 0
	flags = mn
  var i = 0,
    j = 0
  for (i = 0; i < r; i++) {
    for (j = 0; j < c; j++) {
      a[i][j] = 0
    }
  }
  for (i = 0; i < mn; i++) {
    f()
  }
  for (i = 0; i < r; i++) {
    for (j = 0; j < c; j++) {
      if (a[i][j] != -1) {
        a[i][j] = values(i, j)
      }
    }
  }

  for (i = 0; i < r; i++) {
    for (j = 0; j < c; j++) {
      boxes[i][j] = new Box(i, j, a[i][j], (i + j) % 2)
    }
  }
}
