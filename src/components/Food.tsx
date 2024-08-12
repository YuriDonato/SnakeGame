import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const FoodItem = styled(motion.div)`
  position: absolute;
  width: 20px;
  height: 20px;
  background-color: #f00;
`;

interface FoodProps {
  position: number[];
}

const Food: React.FC<FoodProps> = ({ position }) => {
  return (
    <FoodItem
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.2 }}
      style={{
        top: `${position[0] * 20}px`,
        left: `${position[1] * 20}px`,
      }}
    />
  );
};

export default Food;
