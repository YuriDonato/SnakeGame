import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import Snake from "./Snake";
import Food from "./Food";
import HUD from "./HUD";
import GameOverScreen from "./GameOverScreen";

const Board = styled.div`
    position: relative;
    width: 400px;
    height: 400px;
    background-color: #111;
    border: 2px solid #69c1c4;
    margin: 20px auto;
`;

const GameBoard: React.FC = () => {
    const [snake, setSnake] = useState<number[][]>([
        [4, 10],
        [4, 9],
    ]);
    const [food, setFood] = useState<number[]>([10, 10]);
    const [direction, setDirection] = useState<number[]>([0, -1]);
    const [speed, setSpeed] = useState(100); // Reduzido para 100ms
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);
    const [time, setTime] = useState<number>(0);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    
    // Debounce para evitar múltiplas mudanças de direção rápidas
    const [lastDirectionChange, setLastDirectionChange] = useState<number>(0);
    const directionChangeDelay = 100; // Tempo em milissegundos entre mudanças de direção

    const moveSnake = useCallback(() => {
        if (gameOver || isPaused) return;

        const newSnake = [...snake];
        const head = [...newSnake[0]];
        head[0] += direction[0];
        head[1] += direction[1];
        newSnake.unshift(head);

        if (head[0] === food[0] && head[1] === food[1]) {
            const newFood = [
                Math.floor(Math.random() * 20),
                Math.floor(Math.random() * 20),
            ];
            setFood(newFood);
            setScore(score + 10);
        } else {
            newSnake.pop();
        }

        if (
            head[0] < 0 ||
            head[0] >= 20 ||
            head[1] < 0 ||
            head[1] >= 20 ||
            snakeCollision(newSnake)
        ) {
            setGameOver(true);
        } else {
            setSnake(newSnake);
        }
    }, [snake, gameOver, isPaused, food, score, direction]);

    const handleKeyDown = (e: KeyboardEvent) => {
        if (isPaused || gameOver) return;

        const now = Date.now();
        if (now - lastDirectionChange < directionChangeDelay) {
            return; // Ignora se a mudança de direção for muito rápida
        }

        let newDir: number[] = [...direction];

        switch (e.key) {
            case "ArrowUp":
                if (direction[0] !== 1) newDir = [-1, 0];
                break;
            case "ArrowDown":
                if (direction[0] !== -1) newDir = [1, 0];
                break;
            case "ArrowLeft":
                if (direction[1] !== 1) newDir = [0, -1];
                break;
            case "ArrowRight":
                if (direction[1] !== -1) newDir = [0, 1];
                break;
            default:
                return;
        }

        setDirection(newDir);
        setLastDirectionChange(now); // Atualiza o timestamp da última mudança de direção
    };

    const snakeCollision = (snake: number[][]) => {
        const [head, ...body] = snake;
        return body.some(
            (segment) => segment[0] === head[0] && segment[1] === head[1]
        );
    };

    const togglePauseResume = () => {
        setIsPaused(!isPaused);
    };

    const retryGame = () => {
        setSnake([
            [4, 10],
            [4, 9],
        ]);
        setFood([10, 10]);
        setDirection([0, -1]);
        setScore(0);
        setTime(0);
        setGameOver(false);
        setIsPaused(false);
    };

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);

        const gameInterval = setInterval(moveSnake, speed);
        return () => {
            clearInterval(gameInterval);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [moveSnake]);

    useEffect(() => {
        let timeInterval: NodeJS.Timeout | null = null;

        if (!gameOver && !isPaused) {
            timeInterval = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        }

        return () => {
            if (timeInterval) {
                clearInterval(timeInterval);
            }
        };
    }, [isPaused, gameOver]);

    return (
        <div style={{ position: "relative", display: "flex" }}>
            <Board>
                <Snake segments={snake} />
                <Food position={food} />
                {gameOver && (
                    <GameOverScreen
                        score={score}
                        time={time}
                        onRetry={retryGame}
                    />
                )}
            </Board>
            <HUD
                score={score}
                time={time}
                onPauseResume={togglePauseResume}
                isPaused={isPaused}
            />
        </div>
    );
};

export default GameBoard;
