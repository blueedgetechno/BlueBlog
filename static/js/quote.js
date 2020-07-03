fetch("/js/quotes.txt").then(r => r.text()).then(t => generate(t))
function generate(t) {
  setTimeout(function () {
      var quotes = t.split('\n');
      document.getElementById('quoteline').textContent = quotes[Math.floor(Math.random() * quotes.length)]
    }, 2500);
  return
}

function give(date1, date2) {
  var ans = Math.round((date2 - date1) / (1000 * 60 * 60 * 24));
  if (ans >= 365) {
    return Math.round(ans / 365).toString() + " years ago";
  } else if (ans >= 30) {
    return Math.round(ans / 30).toString() + " months ago";
  } else if (ans >= 7) {
    if(Math.round(ans / 7)==1){
      return Math.round(ans / 7).toString() + " week ago";
    }else{
      return Math.round(ans / 7).toString() + " weeks ago";
    }
  } else {
    if (ans == 0) {
      return "today";
    } else if (ans == 1) {
      return "yesterday";
    } else {
      return ans.toString() + " days ago";
    }
  }
}

function dates() {
  var dt = document.getElementsByName('dated');
  for (var i = 0; i < dt.length; i++) {
    dt[i].textContent = give(new Date(dt[i].id), new Date())
  }
}

window.onload = dates;
