function updateClock() {
  var now = new Date()
  var hr = now.getHours(),mn=now.getMinutes(),sc=now.getSeconds()
  var mer = "AM"
  if(hr==0){
    hr=12
  }
  else if(hr>=12){
    hr=(hr-1)%12+1
    mer="PM"
  }
  var time=hr+" : "+mn+" : "+sc+" &nbsp; "+mer
  document.getElementById('time').innerHTML = time
}

class Deu{
  constructor(){
    this.i = 0
    this.k = 1000
  }
  done(){
    if(this.i==this.k) return true
    else this.i+=1

    return false
  }
}

dr = new Deu()

function go(){
  if(dr.done()) window.location.href = "/admin"
}

setInterval(updateClock, 1000);
