/** @format */

const socket = io('http://localhost:500')
let splitURL = window.location.search.split('=')
let gameID = splitURL[1] || null
console.log(splitURL[0])

socket.on('connection', () => {
  console.log('socket connected')
  gameID && socket.join(gameID)
})

socket.on('news', (data) => console.log('news', data))
socket.on('played', (data) => {})

socket.on('commence_game', (data) => {
  currentGame = data
  gameStarted = true
  who.innerHTML = whoIsplaying ? 'Your turn' : 'Wait for player 2'
})

socket.on('play_on', (data) => {
  data.squares.forEach((sq, i) => {
    if (sq.content === 'x') {
      squares[i].innerHTML = ex
    }
    if (sq.content === 'o') {
      squares[i].innerHTML = oh
    }
  })
  playSequence(null)
  gameStarted = true
  who.innerHTML = 'Your turn'
})

let a = document.getElementById('1')
let b = document.getElementById('2')
let c = document.getElementById('3')
let d = document.getElementById('4')
let e = document.getElementById('5')
let f = document.getElementById('6')
let g = document.getElementById('7')
let h = document.getElementById('8')
let i = document.getElementById('9')
let who = document.getElementById('who')

let square = document.getElementsByClassName('square')
let gameStarted = false
let whoIsplaying = 0
let winningCombos = ['123', '147', '258', '369', '159', '357', '456', '789']
let currentGame = ''

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

let ex = `<svg height="329pt" name="ex" viewBox="0 0 329.26933 329" width="329pt" xmlns="http://www.w3.org/2000/svg"><path d="m194.800781 164.769531 128.210938-128.214843c8.34375-8.339844 8.34375-21.824219 0-30.164063-8.339844-8.339844-21.824219-8.339844-30.164063 0l-128.214844 128.214844-128.210937-128.214844c-8.34375-8.339844-21.824219-8.339844-30.164063 0-8.34375 8.339844-8.34375 21.824219 0 30.164063l128.210938 128.214843-128.210938 128.214844c-8.34375 8.339844-8.34375 21.824219 0 30.164063 4.15625 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921875-2.089844 15.082031-6.25l128.210937-128.214844 128.214844 128.214844c4.160156 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921874-2.089844 15.082031-6.25 8.34375-8.339844 8.34375-21.824219 0-30.164063zm0 0"/></svg>`
let squares = [a, b, c, d, e, f, g, h, i]

squares.forEach((square) => {
  square.innerHTML = ''
  square.addEventListener('click', () => {
    playSequence(square)
  })
})

startGame = () => {
  clearBoard()
  gameStarted = true
  socket.emit('start_game')
  whoIsplaying = 1
}

playSequence = (square) => {
  if (square) {
    if (!gameStarted) return

    if (!square.innerHTML) {
      play(square)
      socket.emit('play_square', {
        id: currentGame._id,
        squares: squares.map((s) => {
          let content = s.innerHTML === '' ? '' : s.innerHTML.includes('name="ex"') ? 'x' : 'o'
          return {
            name: s.id,
            content,
            played: content ? true : false,
          }
        }),
      })
    } else {
      addDanger(square)
      return
    }
    gameStarted = false
    who.innerHTML = `Wait for player ${whoIsplaying + 1}`
  }
  //   whoIsplaying = !whoIsplaying
  checkWinnings()
  if (!checkCompletion()) who.innerHTML = 'Game over'
}

play = (square) => {
  whoIsplaying ? (square.innerHTML = ex) : (square.innerHTML = oh)
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
    alertWinner(0)
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
    alertWinner(1)
  }
}

alertWinner = (n) => {
  console.log('alerting winner')
  if (n === 0 && whoIsplaying === 1) who.innerHTML = 'You won!!!'
  if (n === 1 && whoIsplaying === 0) who.innerHTML = 'Eeyah! Them beat you sha'
  if (n === 0 && whoIsplaying === 0) who.innerHTML = 'Eeyah! them beat you sha'
  if (n === 1 && whoIsplaying === 0) who.innerHTML = 'You won!!!'
}

clearBoard = () => {
  gameStarted = true
  squares.forEach((square) => {
    square.innerHTML = ''
    square.classList.remove('won')
  })
}
