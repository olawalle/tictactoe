/** @format */

let modal = document.getElementById('modal')
let content = document.getElementById('content')
let form = document.getElementById('form')
let link = document.getElementById('link')
let share = document.getElementById('share')
let button = document.getElementById('button')
let name = ''

let url = 'http://localhost:5000/api'
let gameID = ''

modal.style.display = 'none'
form.style.display = 'block'
link.style.display = 'none'

content.classList.add('slide-in')

let loader = `
<svg width="120" height="30" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="#fff">
  <circle cx="15" cy="15" r="15">
    <animate
      attributeName="r"
      from="15"
      to="15"
      begin="0s"
      dur="0.8s"
      values="15;9;15"
      calcMode="linear"
      repeatCount="indefinite"
    />
    <animate
      attributeName="fill-opacity"
      from="1"
      to="1"
      begin="0s"
      dur="0.8s"
      values="1;.5;1"
      calcMode="linear"
      repeatCount="indefinite"
    />
  </circle>
  <circle cx="60" cy="15" r="9" fill-opacity="0.3">
    <animate attributeName="r" from="9" to="9" begin="0s" dur="0.8s" values="9;15;9" calcMode="linear" repeatCount="indefinite" />
    <animate
      attributeName="fill-opacity"
      from="0.5"
      to="0.5"
      begin="0s"
      dur="0.8s"
      values=".5;1;.5"
      calcMode="linear"
      repeatCount="indefinite"
    />
  </circle>
  <circle cx="105" cy="15" r="15">
    <animate
      attributeName="r"
      from="15"
      to="15"
      begin="0s"
      dur="0.8s"
      values="15;9;15"
      calcMode="linear"
      repeatCount="indefinite"
    />
    <animate
      attributeName="fill-opacity"
      from="1"
      to="1"
      begin="0s"
      dur="0.8s"
      values="1;.5;1"
      calcMode="linear"
      repeatCount="indefinite"
    />
  </circle>
</svg>`

openModal = () => {
  modal.style.display = 'block'
}

closeModal = () => {
  modal.style.display = 'none'
}

playComputer = () => {
  // window.location.href = `./game.html?host_game=${gameID}`
}

generateLink = () => {
  button.innerHTML = loader
  console.log(name)
  let squares = ['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((l) => {
    return {
      name: l,
      content: '',
      played: false,
    }
  })
  let data = {
    initiator: name,
    squares,
    game_done: false,
  }
  axios
    .post(url, data)
    .then((res) => {
      console.log(res)
      form.style.display = 'none'
      link.style.display = 'block'
      gameID = res.data._id
      share.innerHTML = `
      https://game.com/game.html?host_game=${gameID}
            <a href="whatsapp://send?text=${res.data.initiator} is challenging you to some exciting game of tictactoe. click http://playtic.surge.sh/?game=gbeuyrgeuyru to start your game" data-action="share/whatsapp/share"
              ><img src="./logos.svg" width="20" alt=""
            /></a>
            `
      button.innerHTML = 'generate link'
    })
    .catch((err) => {
      console.log({ err })
      button.innerHTML = 'generate link'

      form.style.display = 'none'
      link.style.display = 'block'
      share.innerHTML = `
      https://game.com/igdigiuwgeiuwgeiuwgeigiugieuwgiugewiugiu
            <a href="whatsapp://send?text=*olawalle* is challenging you to some exciting game of tictactoe. click http://playtic.surge.sh/?join_game=${gameID} to start your game" data-action="share/whatsapp/share"
              ><img src="./logos.svg" width="20" alt=""
            /></a>`
    })
}

getVal = (e) => {
  name = e.target.value
}
