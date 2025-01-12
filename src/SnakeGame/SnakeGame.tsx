import React from 'react';
import './SnakeGame.css';
import GameOver from './GameOver';

interface SnakePart {
  Xpos: number;
  Ypos: number;
}

interface Apple {
  Xpos: number;
  Ypos: number;
}

interface SnakeGameProps {
  snakeColor?: string;
  appleColor?: string;
  percentageWidth?: number;
  startSnakeSize?: number;
}

interface SnakeGameState {
  width: number;
  height: number;
  blockWidth: number;
  blockHeight: number;
  gameLoopTimeout: number;
  timeoutId: number;
  startSnakeSize: number;
  snake: SnakePart[];
  apple: Apple;
  direction: 'left' | 'up' | 'right' | 'down';
  directionChanged: boolean;
  isGameOver: boolean;
  snakeColor: string;
  appleColor: string;
  score: number;
  highScore: number;
  newHighScore: boolean;
  speed: number; // Adiciona a velocidade ao estado
}

class SnakeGame extends React.Component<SnakeGameProps, SnakeGameState> {
  constructor(props: SnakeGameProps) {
    super(props);

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleSpeedChange = this.handleSpeedChange.bind(this);

    this.state = {
      width: 0,
      height: 0,
      blockWidth: 0,
      blockHeight: 0,
      gameLoopTimeout: 50,
      timeoutId: 0,
      startSnakeSize: this.props.startSnakeSize || 6,
      snake: [],
      apple: { Xpos: 0, Ypos: 0 },
      direction: 'right',
      directionChanged: false,
      isGameOver: false,
      snakeColor: this.props.snakeColor || this.getRandomColor(),
      appleColor: this.props.appleColor || this.getRandomColor(),
      score: 0,
      highScore: Number(localStorage.getItem('snakeHighScore')) || 0,
      newHighScore: false,
      speed: 0.25, // Inicialmente define a velocidade
    };
  }

  componentDidMount() {
    this.initGame();
    window.addEventListener('keydown', this.handleKeyDown);
    this.gameLoop();
  }

