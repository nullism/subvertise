var currentUrl = ""
var nextHitTime = 0
var loopTimer = null
var hitTimer = null
var isActive = false
var storage = localStorage
var ConfigStore = require("configstore")
var store = new ConfigStore("subvertise")

// Elements
var browserEl = document.getElementById("url-frame")
var urlTextEl = document.getElementById("url-text")
var maxWaitTextEl = document.getElementById("max-wait-time-text")
var minWaitTextEl = document.getElementById("min-wait-time-text")
var controlButtonEl = document.getElementById("control-button")

function storeGet(name, defaultValue) {
  var val = store.get(name)
  if (!val && defaultValue) {
    return defaultValue
  }
  return val
}

function storeSet(name, value) {
  store.set(name, value)
}

function getUrls() {
  var urlList = storeGet("urls", ["https://google.com"])
  return urlList
}

function getRandomUrl() {
  var urls = getUrls()
  var randI = Math.floor(Math.random() * urls.length)
  return urls[randI]
}

function getMaxWaitTime() {
  return storeGet("maxWaitTime", 50);
}

function getMinWaitTime() {
  return storeGet("minWaitTime", 5);
}

function getRandomWait() {
  var maxWait = getMaxWaitTime() * 1000
  var minWait = getMinWaitTime() * 1000
  return Math.floor(Math.random() * (maxWait - minWait)) + minWait
}

function toggle() {
  if (isActive) stop()
  else start()
}

function stop() {
  isActive = false
  controlButtonEl.innerHTML = '<i class="material-icons">play_arrow</i>'
}

function start() {
  isActive = true
  clearTimeout(loopTimer)
  loopTimer = setInterval(function() { mainLoop() }, 100)
  controlButtonEl.innerHTML = '<i class="material-icons">pause</i>'
}

function doHit(url) {
  currentUrl = url
  browserEl.src = url
}

function populatUi() {
  urlTextEl.value = getUrls().join("\n")
  maxWaitTextEl.value = getMaxWaitTime()
  minWaitTextEl.value = getMinWaitTime()
}

function saveMaxWaitTime() {
  var maxWait = parseInt(maxWaitTextEl.value)
  if (maxWait <= getMinWaitTime()) {
    maxWait = getMinWaitTime() + 1
    maxWaitTextEl.value = maxWait
  }
  else if (maxWait > 300) {
    maxWait = 300
    maxWaitTextEl.value = maxWait
  }
  storeSet("maxWaitTime", maxWait)
}

function saveMinWaitTime() {
  var minWait = parseInt(minWaitTextEl.value)
  if (minWait < 1) {
    minWait = 1
    minWaitTextEl.value = minWait
  }
  else if (minWait >= getMaxWaitTime()) {
    minWait = getMaxWaitTime() - 1
    minWaitTextEl.value = minWait
  }
  storeSet("minWaitTime", minWait)
}

function saveUrlText() {
  var urls = urlTextEl.value.split("\n")
  var newUrls = []
  for (var i=0; i<urls.length; i++) {
    if (urls[i].length) newUrls.push(urls[i].trim())
  }
  storeSet("urls", newUrls)
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
  cpEl.innerText = currentUrl
  nhEl.innerText = (Math.round(nextHitTime / 100) * 10) / 100
  // Hack for crashing webviews in Electron
  var tab = document.querySelector(".is-active")
  if (tab.id === "browser-link") {
    browserEl.style.zIndex = 10
  } else {
    browserEl.style.zIndex = -10
  }
}

window.onload = function() {
  populatUi()
}