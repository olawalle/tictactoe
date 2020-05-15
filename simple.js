/** @format */

/**
 * get all the squares from the DOM
 */
let a = document.getElementById('1')
let b = document.getElementById('2')
let c = document.getElementById('3')
let d = document.getElementById('4')
let e = document.getElementById('5')
let f = document.getElementById('6')
let g = document.getElementById('7')
let h = document.getElementById('8')
let i = document.getElementById('9')

/**
 * get the form holding the radio buttins
 */
let levels = document.getElementById('form')
let square = document.getElementsByClassName('square')

document.getElementsByTagName('button')[0].innerText = 'Start game'
let gameStarted = false
let whoIsplaying = 0

/**
 * set of all possible winning combinations
 */
let winningCombos = ['123', '147', '258', '369', '159', '357', '456', '789']

/**
 * svg for "O"
 */
let oh = `<?xml version="1.0" encoding="iso-8859-1"?>
<svg version="1.1" id="Layer_1" name="oh" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
<g>
	<g>
		<path d="M256,0C114.509,0,0,114.497,0,256c0,141.491,114.497,256,256,256c141.491,0,256-114.497,256-256
			C512,114.509,397.503,0,256,0z M256,477.867c-122.337,0-221.867-99.529-221.867-221.867S133.663,34.133,256,34.133
			S477.867,133.663,477.867,256S378.337,477.867,256,477.867z"/>
	</g>
</g>
</svg>
`
/**
 * svg fof "X"
 */
let ex = `<svg height="329pt" name="ex" viewBox="0 0 329.26933 329" width="329pt" xmlns="http://www.w3.org/2000/svg"><path d="m194.800781 164.769531 128.210938-128.214843c8.34375-8.339844 8.34375-21.824219 0-30.164063-8.339844-8.339844-21.824219-8.339844-30.164063 0l-128.214844 128.214844-128.210937-128.214844c-8.34375-8.339844-21.824219-8.339844-30.164063 0-8.34375 8.339844-8.34375 21.824219 0 30.164063l128.210938 128.214843-128.210938 128.214844c-8.34375 8.339844-8.34375 21.824219 0 30.164063 4.15625 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921875-2.089844 15.082031-6.25l128.210937-128.214844 128.214844 128.214844c4.160156 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921874-2.089844 15.082031-6.25 8.34375-8.339844 8.34375-21.824219 0-30.164063zm0 0"/></svg>`
let squares = [a, b, c, d, e, f, g, h, i]

/**
 * add click event listern to all 9 squares
 */
squares.forEach((square) => {
  square.innerHTML = ''
  square.addEventListener('click', () => {
    playSequence(square)
  })
})

/**
 * check for the selected game level
 * @returns 1 or 2
 */
checkLevel = () => {
  let level = parseFloat(levels.level.value)
  return level
}

/**
 * start new game
 */
startGame = () => {
  clearBoard()
  gameStarted = true
  whoIsplaying = 0
  document.getElementsByTagName('button')[0].innerText = 'Restart game'
  document.getElementsByTagName('input')[0].disabled = false
  document.getElementsByTagName('input')[1].disabled = false
}

/**
 * @input = square DOM element
 */
playSequence = (square) => {
  if (!gameStarted) return
  document.getElementsByTagName('input')[0].disabled = true
  document.getElementsByTagName('input')[1].disabled = true

  if (!square.innerHTML) {
    play(square)
    checkWinnings()
  } else {
    addDanger(square)
    return
  }
  whoIsplaying = !whoIsplaying
}

/**
 * checks for who is to play and updated the innerHTML of the clicked square
 * @input = DOM element to be playd on
 */
play = (square) => {
  whoIsplaying ? (square.innerHTML = ex) : (square.innerHTML = oh)
  let notPlayed = squares.map((s) => (!s.innerHTML ? s.id : null)).filter((s) => s)
  setTimeout(() => {
    if (whoIsplaying && gameStarted) {
      let randomIndex = Math.floor(Math.random() * notPlayed.length)
      let indexToBePlayed = parseFloat(notPlayed[randomIndex]) - 1
      let cornerPaired =
        ((squares[0].innerHTML.includes('name="oh') && squares[8].innerHTML.includes('name="oh')) ||
          (squares[2].innerHTML.includes('name="oh') && squares[6].innerHTML.includes('name="oh'))) &&
        notPlayed.length === 6

      let edge1 =
        (squares[1].innerHTML.includes('name="oh') && squares[3].innerHTML.includes('name="oh')) ||
        (squares[1].innerHTML.includes('name="oh') && squares[6].innerHTML.includes('name="oh')) ||
        (squares[2].innerHTML.includes('name="oh') && squares[3].innerHTML.includes('name="oh'))
      let edge2 =
        (squares[1].innerHTML.includes('name="oh') && squares[5].innerHTML.includes('name="oh')) ||
        (squares[1].innerHTML.includes('name="oh') && squares[8].innerHTML.includes('name="oh')) ||
        (squares[0].innerHTML.includes('name="oh') && squares[5].innerHTML.includes('name="oh'))
      let edge3 =
        (squares[7].innerHTML.includes('name="oh') && squares[3].innerHTML.includes('name="oh')) ||
        (squares[7].innerHTML.includes('name="oh') && squares[0].innerHTML.includes('name="oh')) ||
        (squares[8].innerHTML.includes('name="oh') && squares[3].innerHTML.includes('name="oh'))
      let edge4 =
        (squares[7].innerHTML.includes('name="oh') && squares[5].innerHTML.includes('name="oh')) ||
        (squares[7].innerHTML.includes('name="oh') && squares[2].innerHTML.includes('name="oh')) ||
        (squares[5].innerHTML.includes('name="oh') && squares[6].innerHTML.includes('name="oh'))
      let edgesPaired = (edge1 || edge2 || edge3 || edge4) && notPlayed.length === 6

      /**
       * check if user is using the 2 corner trick
       */
      if (edgesPaired && checkLevel() === 2) {
        let tobeplayed = edge1 ? '1' : edge2 ? '3' : edge3 ? '7' : '9'
        playSequence(document.getElementById(tobeplayed))
        return
      }

      if (cornerPaired && checkLevel() === 2) {
        let edges = ['1', '3', '5', '7']
        let rand = Math.floor(Math.random() * edges.length)
        playSequence(document.getElementById(parseFloat(edges[rand]) + 1))
        return
      }

      /**
       * check if center square is empty as its a rookie hot spot
       */
      if (!squares[4].innerHTML && checkLevel() === 2) {
        playSequence(squares[4])
        return
      }

      for (let i = 0; i < winningCombos.length; i++) {
        let res = checkStrategy(winningCombos[i].split(''))
        if (res) return false
        if (!res && i === winningCombos.length - 1) {
          checkCombo()
        }
      }

      function checkCombo() {
        for (let i = 0; i < winningCombos.length; i++) {
          let res = comCanWin(winningCombos[i].split(''))
          if (res) return false
          if (!res && i === winningCombos.length - 1 && checkLevel() === 2) {
            runCenterCheck()
          } else if (!res && i === winningCombos.length - 1 && checkLevel() !== 2) {
            playSequence(squares[indexToBePlayed])
            return false
          }
        }
      }

      function runCenterCheck() {
        let centerFilled = squares[4].innerHTML.includes('name="oh"')
        if (centerFilled) {
          let res = checkCenter()
          if (res) return false
          if (!res) {
            playSequence(squares[indexToBePlayed])
          }
        } else {
          playSequence(squares[indexToBePlayed])
        }
      }
    }
  }, 400)
}

