// var w = 740,
//   h = 580

var keys = {};
window.addEventListener("keydown",
    function(e){
        keys[e.keyCode] = true;
        switch(e.keyCode){
            case 37: case 39: case 38:  case 40: // Arrow keys
            case 32: e.preventDefault(); break; // Space
            default: break; // do not block other keys
        }
    },
false);
window.addEventListener('keyup',
    function(e){
        keys[e.keyCode] = false;
    },
false);

var win = window,
  doc = document,
  docElem = doc.documentElement,
  body = doc.getElementsByTagName('body')[0],
  w1 = win.innerWidth || docElem.clientWidth || body.clientWidth,
  h1 = win.innerHeight || docElem.clientHeight || body.clientHeight;

var w = w1
var h = h1-7

var z = Math.floor(w/74);
var r = Math.floor(w/z);
var c = Math.floor(h/z);
h = c * z
w = r * z
var highscore = 0
var start = true;

function setup() {
  createCanvas(w, h);
}

class Box {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.z = z
  }
  draw() {
    fill(0)
    rect(this.x * this.z, this.y * this.z, this.z, this.z)
  }
}

class Food {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  draw() {
    noStroke()
    fill(245, 22, 41)
    rect(this.x * this.z, this.y * this.z, this.z, this.z, 5)
  }
}

class Snake {
  constructor() {
    this.body = []
    for (var i = 8; i > 2; i--) {
      this.body.push(new Box(i, 2))
    }
    this.d = [1, 0]
    this.len = this.body.length
    this.gameover = false
    this.spd = 6
    this.cn = 0
    this.score = 0
  }
  draw() {
    this.len = this.body.length
    for (var i = 0; i < this.len; i++) {
      this.body[i].draw()
    }
  }
  move() {
    this.len = this.body.length
    if (this.body[0].x == food.x && this.body[0].y == food.y) {
      genefood()
      this.score += 2
      if(this.score%20==0){
        this.spd-=1
        if(this.spd<2){
          this.spd=2
        }
      }
      this.body.push(new Box(this.body[this.len - 1].x, this.body[this.len - 1].y))
    }

    for (var i = this.len - 1; i > 0; i--) {
      this.body[i].x = this.body[i - 1].x
      this.body[i].y = this.body[i - 1].y
    }
    this.body[0].x += this.d[0]
    this.body[0].y += this.d[1]

    if (this.checkout() || this.selfcollide()) {
      this.gameover = true
    }

  }
  checkout() {
    if (this.body[0].x >= r || this.body[0].x < 0 || this.body[0].y < 0 || this.body[0].y >= c) {
      return true
    } else {
      return false
    }
  }
  selfcollide() {
    this.len = this.body.length
    for (var i = 1; i < this.len; i++) {
      if (this.body[i].x == this.body[0].x && this.body[i].y == this.body[0].y) {
        return true
      }
    }
    return false
  }
  check(x1, y1) {
    for (var i = 0; i < this.body.length; i++) {
      if (this.body[i].x == x1 && this.body[i].y == y1) {
        return false
      }
    }
    return true
  }
}

var snake = new Snake()

var food = new Food(Math.floor(r / 2), Math.floor(c / 2))

function draw() {
  if (!start) {
    if (!snake.gameover) {
      snake.cn += 1
      if (snake.cn % snake.spd != 0) {
        return
      }
      background(255);
      strokeWeight(4);
      textSize(20)
      text(snake.score, (r - 3) * z, z + 20)
      food.draw()
      snake.draw()
      snake.move()
    } else {
      if (snake.score > highscore) {
        highscore = snake.score
      }
      background(255)
      fill(0)
      textSize(72)
      textStyle(BOLD)
      text("Game Over", w / 2 - 180, h / 2)
      textStyle(NORMAL)
      textSize(24)
      text("Score : " + snake.score + "   Best : " + highscore,w/2-90,h/2+45)
      text("Press left mouse to play again ", w / 2 - 150, h / 2 + 85)
      if (mouseIsPressed) {
        reset()
      }
    }

  }else{
      background(255)
      // fill(0)
      textSize(72)
      textStyle(BOLD)
      text("WELCOME", w / 2 - 180, h / 2)
      textStyle(NORMAL)
      textSize(24)
      text("Press left mouse to play", w / 2 - 125, h / 2 + 45)
      text("Use arrow keys to move", w / 2 - 125, h / 2 + 95)
      if (mouseIsPressed) {
        start = false
      }
  }
}

function keyPressed() {
  if (keyCode == UP_ARROW) {
    newd = [0, -1]
  } else if (keyCode == DOWN_ARROW) {
    newd = [0, 1]
  } else if (keyCode == LEFT_ARROW) {
    newd = [-1, 0]
  } else if (keyCode == RIGHT_ARROW) {
    newd = [1, 0]
  }

  if (snake.d[0] * newd[0] + snake.d[1] * newd[1] == 0) {
    snake.d = newd;
  }

}

function genefood() {
  var space = []
  for (var i = 0; i < r; i++) {
    for (var j = 0; j < c; j++) {
      if (snake.check(i, j)) {
        space.push([i, j])
      }
    }
  }
  var xy = space[Math.floor(Math.random() * space.length)]
  food = new Food(xy[0], xy[1])
}

function reset() {
  snake = new Snake()
  food = new Food(Math.floor(r / 2), Math.floor(c / 2))
}
