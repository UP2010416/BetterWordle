"use strict";
let guessedWords = [[]]
let evaluations = Array(30).fill("absent")
let keyEvaluations = Array(28).fill("undefined")
let space = 1;
let wordsCounter = 0;
let gameState;
let todaysWord = 'slugs';

function pageLoaded() {
    createLocalStorage()
    createBoard()
    keyboard()
    addEvaluationToKeys()
    colourKeys()
    gameStateCheck()
  }

window.addEventListener('load', pageLoaded);

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
    window.localStorage.setItem('keyEvaluations', JSON.stringify(keyEvaluations),)
  } else {
    keyEvaluations = JSON.parse(storedKeyEvaluations)
  }
  const storedGameState = window.localStorage.getItem('gameState')
  if(!storedGameState){
    window.localStorage.setItem('gameState', gameState)
  } else {
    gameState = storedGameState
  }
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
  console.log(evaluationUpdate)
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
    const interval = 450;
    currentWords.forEach((item, i) => {
      setTimeout(() => {
        const key = document.querySelector(`[data-key='${item}']`)
        const tileEvaluation = getTileEvaluation(item, i)
        const letterID = firstLetter + i;
        const tile = document.querySelector(`#square${letterID}`)
        tile.setAttribute("evaluation",tileEvaluation[1])
        key.setAttribute("evaluation",tileEvaluation[1])
        tile.classList.add("animate__flipInX")
        tile.style = `background-color:${tileEvaluation[0]};border-color:${tileEvaluation[0]}`
        key.style = `background-color:${tileEvaluation[0]};border:${tileEvaluation[0]}`
        updateEvaluationsStorage()
        updateKeyEvaluationsStorage()
      }, interval * i)
    })

    if(currentWord === todaysWord){
      setTimeout(window.alert("Congratulations!"), 2300)
      gameState = "OVER"
      updateStoredGameState()
      gameStateCheck()
    }
    if(guessedWords.length===6){
      window.alert(`Game Over, the word is ${todaysWord}`)
      gameState = "OVER"
      updateStoredGameState()
      gameStateCheck()
    }

    guessedWords.push([])
    wordsCounter++
    updateGuessedWordsStorage()
    updateWordsCounterStorage()
    updateStoredSpaceStorage()
  }) .catch(() => {
    window.alert("Inputted word is not valid!")
  })
}


/* async function validWord(inputWord){
  const payload = inputWord
  console.log(payload)
  const response = await fetch ('validword', {
    method: 'POST',
    headers: {'Content-Type': 'text/plain'},
    body: payload
  })

  if(response.ok){
    console.log("worked", response)
  } else{
    console.log("failed", response)
  }
} */

function getTileEvaluation(letter, index){
  const isCorrect = todaysWord.includes(letter)
  if(!isCorrect){
    return ["rgb(58, 58, 60)","absent"]
  }
  const isInCorrectPosition = letter === todaysWord.charAt(index)
  if(isInCorrectPosition){
    return ["rgb(83, 141, 78)","correct"]
  }

  return ["rgb(181, 159, 59)","present"]
}

function getCurrentWords(){
  return guessedWords[wordsCounter]
}

function updateWords(letter){
  const currentWords = getCurrentWords()
  console.log(currentWords)
  if(currentWords && currentWords.length < 5){
    currentWords.push(letter)

    console.log(document.querySelector(`#square${space}`))
    const availableSpace = document.querySelector(`#square${space}`)
    space = space+1
    availableSpace.textContent = letter;
  }
}

function createBoard(){
    const Board = document.querySelector("#board")
    console.log(document.querySelectorAll('.square'))
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

