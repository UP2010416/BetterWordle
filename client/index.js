"use strict";

let guessedWords = [[]]
let evaluations = Array(30).fill("absent")
let keyEvaluations = Array(28).fill("undefined")
let space = 1;
let wordsCounter = 0;
let gameState;
let tileEvaluation;
let todaysWord;
let dailyWordCount = 1;
let totalGames = 0;
let totalWins = 0;
let currentStreak = 0;


function pageLoaded() {
    checkForWordUpdate()
    createLocalStorage()
    createBoard()
    keyboard()
    addEvaluationToKeys()
    colourKeys()
    gameStateCheck()
    updateStats()

    // Test to see if words are updating (set time on svr.js to a smaller interval)

    /* setInterval(async function(){
      let output;
      const word = 'grids'
      const payload = { msg: word}
      console.log('Payload', payload)
      const response = await fetch('checkWord', {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(payload)
      })
      if (response.ok){
        output = await response.json()
      } else {
        output = {msg : 'failed to check word'}
      }
      console.log(output)
    }, 1000) */
  }

window.addEventListener('load', pageLoaded);

async function checkForWordUpdate(){
  const payload = { msg : dailyWordCount }
  console.log('Payload', payload)
  let output;
  const response = await fetch('checkUpdate')
  if(response.ok){
    output = await response.json()
    if(output != dailyWordCount){
      dailyWordCount = output
      updateDailyWordCountStorage()
      clearStorage()
      window.location.reload
    }
    return;
  } else {
    let output = {msg : 'failed to get new word data'}
    console.log(output)
  }
}

async function checkWord(currentWord, currentWords, firstLetter){
  let output;
  const payload = { msg: currentWord }
  console.log('Payload', payload)
  const response = await fetch('checkWord', {
    method: 'POST',
    headers: {'Content-Type' : 'application/json'},
    body: JSON.stringify(payload)
  })
  if (response.ok){
    output = await response.json()
    tileEvaluation = output
    const interval = 450;
    currentWords.forEach((item, i) => {
      setTimeout(() => {
        const key = document.querySelector(`[data-key='${item}']`)
        const letterID = firstLetter + i;
        const tile = document.querySelector(`#square${letterID}`)
        tile.setAttribute("evaluation",tileEvaluation[i][1])
        key.setAttribute("evaluation",tileEvaluation[i][1])
        tile.classList.add("animate__flipInX")
        tile.style = `background-color:${tileEvaluation[i][0]};border-color:${tileEvaluation[i][0]}`
        key.style = `background-color:${tileEvaluation[i][0]};border:${tileEvaluation[i][0]}`
        updateEvaluationsStorage()
        updateKeyEvaluationsStorage()
      }, interval * i)
    })

    console.log(tileEvaluation)
    console.log(tileEvaluation[0][1])
    if(tileEvaluation[0][1] === "correct" && tileEvaluation[1][1] === "correct" && tileEvaluation[2][1] === "correct"
      && tileEvaluation[3][1] === "correct" && tileEvaluation[4][1] === "correct"){
      setTimeout(window.alert("Congratulations!"), 2300)
      gameState = "OVER"
      showResult()
      updateStoredGameState()
      gameStateCheck()
    }

    if(guessedWords.length===6){
      getTodaysWord()
      window.alert(`Game Over, the word is ${todaysWord}`)
      gameState = "OVER"
      const stats = document.querySelector('#stats')
      stats.style.display = 'block'
      window.localStorage.setItem('currentStreak',0)
      updateStoredGameState()
      gameStateCheck()
    }

    guessedWords.push([])
    wordsCounter++
    updateGuessedWordsStorage()
    updateWordsCounterStorage()
    updateStoredSpaceStorage()
  } else {
    output = {msg : 'failed to check word'}
    console.log(output)
  }
}

async function getTodaysWord(){
  const response = await fetch('todaysWord')
  let obj;
  let word
  if (response.ok){
    obj = await response.json()
    word = obj["word"]
    todaysWord = word;
  } else {
    obj = [{msg : "failed to load today's word"}]
  }
}

function showResult(){
  const stats = document.querySelector('#stats')
  stats.style.display = 'block'
  window.localStorage.setItem('totalWins', Number(totalWins) +1)
  window.localStorage.setItem('currentStreak', Number(currentStreak) + 1)
  window.localStorage.setItem('totalGames', Number(totalGames) +1)
}

