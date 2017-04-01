var currentUrl = ""
var nextHitTime = 0
var loopTimer = null;
var hitTimer = null;
var isActive = false;

function getUrls() {
  return [
    "https://google.com",
    "https://www.reddit.com",
    "https://facebook.com"
  ]
}

function getRandomUrl() {
  var urls = getUrls()
  var randI = Math.floor(Math.random() * urls.length)
  return getUrls()[randI]
}

function getRandomWait() {
  return Math.floor(Math.random() * 20000);
}

function toggle() {
  if (isActive) stop()
  else start()
}

function stop() {
  isActive = false
  document.getElementById("controlButton").innerHTML = '<i class="material-icons">play_arrow</i>'
}

function start() {
  isActive = true
  clearTimeout(loopTimer)
  loopTimer = setInterval(function() { mainLoop() }, 100)
  document.getElementById("controlButton").innerHTML = '<i class="material-icons">pause</i>'
}

function doHit(url) {
  currentUrl = url
  document.getElementById("url-frame").src = url
}

function mainLoop() {
  if (isActive) {
    nextHitTime -= 100
    if (nextHitTime < 0) {
      doHit(getRandomUrl())
      nextHitTime = getRandomWait()
    }
  }
  updateUI()
}

function updateUI() {
  var cpEl = document.getElementById("currentUrl")
  var nhEl = document.getElementById("nextHitTime")
  var frameEl = document.getElementById("url-frame")
  var tabId = document.querySelector(".is-active").id
  if (tabId === "browser-link") {
    if (frameEl.className.indexOf("hidden") > -1) {
      frameEl.className = frameEl.className.replace("hidden", "")
    }
  } else {
    if (frameEl.className.indexOf("hidden") === -1) {
      frameEl.className += " hidden"
    }
  }
  cpEl.innerText = currentUrl
  nhEl.innerText = (Math.round(nextHitTime / 100) * 10) / 100
}