var currentUrl = ""
var nextHitTime = 0
var loopTimer = null
var hitTimer = null
var isActive = false
var storage = localStorage

function getUrls() {
  var urlString = storage.getItem("urls")
  var urlList = []
  if (urlString) {
    urlList = urlString.split(",")
  }
  else {
    urlList = [
      "https://google.com",
      "https://www.reddit.com",
      "https://facebook.com"
    ]
    localStorage.setItem("urls", urlList)
  }
  return urlList
}

function getRandomUrl() {
  var urls = getUrls()
  var randI = Math.floor(Math.random() * urls.length)
  return getUrls()[randI]
}

function getRandomWait() {
  return Math.floor(Math.random() * 50000) + 5000;
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
  var frameEl = document.getElementById("url-frame")
  frameEl.src = url
}

function setUrlText() {
  var urlEl = document.getElementById("url-text")
  urlEl.value = getUrls().join("\n")
}

function saveUrlText() {
  var urlEl = document.getElementById("url-text")
  var urls = urlEl.value.split("\n")
  var newUrls = []
  for (var i=0; i<urls.length; i++) {
    if (urls[i].length) newUrls.push(urls[i].trim())
  }
  storage.setItem("urls", newUrls)
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
  cpEl.innerText = currentUrl
  nhEl.innerText = (Math.round(nextHitTime / 100) * 10) / 100
  // Hack for crashing webviews in Electron
  var tab = document.querySelector(".is-active")
  if (tab.id === "browser-link") {
    frameEl.style.zIndex = 10
  } else {
    frameEl.style.zIndex = -10
  }
}

window.onload = function() {
  setUrlText()
}