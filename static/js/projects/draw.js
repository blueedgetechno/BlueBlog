// import * as tf from '@tensorflow/tfjs';
// const model = tf.loadLayersModel('/projects/model.json')

var sz = 18
var w = sz * 28
var h = sz * 28

function setup() {
  var canvas = createCanvas(w, h)
  canvas.parent('drawArea')
}

function valid(i, j) {
  return -1 < i && i < 28 && -1 < j && j < 28
}

class Box {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.color = 0
    this.value = 0
    this.im = 0.75
    this.dir = []
    for (var i = -1; i < 2; i++) {
      for (var j = -1; j < 2; j++) {
        if (i == 0 && j == 0) continue;
        if (valid(x + i, y + j)) {
          this.dir.push([x + i, y + j])
        }
      }
    }

  }
  sigmoid(x) {
    return 1 / (1 + Math.exp(-x))
  }
  draw() {
    fill(this.color)
    noStroke()
    rect(this.x * sz, this.y * sz, sz, sz)
  }
  ink(c, ng) {
    this.value += c
    this.color = Math.floor(255 * this.sigmoid(this.value))
    if (ng == 0) {
      for (var i = 0; i < this.dir.length; i++) {
        var x = this.dir[i]
        boxes[x[0]][x[1]].ink(c * this.im, 1)
      }
    }
  }
}

var boxes = []

for (var i = 0; i < 28; i += 1) {
  boxes.push([])
  for (var j = 0; j < 28; j += 1) {
    boxes[i].push(new Box(i, j))
  }
}

var x, y;

function draw() {
  background(0)
  for (var i = 0; i < 28; i += 1) {
    for (var j = 0; j < 28; j += 1) {
      boxes[i][j].draw()
    }
  }
  x = Math.floor(mouseX / sz)
  y = Math.floor(mouseY / sz)
  if (mouseIsPressed) {
    if (valid(x, y)) {
      boxes[x][y].ink(0.95, 0)
    }
  }

}

function keyPressed() {
  if (keyCode === BACKSPACE) {
    reset()
  }
  if (keyCode === ENTER) {
    show()
  }
}

function reset() {
  var card = document.getElementsByClassName('guesscard')[0]
  for (var i = 0; i < 28; i += 1) {
    for (var j = 0; j < 28; j += 1) {
      boxes[i][j].color = 0
    }
  }
  card.hidden = true
}

var num = []
for (var i = 0; i < 28; i += 1) {
  num.push([])
  for (var j = 0; j < 28; j += 1) {
    num[i].push(0)
  }
}

function show() {
  for (var i = 0; i < 28; i += 1) {
    for (var j = 0; j < 28; j += 1) {
      num[i][j] = boxes[i][j].color
    }
  }

  $.ajax({
    url: '/projects/digit/predict',
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify({
      "number": num
    }),
  }).done(function(result) {
    var card = document.getElementsByClassName('guesscard')[0]
    card.innerText = "This digit looks " + result + " to me"
    card.hidden = false
  })
}
