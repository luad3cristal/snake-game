const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const score = document.querySelector(".score-value")
const finalScore = document.querySelector(".final-score > span")
const menu = document.querySelector(".menu-screen")
const buttonPlay = document.querySelector(".btn-play")

const audio = new Audio("../assets/audio.mp3")

//definindo o tamanho da cobra
const size = 30

const initialPosition = { x: 270, y: 240 }
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

//varia a cor da comida
const randomColor = () => {
  const red = randomNumber(0, 250)
  const green = randomNumber(0, 250)
  const blue = randomNumber(0, 250)

  return `rgb(${red}, ${green}, ${blue})`
}

//define a posição e a cor da comida
const food = {
  x: randomPosition(),
  y: randomPosition(),
  color: randomColor(),
}

//declara a variavel direction e loopId, sem atribuir valor algum
let direction, loopId

//desenha a comida
const drawFood = () => {
  const { x, y, color } = food

  ctx.shadowColor = color
  ctx.shadowBlur = 5
  ctx.fillStyle = color
  ctx.fillRect(x, y, size, size)
  ctx.shadowBlur = 0
}

//criando a cobra
const drawSnake = () => {
  ctx.fillStyle = "#ddd"

  //define a posição e o tamanho da cobra percorrendo toda a array
  snake.forEach((position, index) => {
    //muda a cor da cabeça da cobra
    if (index == snake.length - 1) {
      ctx.fillStyle = "white"
    }
    ctx.fillRect(position.x, position.y, size, size)
  })
}

//função pra mover a cobrinha
const moveSnake = () => {
  //se direction nao tiver valor, retorna pro inicio da função
  if (!direction) return

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
const drawGrid = () => {
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
    food.color = randomColor()
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
  }, 300)
}

//inicializa o joguinho
gameLoop()

//analisa tecla pressionada  e indica a direção a ser seguida
document.addEventListener("keydown", ({ key }) => {
  if (key == "ArrowRight" && direction != "left") {
    direction = "right"
  }

  if (key == "ArrowLeft" && direction != "right") {
    direction = "left"
  }

  if (key == "ArrowUp" && direction != "down") {
    direction = "up"
  }

  if (key == "ArrowDown" && direction != "up") {
    direction = "down"
  }
})

buttonPlay.addEventListener("click", () => {
  score.innerText = "00"
  menu.style.display = "none"
  canvas.style.filter = "none"

  snake = [initialPosition]
})
