async function init() {
  try {
    const model = await tf.loadLayersModel('localstorage://dg-model');
  } catch (e) {
    const model = await tf.loadLayersModel('https://raw.githubusercontent.com/blueedgetechno/handwritten-digit-recognition/master/model.json')
    console.log('model loaded')
    await model.save('localstorage://dg-model');
  } finally {
    setTimeout(function () {
      var vas = document.getElementById('loading')
      vas.innerText = "Draw a digit"
    },3000)
  }

}

init()

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

async function show() {
  for (var i = 0; i < 28; i += 1) {
    for (var j = 0; j < 28; j += 1) {
      inp[0][j][i] = boxes[i][j].color
    }
  }
  const model = await tf.loadLayersModel('localstorage://dg-model');
  var pred = model.predict(tf.tensor(inp)).dataSync()
  var ind = 0
  var pb = 0
  for(var i=0;i<pred.length;i++){
    if(pred[i]>pb){
      pb = pred[i]
      ind = i
    }
  }

  var card = document.getElementsByClassName('guesscard')[0]
  card.innerText = "This digit looks like " + ind + " to me"
  card.hidden = false

}

var inp = []
inp.push([])
for (var i = 0; i < 28; i += 1) {
  inp[0].push([])
  for (var j = 0; j < 28; j += 1) {
    inp[0][i].push(0)
  }
}