checkCenter = () => {
  let edges = [0, 2, 6, 8]
  let freeEdge = squares
    .map((s, index) => {
      return {
        content: s.innerHTML,
        index,
      }
    })
    .filter((s, i) => {
      return edges.includes(i)
    })
    .filter((s) => s.content === '')
  if (freeEdge.length > 0) {
    playSequence(squares[freeEdge[0].index])
    return true
  }
  return false
}

comCanWin = (arr) => {
  let first = document.getElementById(`${arr[0]}`).innerHTML
  let second = document.getElementById(`${arr[1]}`).innerHTML
  let third = document.getElementById(`${arr[2]}`).innerHTML
  let firstX = first.includes('name="oh"')
  let secondX = second.includes('name="oh"')
  let thirdX = third.includes('name="oh"')
  if (firstX && secondX && !third) {
    let closeSquare = document.getElementById(`${arr[2]}`)
    playSequence(closeSquare)
    return true
  } else if (firstX && thirdX && !second) {
    let closeSquare = document.getElementById(`${arr[1]}`)
    playSequence(closeSquare)
    return true
  } else if (thirdX && secondX && !first) {
    let closeSquare = document.getElementById(`${arr[0]}`)
    playSequence(closeSquare)
    return true
  }
}

checkStrategy = (arr) => {
  let first = document.getElementById(`${arr[0]}`).innerHTML
  let second = document.getElementById(`${arr[1]}`).innerHTML
  let third = document.getElementById(`${arr[2]}`).innerHTML
  let firstO = first.includes('name="ex"')
  let secondO = second.includes('name="ex"')
  let thirdO = third.includes('name="ex"')
  if (firstO && secondO && !third) {
    playSequence(document.getElementById(`${arr[2]}`))
    return true
  } else if (firstO && thirdO && !second) {
    playSequence(document.getElementById(`${arr[1]}`))
    return true
  } else if (thirdO && secondO && !first) {
    playSequence(document.getElementById(`${arr[0]}`))
    return true
  }
  return false
}

addDanger = (square) => {
  square.classList.add('played')
  setTimeout(() => {
    square.classList.remove('played')
  }, 600)
  return
}

addWon = (square) => {
  square.classList.add('won')
  return
}

checkCompletion = () => {
  let completion = squares.map((square) => {
    return square.innerHTML !== ''
  })
  return completion.includes(false)
}

checkWinnings = () => {
  winningCombos.forEach((combo) => {
    checkO(combo.split(''))
    checkX(combo.split(''))
  })
}

checkX = (arr) => {
  let first = document.getElementById(`${arr[0]}`)
  let second = document.getElementById(`${arr[1]}`)
  let third = document.getElementById(`${arr[2]}`)
  if (first.innerHTML.includes('name="ex"') && second.innerHTML.includes('name="ex"') && third.innerHTML.includes('name="ex"')) {
    addWon(first)
    addWon(second)
    addWon(third)
    gameStarted = false
    let rand = Math.floor(Math.random() * 4) + 1
    var audio = new Audio(`./sounds/l${rand}.mp3`)
    audio.play()
  }
}

checkO = (arr) => {
  let first = document.getElementById(`${arr[0]}`)
  let second = document.getElementById(`${arr[1]}`)
  let third = document.getElementById(`${arr[2]}`)
  if (first.innerHTML.includes('name="oh"') && second.innerHTML.includes('name="oh"') && third.innerHTML.includes('name="oh"')) {
    addWon(first)
    addWon(second)
    addWon(third)
    gameStarted = false
    var audio = new Audio(`./sounds/clap.mp3`)
    audio.play()
  }
}

clearBoard = () => {
  gameStarted = true
  squares.forEach((square) => {
    square.innerHTML = ''
    square.classList.remove('won')
  })
}