function updateStats(){
  document.querySelector("#total-played").textContent = totalGames
  document.querySelector("#total-wins").textContent = totalWins
  document.querySelector("#current-streak").textContent = currentStreak;

  const winPercentage = Math.round((totalWins / totalGames) * 100) || 0;
  document.querySelector("#win-percentage").textContent = winPercentage
}

function keyboard(){
  const keys = document.querySelectorAll('.keyboard-row button')
  for (let i = 0; i < keys.length; i++){
    keys[i].onclick = ({ target }) => {
      const key = target.getAttribute("data-key")
      console.log(key)
      if(key==='enter'){
        submitWord()
        return;
      }
      if(key==='backspace'){
        deleteLetter()
        return;
      }
      updateWords(key)

    }
  }
}

function createLocalStorage(){
  const storedGuessedWords = window.localStorage.getItem('guessedWords')
  if(!storedGuessedWords){
    window.localStorage.setItem('guessedWords', JSON.stringify(guessedWords))
  } else {
    guessedWords = JSON.parse(storedGuessedWords)
  }
  const storedEvaluations = window.localStorage.getItem('evaluations')
  if(!storedEvaluations){
    window.localStorage.setItem('evaluations', JSON.stringify(evaluations))
  } else {
    evaluations = JSON.parse(storedEvaluations)
  }
  const storedWordsCounter = window.localStorage.getItem('wordsCounter')
  if(!storedWordsCounter){
    window.localStorage.setItem('wordsCounter', wordsCounter)
  } else {
    wordsCounter = Number(storedWordsCounter)
  }
  const storedSpace = window.localStorage.getItem('space')
  if(!storedSpace){
    window.localStorage.setItem('space', space)
  } else {
    space = Number(storedSpace)
  }
  const storedKeyEvaluations = window.localStorage.getItem('keyEvaluations')
  if(!storedKeyEvaluations){
    window.localStorage.setItem('keyEvaluations', JSON.stringify(keyEvaluations))
  } else {
    keyEvaluations = JSON.parse(storedKeyEvaluations)
  }
  const storedGameState = window.localStorage.getItem('gameState')
  if(!storedGameState){
    window.localStorage.setItem('gameState', gameState)
  } else {
    gameState = storedGameState
  }
  const storedDailyWordCount = window.localStorage.getItem('dailyWordCount')
  if(!storedDailyWordCount){
    window.localStorage.setItem('dailyWordCount', dailyWordCount)
  } else {
    dailyWordCount = storedDailyWordCount
  }
  const storedTotalGames = window.localStorage.getItem('totalGames')
  if(!storedTotalGames){
    window.localStorage.setItem('totalGames', totalGames)
  } else {
    totalGames = storedTotalGames
  }
  const storedTotalWins = window.localStorage.getItem('totalWins')
  if(!storedTotalWins){
    window.localStorage.setItem('totalWins', totalWins)
  } else {
    totalWins = storedTotalWins
  }
  const storedCurrentStreak = window.localStorage.getItem('currentStreak')
  if(!storedCurrentStreak){
    window.localStorage.setItem('currentStreak', currentStreak)
  } else {
    currentStreak = storedCurrentStreak
  }
}

function clearStorage(){
  window.localStorage.removeItem('guessedWords')
  window.localStorage.removeItem('evaluations')
  window.localStorage.removeItem('wordsCounter')
  window.localStorage.removeItem('space')
  window.localStorage.removeItem('keyEvaluations')
  window.localStorage.removeItem('gameState')
}

function updateDailyWordCountStorage(){
  window.localStorage.setItem('dailyWordCount', JSON.stringify(dailyWordCount))
}

function updateGuessedWordsStorage(){
  window.localStorage.setItem('guessedWords', JSON.stringify(guessedWords))
}

function updateEvaluationsStorage(){
  const squares = document.querySelectorAll('.square')
  const evaluationUpdate = []
  for(let i=0;i<squares.length;i++){
    evaluationUpdate.push(squares[i].getAttribute("evaluation"))
  }
  window.localStorage.setItem('evaluations', JSON.stringify(evaluationUpdate))
}

