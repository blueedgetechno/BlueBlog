var w = 736,
  h = 590,
  r = 250

const pi = Math.PI,
  sin = Math.sin,
  cos = Math.cos

function color() {
  return Math.floor(Math.random() * 255)
}

function draw(n, t) {
  var c = document.getElementById("display")
  var ctx = c.getContext("2d")

  ctx.clearRect(0, 0, c.width, c.height);

  ctx.lineWidth = 1
  ctx.strokeStyle = "#007fed"
  ctx.beginPath()
  ctx.arc(w / 2, h / 2, r, 0, 2 * Math.PI)
  ctx.stroke()
  ctx.closePath()

  var a = (2 * pi) / n,
    x = 0,
    y = 0,
    pt = 1


  ctx.lineWidth = 1

  for (var i = 0; i < n; i++) {
    x = r * cos(a * i)
    y = r * sin(a * i)

    ctx.beginPath()
    ctx.arc(w / 2 - x, h / 2 - y, pt, 0, 2 * Math.PI)
    ctx.stroke()
    ctx.closePath()
  }

  var x1 = 0,
    y1 = 0,
    x2 = 0,
    y2 = 0

  ctx.lineWidth = 1
  ctx.strokeStyle = "#006dda"

  var c1 = color(),
    c2 = color(),
    c3 = color()

  // ctx.strokeStyle = "rgb(" + c1 + "," + c2 + "," + c3 + ")"

  for (var i = 0; i < n; i++) {
    x1 = r * cos(a * i)
    y1 = r * sin(a * i)

    x1 = w / 2 - x1
    y1 = h / 2 - y1

    j = (t * i) % n

    x2 = r * cos(a * j)
    y2 = r * sin(a * j)

    x2 = w / 2 - x2
    y2 = h / 2 - y2

    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  }

}

function callme() {
  var multi = document.getElementById('multiplier')
  var base = document.getElementById('base')
  multi.parentElement.children[0].innerText = "Multiplier : " + multi.value
  base.parentElement.children[0].innerText = "Base : " + base.value
  draw(base.value, multi.value)
}

var player = 0
var playing = 0
var t = 0

function play() {
  var multi = document.getElementById('multiplier')
  var base = document.getElementById('base')
  if (playing) {
    clearInterval(player)
  } else {
    t = Math.floor(multi.value)
    if(t==2){
      t = 0
    }
    player = setInterval(() => {
      multi.value = t
      t += 0.1
      multi.parentElement.children[0].innerText = "Multiplier : " + multi.value
      base.parentElement.children[0].innerText = "Base : " + base.value
      draw(base.value, t)

      if (t > 98.9) {
        t = 0
        clearInterval(player)
      }
    }, 100)
  }
  playing ^= 1
}
