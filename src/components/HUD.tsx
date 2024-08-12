import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const HUDContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 200px;
  height: 100%;
  background-color: #222;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
`;

const Stat = styled.div`
  color: #69c1c4;
  font-size: 1.2rem;
  margin: 20px 0;
`;

const PauseButton = styled(motion.button)`
  background-color: #69c1c4;
  color: #111;
  font-size: 1rem;
  padding: 10px 20px;
  margin: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #58a3a8;
  }
`;

interface HUDProps {
  score: number;
  time: number;
  onPauseResume: () => void;
  isPaused: boolean;
}

const HUD: React.FC<HUDProps> = ({ score, time, onPauseResume, isPaused }) => {
  return (
    <HUDContainer>
      <Stat>Score: {score}</Stat>
      <Stat>Time: {time}s</Stat>
      <PauseButton whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onPauseResume}>
        {isPaused ? 'Resume' : 'Pause'}
      </PauseButton>
    </HUDContainer>
  );
};

export default HUD;
