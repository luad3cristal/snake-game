// canvas do computador
const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const score = document.querySelector(".score-value")
const finalScore = document.querySelector(".final-score > span")
const menu = document.querySelector(".menu-screen")
const buttonPlay = document.querySelector(".btn-play")

const b1 = document.querySelector(".b1")
const b2 = document.querySelector(".b2")
const b3 = document.querySelector(".b3")
const level = document.querySelector(".start-menu")
const points = document.querySelector(".score")

const audio = new Audio("../assets/audio.mp3")

//definindo o tamanho da cobra
const size = 30

const initialPosition = { x: 60, y: 60 }
//definindo a posição a partir da array com numeros multiplos de 30
let snake = [initialPosition]

//soma a pontuação ao score
const incrementScore = () => {
  score.innerText = +score.innerText + 1
}

//gerando o numero para definir a posição da comida
const randomNumber = (min, max) => {
  return Math.round(Math.random() * (max - min) + min)
}

//define a posição da comida
const randomPosition = () => {
  const number = randomNumber(0, canvas.width - size)
  return Math.round(number / 30) * 30
}

//define a posição da comida
const food = {
  x: randomPosition(),
  y: randomPosition(),
}

//declara a variavel direction e loopId, sem atribuir valor algum
let direction, loopId, speed

//desenha a comida
const drawFood = () => {
  const { x, y } = food

  ctx.shadowColor = "red"
  ctx.shadowBlur = 5
  ctx.fillStyle = "red"
  ctx.fillRect(x, y, size, size)
  ctx.shadowBlur = 0
}

//criando a cobra
const drawSnake = () => {
  ctx.fillStyle = "#39e75f"

  //define a posição e o tamanho da cobra percorrendo toda a array
  snake.forEach((position, index) => {
    //muda a cor da cabeça da cobra
    if (index == snake.length - 1) {
      ctx.fillStyle = "#83f28f"
    }
    ctx.fillRect(position.x, position.y, size, size)
  })
}

//função pra mover a cobrinha
const moveSnake = () => {
  //se direction nao tiver valor, retorna pro inicio da função
  if (!direction) return

  //se speed não tiver valor, retorna
  if (!speed) return

  //pega o ultimo valor da cobra, no caso a cabeça. snake.at(-1) também funciona
  const head = snake[snake.length - 1]

  if (direction == "right") {
    //adicionar o valor de acordo com o direction
    snake.push({ x: head.x + size, y: head.y })
  }

  if (direction == "left") {
    //adicionar o valor de acordo com o direction
    snake.push({ x: head.x - size, y: head.y })
  }

  if (direction == "up") {
    //adicionar o valor de acordo com o direction
    snake.push({ x: head.x, y: head.y - size })
  }

  if (direction == "down") {
    //adicionar o valor de acordo com o direction
    snake.push({ x: head.x, y: head.y + size })
  }

  //remove o valor do corpo
  snake.shift()
}

//desenha linhas no joguinho
let drawGrid = () => {
  ctx.lineWidth = 1
  ctx.strokeStyle = "#191919"

  for (let i = 30; i < canvas.width; i = i + 30) {
    //cria as linhas na vertical
    ctx.beginPath()
    ctx.lineTo(i, 0)
    ctx.lineTo(i, 600)
    ctx.stroke()

    ctx.beginPath()
    ctx.lineTo(0, i)
    ctx.lineTo(600, i)
    ctx.stroke()
  }
}

//identifica se a cobra comeu a comida
const checkEat = () => {
  const head = snake[snake.length - 1]

  //se a posição da cabeça for a mesma da comida
  if (head.x == food.x && head.y == food.y) {
    //comeu -> incrementa o score
    incrementScore()

    //adiciona um valor a onde a comida estava
    snake.push(head)

    //toca o barulho pra quando a cobra comer
    audio.play()

    //pega um valor de x e y
    let x = randomPosition()
    let y = randomPosition()

    // se o x e o y for igual ao da cobra, gera um novo
    while (snake.find((position) => position.x == x && position.y == y)) {
      x = randomPosition()
      y = randomPosition()
    }

    //se não, segue a comida assume esse valor
    food.x = x
    food.y = y
  }
}

