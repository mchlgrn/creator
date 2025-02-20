import React, { useState } from "react";

const AbilityScores = ({ raceBonus, onScoresSelected }) => {
    const [method, setMethod] = useState("standard"); // Default method
    const [scores, setScores] = useState([15, 14, 13, 12, 10, 8]); // Default standard array

    // Roll 4d6, drop the lowest
    const rollForStats = () => {
        const rollStat = () => {
            let rolls = [1, 2, 3, 4].map(() => Math.floor(Math.random() * 6) + 1);
            rolls.sort((a, b) => a - b); // Sort to drop the lowest
            return rolls.slice(1).reduce((a, b) => a + b, 0);
        };
        setScores([rollStat(), rollStat(), rollStat(), rollStat(), rollStat(), rollStat()]);
    };

    // Handle point buy (not fully implemented yet)
    const handlePointBuy = () => {
        alert("Point buy system coming soon!");
    };

    // Apply racial bonuses
    const getFinalScores = () => {
        return scores.map((score, index) => score + (raceBonus[index] || 0));
    };

    return (
        <div>
            <h2>Select Ability Score Generation Method</h2>
            <select onChange={(e) => setMethod(e.target.value)}>
                <option value="standard">Standard Array</option>
                <option value="roll">Roll for Stats</option>
                <option value="pointbuy">Point Buy (Coming Soon)</option>
            </select>

            {method === "roll" && <button onClick={rollForStats}>Roll Stats</button>}
            {method === "pointbuy" && <button onClick={handlePointBuy}>Use Point Buy</button>}

            <h3>Ability Scores</h3>
            <ul>
                {getFinalScores().map((score, i) => (
                    <li key={i}>Score {i + 1}: {score}</li>
                ))}
            </ul>

            <button onClick={() => onScoresSelected(getFinalScores())}>Confirm Scores</button>
        </div>
    );
};

export default AbilityScores;
