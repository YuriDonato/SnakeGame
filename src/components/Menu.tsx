import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #111;
`;

const Title = styled(motion.h1)`
  color: #69c1c4;
  font-size: 3rem;
  margin-bottom: 50px;
`;

const Button = styled(motion.button)`
  background-color: #69c1c4;
  color: #111;
  font-size: 1.5rem;
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

interface MenuProps {
  onStart: () => void;
  onCredits: () => void;
}

const Menu: React.FC<MenuProps> = ({ onStart, onCredits }) => {
  return (
    <MenuContainer>
      <Title initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        Snake Game
      </Title>
      <Button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onStart}>
        Start Game
      </Button>
      <Button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onCredits}>
        Credits
      </Button>
    </MenuContainer>
  );
};

export default Menu;