//checa colisão
const checkCollision = () => {
  const head = snake[snake.length - 1]
  const canvasLimit = canvas.width - size

  const neckIndex = snake.length - 2

  //colisão com a parede
  const wallCollision =
    head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit

  //colisão com o corpo
  const selfCollision = snake.find((position, index) => {
    return index < neckIndex && position.x == head.x && position.y == head.y
  })

  if (wallCollision || selfCollision) {
    gameOver()
  }
}

//define o game over
const gameOver = () => {
  direction = undefined
  speed = undefined

  menu.style.display = "flex"
  finalScore.innerText = score.innerText
  canvas.style.filter = "blur(4px)"
}

//define o loop em que o jogo vai ocorrer
const gameLoop = () => {
  //reseta o código do loopId
  clearInterval(loopId)

  //reseta a cobrinha
  ctx.clearRect(0, 0, 600, 600)

  //desenha as linhas sem resetar
  drawGrid()
  //chama a comida
  drawFood()
  //faz ela se mover e desenha ela de acordo com o movimento
  moveSnake()
  drawSnake()
  //checa se a cobra comeu
  checkEat()

  //checa se colidiu
  checkCollision()

  //cria um loop executando a função com um time de 0.3s. A ideia do loopId é resetar o codigo e evitar bugs
  loopId = setTimeout(() => {
    gameLoop()
  }, speed)
}

//inicializa o joguinho
gameLoop()

//analisa tecla pressionada  e indica a direção a ser seguida
document.addEventListener("keydown", ({ key }) => {
  if (
    (key == "ArrowRight" || key == "d" || key == "D") &&
    direction != "left"
  ) {
    direction = "right"
  }

  if (
    (key == "ArrowLeft" || key == "a" || key == "A") &&
    direction != "right"
  ) {
    direction = "left"
  }

  if ((key == "ArrowUp" || key == "w" || key == "W") && direction != "down") {
    direction = "up"
  }

  if ((key == "ArrowDown" || key == "s" || key == "S") && direction != "up") {
    direction = "down"
  }
})

buttonPlay.addEventListener("click", () => {
  score.innerText = "00"
  points.style.visibility = "hidden"

  menu.style.display = "none"
  level.style.display = "flex"

  snake = [initialPosition]
  food.x = randomPosition()
  food.y = randomPosition()
})

b1.addEventListener("click", () => {
  points.style.visibility = "visible"

  level.style.display = "none"
  canvas.style.filter = "none"

  speed = 550
  direction = "right"
})

b2.addEventListener("click", () => {
  points.style.visibility = "visible"

  level.style.display = "none"
  canvas.style.filter = "none"

  speed = 400
  direction = "right"
})

b3.addEventListener("click", () => {
  points.style.visibility = "visible"

  level.style.display = "none"
  canvas.style.filter = "none"

  speed = 200
  direction = "right"
})

//reconhecendo touch
document.addEventListener("touchstart", handleTouchStart, false)
document.addEventListener("touchmove", handleTouchMove, false)

var xDown = null
var yDown = null

function getTouches(evt) {
  return (
    evt.touches || // browser API
    evt.originalEvent.touches
  ) // jQuery
}

function handleTouchStart(evt) {
  const firstTouch = getTouches(evt)[0]
  xDown = firstTouch.clientX
  yDown = firstTouch.clientY
}

function handleTouchMove(evt) {
  if (!xDown || !yDown) {
    return
  }

  var xUp = evt.touches[0].clientX
  var yUp = evt.touches[0].clientY

  var xDiff = xDown - xUp
  var yDiff = yDown - yUp

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    /*most significant*/
    if (xDiff > 0) {
      direction = "left"
      /* right swipe */
    } else {
      direction = "right"
      /* left swipe */
    }
  } else {
    if (yDiff > 0) {
      /* down swipe */
      direction = "up"
    } else {
      /* up swipe */
      direction = "down"
    }
  }
  /* reset values */
  xDown = null
  yDown = null
}

const width = screen.width

if (screen.width <= 426) {
  drawGrid = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = "#191919"

    for (let i = 30; i < canvas.width; i = i + 30) {
      //cria as linhas na vertical
      ctx.beginPath()
      ctx.lineTo(i, 0)
      ctx.lineTo(i, 600)
      ctx.stroke()

      ctx.beginPath()
      ctx.lineTo(0, i)
      ctx.lineTo(600, i)
      ctx.stroke()
    }
  }
}
