import React from "react";
import { motion } from "framer-motion";
import styled from "styled-components";

const SnakeSegment = styled(motion.div)`
    width: 20px;
    height: 20px;
    background-color: #69c1c4;
    position: absolute;
`;

interface SnakeProps {
    segments: number[][];
}

const Snake: React.FC<SnakeProps> = ({ segments }) => {
    return (
        <>
            {segments.map((segment, index) => (
                <SnakeSegment
                    key={index}
                    animate={{
                        x: segment[1] * 20,
                        y: segment[0] * 20,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 500, // Tornando o movimento mais rígido e rápido
                        damping: 30, // Reduzindo o amortecimento para menos suavidade
                        mass: 0.5,
                        duration: 0.05, // Adicionando uma duração curta para suavidade
                    }}
                />
            ))}
        </>
    );
};

export default Snake;