  componentWillUnmount() {
    clearTimeout(this.state.timeoutId);
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  initGame() {
    const percentageWidth = this.props.percentageWidth || 40;
    let width = document.getElementById('GameBoard')?.parentElement?.offsetWidth || 0;
    width *= (percentageWidth / 100);
    width -= width % 30;
    if (width < 30) width = 30;
    const height = (width / 3) * 2;
    const blockWidth = width / 30;
    const blockHeight = height / 20;

    const snake: SnakePart[] = [];
    let Xpos = width / 2;
    let Ypos = height / 2;
    snake.push({ Xpos, Ypos });

    for (let i = 1; i < this.state.startSnakeSize; i++) {
      Xpos -= blockWidth;
      snake.push({ Xpos, Ypos });
    }

    let appleXpos = Math.floor(Math.random() * ((width - blockWidth) / blockWidth + 1)) * blockWidth;
    let appleYpos = Math.floor(Math.random() * ((height - blockHeight) / blockHeight + 1)) * blockHeight;
    while (appleYpos === snake[0].Ypos) {
      appleYpos = Math.floor(Math.random() * ((height - blockHeight) / blockHeight + 1)) * blockHeight;
    }

    this.setState({
      width,
      height,
      blockWidth,
      blockHeight,
      snake,
      apple: { Xpos: appleXpos, Ypos: appleYpos },
    });
  }

  gameLoop() {
    const timeoutId = window.setTimeout(() => {
      if (!this.state.isGameOver) {
        this.moveSnake();
        this.tryToEatSnake();
        this.tryToEatApple();
        this.setState({ directionChanged: false });
      }

      this.gameLoop();
    }, this.state.gameLoopTimeout / this.state.speed); // Ajusta o tempo com base na velocidade

    this.setState({ timeoutId });
  }

  resetGame() {
    const { width, height, blockWidth, blockHeight, startSnakeSize } = this.state;

    const snake: SnakePart[] = [];
    let Xpos = width / 2;
    let Ypos = height / 2;
    snake.push({ Xpos, Ypos });

    for (let i = 1; i < startSnakeSize; i++) {
      Xpos -= blockWidth;
      snake.push({ Xpos, Ypos });
    }

    let appleXpos = Math.floor(Math.random() * ((width - blockWidth) / blockWidth + 1)) * blockWidth;
    let appleYpos = Math.floor(Math.random() * ((height - blockHeight) / blockHeight + 1)) * blockHeight;
    while (this.isAppleOnSnake(appleXpos, appleYpos)) {
      appleXpos = Math.floor(Math.random() * ((width - blockWidth) / blockWidth + 1)) * blockWidth;
      appleYpos = Math.floor(Math.random() * ((height - blockHeight) / blockHeight + 1)) * blockHeight;
    }

    this.setState({
      snake,
      apple: { Xpos: appleXpos, Ypos: appleYpos },
      direction: 'right',
      directionChanged: false,
      isGameOver: false,
      gameLoopTimeout: 50,
      snakeColor: this.getRandomColor(),
      appleColor: this.getRandomColor(),
      score: 0,
      newHighScore: false,
      speed: 1, // Reseta a velocidade para o valor inicial
    });
  }

  getRandomColor(): string {
    const hexa = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += hexa[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  moveSnake() {
    const { snake } = this.state;
    let previousPartX = snake[0].Xpos;
    let previousPartY = snake[0].Ypos;
    let tmpPartX = previousPartX;
    let tmpPartY = previousPartY;

    this.moveHead();
    for (let i = 1; i < snake.length; i++) {
      tmpPartX = snake[i].Xpos;
      tmpPartY = snake[i].Ypos;
      snake[i].Xpos = previousPartX;
      snake[i].Ypos = previousPartY;
      previousPartX = tmpPartX;
      previousPartY = tmpPartY;
    }
    this.setState({ snake });
  }

  tryToEatApple() {
    const { snake, apple, width, height, blockWidth, blockHeight } = this.state;

    if (snake[0].Xpos === apple.Xpos && snake[0].Ypos === apple.Ypos) {
      const newTail: SnakePart = { Xpos: apple.Xpos, Ypos: apple.Ypos };
      let highScore = this.state.highScore;
      let newHighScore = this.state.newHighScore;
      let gameLoopTimeout = this.state.gameLoopTimeout;

      snake.push(newTail);

      //! Setar aqui nova speed

      apple.Xpos = Math.floor(Math.random() * ((width - blockWidth) / blockWidth + 1)) * blockWidth;
      apple.Ypos = Math.floor(Math.random() * ((height - blockHeight) / blockHeight + 1)) * blockHeight;
      while (this.isAppleOnSnake(apple.Xpos, apple.Ypos)) {
        apple.Xpos = Math.floor(Math.random() * ((width - blockWidth) / blockWidth + 1)) * blockWidth;
        apple.Ypos = Math.floor(Math.random() * ((height - blockHeight) / blockHeight + 1)) * blockHeight;
      }

      if (this.state.score === highScore) {
        highScore++;
        localStorage.setItem('snakeHighScore', highScore.toString());
        newHighScore = true;
      }

      if (gameLoopTimeout > 25) gameLoopTimeout -= 0.5;

      this.setState({
        snake,
        apple,
        score: this.state.score + 1,
        highScore,
        newHighScore,
        gameLoopTimeout,
      });
    }
  }

  tryToEatSnake() {
    const { snake } = this.state;

    for (let i = 1; i < snake.length; i++) {
      if (snake[0].Xpos === snake[i].Xpos && snake[0].Ypos === snake[i].Ypos) {
        this.setState({ isGameOver: true });
        break;
      }
    }
  }
  isAppleOnSnake(appleXpos: number, appleYpos: number): boolean {
    const { snake } = this.state;
    for (const part of snake) {
        if (appleXpos === part.Xpos && appleYpos === part.Ypos) {
            return true;
        }
    }
    return false;
}
  moveHead() {
    switch (this.state.direction) {
      case 'left':
        this.moveHeadLeft();
        break;
      case 'up':
        this.moveHeadUp();
        break;
      case 'right':
        this.moveHeadRight();
        break;
      case 'down':
        this.moveHeadDown();
        break;
    }
  }

  moveHeadLeft() {
    const { width, blockWidth, snake } = this.state;
    snake[0].Xpos = (snake[0].Xpos - blockWidth + width) % width;
    this.setState({ snake });
  }

  moveHeadUp() {
    const { height, blockHeight, snake } = this.state;
    snake[0].Ypos = (snake[0].Ypos - blockHeight + height) % height;
    this.setState({ snake });
  }

  moveHeadRight() {
    const { width, blockWidth, snake } = this.state;
    snake[0].Xpos = (snake[0].Xpos + blockWidth) % width;
    this.setState({ snake });
  }

  moveHeadDown() {
    const { height, blockHeight, snake } = this.state;
    snake[0].Ypos = (snake[0].Ypos + blockHeight) % height;
    this.setState({ snake });
  }

  handleKeyDown(e: KeyboardEvent) {
    const { direction, directionChanged } = this.state;

    if (directionChanged) return;

    switch (e.key) {
      case 'ArrowLeft':
        if (direction !== 'right') this.setState({ direction: 'left', directionChanged: true });
        break;
      case 'ArrowUp':
        if (direction !== 'down') this.setState({ direction: 'up', directionChanged: true });
        break;
      case 'ArrowRight':
        if (direction !== 'left') this.setState({ direction: 'right', directionChanged: true });
        break;
      case 'ArrowDown':
        if (direction !== 'up') this.setState({ direction: 'down', directionChanged: true });
        break;
      case ' ':
        if (this.state.isGameOver) this.resetGame();
        break;
      case '+':
        this.handleSpeedChange(1); // Aumenta a velocidade
        break;
      case '-':
        this.handleSpeedChange(-1); // Diminui a velocidade
        break;
      default:
        break;
    }
  }

  handleSpeedChange(change: number) {
    this.setState(prevState => ({
      speed: Math.max(0.1, prevState.speed + change * 0.1) // Atualiza a velocidade, mínimo 0.1
    }));
  }

  render() {
    const {
      width,
      height,
      blockWidth,
      blockHeight,
      snake,
      apple,
      snakeColor,
      appleColor,
      score,
      highScore,
      newHighScore,
      isGameOver,
    } = this.state;

    return (
      <div id="GameBoard" style={{ width, height }}>
        <svg width={width} height={height} style={{ border: '1px solid #000' }}>
          {snake.map((part, index) => (
            <rect
              key={index}
              x={part.Xpos}
              y={part.Ypos}
              width={blockWidth}
              height={blockHeight}
              fill={snakeColor}
            />
          ))}
          <rect
            x={apple.Xpos}
            y={apple.Ypos}
            width={blockWidth}
            height={blockHeight}
            fill={appleColor}
          />
        </svg>
        <div className="score">
          Score: {score}
        </div>
        <div className="high-score">
          High Score: {highScore}
        </div>
        <div className="speed">
          Speed: {this.state.speed.toFixed(1)}
        </div>
        {isGameOver && <GameOver score={score} highScore={highScore} />}
      </div>
    );
  }
}

export default SnakeGame;