function updateKeyEvaluationsStorage(){
  const keys = document.querySelectorAll('.keyboard-row button')
  const keyEvaluationUpdate = []
  for(let i=0;i<keys.length;i++){
    keyEvaluationUpdate.push(keys[i].getAttribute("evaluation"))
  }
  window.localStorage.setItem('keyEvaluations', JSON.stringify(keyEvaluationUpdate))
}

function updateWordsCounterStorage(){
  window.localStorage.setItem('wordsCounter', wordsCounter)
}

function updateStoredSpaceStorage(){
  window.localStorage.setItem('space',space)
}

function updateStoredGameState(){
  window.localStorage.setItem('gameState',gameState)
}

function deleteLetter(){
  if (guessedWords[wordsCounter].length === 0){
    return;
  }
  const availableSpace = document.querySelector(`#square${space-1}`)
  const currentWords = getCurrentWords()
  availableSpace.textContent = ''
  space = space - 1
  currentWords.pop()

}

async function submitWord(){
  const firstLetter= (wordsCounter * 5) + 1
  const currentWords = getCurrentWords()
  const currentWord = currentWords.join("")
  if(currentWords.length !== 5){
    window.alert('Word must be 5 letters')
    return;
  }

  fetch(
    `https://dictionary-dot-sse-2020.nw.r.appspot.com/${currentWord}`,
    {
      method: "GET",
    }
  ).then((res) => {
    if(!res.ok){
      throw Error()
    }

    checkWord(currentWord, currentWords, firstLetter)

  }) .catch(() => {
    window.alert("Inputted word is not valid!")
  })
}

function getCurrentWords(){
  return guessedWords[wordsCounter]
}

function updateWords(letter){
  const currentWords = getCurrentWords()
  console.log(currentWords)
  if(currentWords && currentWords.length < 5){
    currentWords.push(letter)
    const availableSpace = document.querySelector(`#square${space}`)
    space = space+1
    availableSpace.textContent = letter;
  }
}

function createBoard(){
    const Board = document.querySelector("#board")
    for (let i=0;i<30;i++){
      let square = document.createElement("div")
      square.classList.add("square")
      square.setAttribute("evaluation",evaluations[i])
      square.classList.add("animate__animated");
      square.setAttribute("id",`square${i+1}`)
      Board.appendChild(square);
    }
    colourSquares()
    populateSquares()
}

function colourSquares(){
  const squares = document.querySelectorAll('.square')
  for (let i=0;i<squares.length;i++){
    const square = squares[i]
    const evaluation = square.getAttribute("evaluation")
    if(evaluation === "correct"){
      const tileColour="rgb(83, 141, 78)"
      square.style=`background-color:${tileColour};border-color:${tileColour}`
    } else if (evaluation === "present"){
      const tileColour="rgb(181, 159, 59)"
      square.style=`background-color:${tileColour};border-color:${tileColour}`
    } else {
      const tileColour="rgb(58, 58, 60)"
      square.style=`background-color:${tileColour};border-color:${tileColour}`
    }
  }
}

function addEvaluationToKeys(){
  const keys = document.querySelectorAll('.keyboard-row button')
  for (let i=0;i<keys.length;i++){
    keys[i].setAttribute("evaluation", keyEvaluations[i])
  }
}

function colourKeys(){
  const keys = document.querySelectorAll('.keyboard-row button')
  for(let i = 0;i<keys.length;i++){
    const key = keys[i]
    const evaluation = key.getAttribute('evaluation')
    if(evaluation === "correct"){
      const keyColour="rgb(83, 141, 78)"
      key.style=`background-color:${keyColour};border-color:${keyColour}`
    } else if (evaluation === "present"){
      const keyColour="rgb(181, 159, 59)"
      key.style=`background-color:${keyColour};border-color:${keyColour}`
    } else if (evaluation === "absent"){
      const keyColour="rgb(58, 58, 60)"
      key.style=`background-color:${keyColour};border-color:${keyColour}`
    }
  }
}

function populateSquares(){
  const squares = document.querySelectorAll('.square')
  for(let i=0;i<6;i++){
    const word = guessedWords[i]
    if(word === undefined){
      return;
    }
    for(let j=0;j<5;j++){
      squares[(i*5)+j].textContent = word[j]
    }
  }
}

function gameStateCheck(){
  if(gameState === "OVER"){
    const keys = document.querySelectorAll('.keyboard-row button')
    for(let i=0;i<keys.length;i++){
      keys[i].disabled = true
    }
  }
}


