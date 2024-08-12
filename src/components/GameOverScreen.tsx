import React from "react";
import styled from "styled-components";

const GameOverContainer = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.8);
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    color: #69c1c4;
    z-index: 100;
`;

const Title = styled.h2`
    margin-bottom: 20px;
`;

const ScoreInfo = styled.p`
    margin: 10px 0;
`;

const RetryButton = styled.button`
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #69c1c4;
    color: #111;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;

    &:hover {
        background-color: #57a8a6;
    }
`;

interface GameOverScreenProps {
    score: number;
    time: number;
    onRetry: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({
    score,
    time,
    onRetry,
}) => {
    return (
        <GameOverContainer>
            <Title>Game Over</Title>
            <ScoreInfo>Score: {score}</ScoreInfo>
            <ScoreInfo>Time Survived: {time} seconds</ScoreInfo>
            <RetryButton onClick={onRetry}>Play Again</RetryButton>
        </GameOverContainer>
    );
};

export default GameOverScreen;
