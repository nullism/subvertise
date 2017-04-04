// Persistent storage (blocking, but quick)
const ConfigStore = require("configstore")
const store = new ConfigStore("subvertise")

// variables
let isActive = false
let currentUrl = ""
let nextHitTime = 0
let loopTimer = null
let hitTimer = null
let hitCount = null

// Elements
const browserEl = document.getElementById("url-frame")
const urlTextEl = document.getElementById("url-text")
const maxWaitTextEl = document.getElementById("max-wait-time-text")
const minWaitTextEl = document.getElementById("min-wait-time-text")
const proxyTextEl = document.getElementById("proxy-text")
const controlButtonEl = document.getElementById("control-button")

// Wrapper around storage set, incase we change it.
function storeGet(name, defaultValue) {
  let val = store.get(name)
  if (!val && defaultValue) {
    return defaultValue
  }
  return val
}

// Wrapper around storage get, incase we change it.
function storeSet(name, value) {
  store.set(name, value)
}

// Return a list of URLS from user storage
// this blocks, but it's quick
function getUrls() {
  let urlList = storeGet("urls", [
    "https://google.com",
    "https://reddit.com",
    "https://facebook.com",
    "https://yahoo.com",
    "https://myspace.com",
    "https://amazon.com"
  ])
  return urlList
}

function getRandomUrl() {
  let urls = getUrls()
  let randI = Math.floor(Math.random() * urls.length)
  return urls[randI]
}

function getMaxWaitTime() {
  return storeGet("maxWaitTime", 50);
}

function getMinWaitTime() {
  return storeGet("minWaitTime", 5);
}

function getRandomWait() {
  let maxWait = getMaxWaitTime() * 1000
  let minWait = getMinWaitTime() * 1000
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
  hitCount++
}

// Called once, in window.onload
// populates UI input fields
function populatUi() {
  urlTextEl.value = getUrls().join("\n")
  maxWaitTextEl.value = getMaxWaitTime()
  minWaitTextEl.value = getMinWaitTime()
  proxyTextEl.value = storeGet("proxyString","")
}

// Save #max-wait-time-text.value to store
function saveMaxWaitTime() {
  let maxWait = parseInt(maxWaitTextEl.value)
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

// Save #min-wait-time-text.value to store
function saveMinWaitTime() {
  let minWait = parseInt(minWaitTextEl.value)
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

// Save #proxy-text.value to store
function saveProxyText() {
  let proxyString = proxyTextEl.value
  if (proxyString.trim().length) {
    storeSet("proxyString", proxyString)
  }
  else {
    storeSet("proxyString", null)
  }
}

// Save #url-text.value to store
function saveUrlText() {
  let urls = urlTextEl.value.split("\n")
  let newUrls = []
  for (let i=0; i<urls.length; i++) {
    if (urls[i].length) newUrls.push(urls[i].trim())
  }
  storeSet("urls", newUrls)
}

// Runs every 100 milliseconds
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

// Update UI elements
function updateUI() {
  let cpEl = document.getElementById("currentUrl")
  let nhEl = document.getElementById("nextHitTime")
  cpEl.innerText = currentUrl
  nhEl.innerText = (Math.round(nextHitTime / 100) * 10) / 100
  // Hack for crashing webviews in Electron
  // webviews *cannot* be both hidden and working
  let tab = document.querySelector(".is-active")
  if (tab.id === "browser-link") {
    browserEl.style.zIndex = 10
  } else {
    browserEl.style.zIndex = -10
  }
}

window.onload = function() {
  populatUi()
}