import React, { useState } from "react";
import Menu from "./components/Menu";
import GameBoard from "./components/GameBoard";
import GlobalStyles from "./styles/GlobalStyles";

const App: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [showCredits, setShowCredits] = useState(false);

    const startGame = () => {
        setIsPlaying(true);
        setShowCredits(false);
    };

    const showCreditsScreen = () => {
        setShowCredits(true);
    };

    const handleGameOver = () => {
        setIsPlaying(false);
    };

    return (
        <>
            <GlobalStyles />
            {!isPlaying && !showCredits && (
                <Menu onStart={startGame} onCredits={showCreditsScreen} />
            )}
            {isPlaying && <GameBoard />}
            {showCredits && <div>Credits Screen</div>}{" "}
            {/* Placeholder for Credits */}
        </>
    );
};

export default App;
