import React, { useState, useEffect } from "react";
import Button from "./components/ui/button";

const DnDCharacterBuilder = () => {
  const [step, setStep] = useState(1);
  const [character, setCharacter] = useState({ name: "", race: "", class: "", stats: {} });
  const [races, setRaces] = useState([]);
  const [classes, setClasses] = useState([]);
  const [raceDescription, setRaceDescription] = useState("");
  const [classDescription, setClassDescription] = useState("");
  const [classFeatures, setClassFeatures] = useState([]);
  const [statMethod, setStatMethod] = useState("standard");
  const [stats, setStats] = useState({
    Strength: null,
    Dexterity: null,
    Constitution: null,
    Intelligence: null,
    Wisdom: null,
    Charisma: null,
  });
  const [availableStats, setAvailableStats] = useState([15, 14, 13, 12, 10, 8]);

  useEffect(() => {
    fetch("https://www.dnd5eapi.co/api/races")
      .then((res) => res.json())
      .then((data) => setRaces(data.results));

    fetch("https://www.dnd5eapi.co/api/classes")
      .then((res) => res.json())
      .then((data) => setClasses(data.results));
  }, []);

  const handleRaceChange = (e) => {
    const race = e.target.value;
    setCharacter({ ...character, race });
    fetch(`https://www.dnd5eapi.co/api/races/${race}`)
      .then((res) => res.json())
      .then((data) => setRaceDescription(data.alignment || "No description available."));
  };

  const handleClassChange = (e) => {
    const cls = e.target.value;
    setCharacter({ ...character, class: cls });
    fetch(`https://www.dnd5eapi.co/api/classes/${cls}`)
      .then((res) => res.json())
      .then((data) => {
        setClassDescription(data.hit_die ? `Hit Die: d${data.hit_die}` : "No description available.");
        setClassFeatures(data.proficiencies.map(p => p.name) || []);
      });
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrev = () => setStep((prev) => Math.max(1, prev - 1));

  const rollStats = () => {
    const rollStat = () => {
      let rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
      rolls.sort((a, b) => a - b);
      return rolls.slice(1).reduce((a, b) => a + b, 0);
    };
    setStats({
      Strength: rollStat(),
      Dexterity: rollStat(),
      Constitution: rollStat(),
      Intelligence: rollStat(),
      Wisdom: rollStat(),
      Charisma: rollStat(),
    });
  };

  const handleStatSelection = (ability, value) => {
    setStats((prev) => ({ ...prev, [ability]: value }));
    setAvailableStats((prev) => prev.filter((num) => num !== value));
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-yellow-400">
        DnD Character Builder
      </h1>

      {step === 1 && (
        <div>
          <label className="block text-lg mb-2">Character Name:</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-700 bg-gray-800 rounded"
            value={character.name}
            onChange={(e) => setCharacter({ ...character, name: e.target.value })}
          />
          <Button onClick={handleNext}>Next</Button>
        </div>
      )}

      {step === 2 && (
        <div>
          <label className="block text-lg mb-2">Select Race:</label>
          <select
            className="w-full p-2 border border-gray-700 bg-gray-800 rounded"
            onChange={handleRaceChange}
            value={character.race}
          >
            <option value="">-- Select Race --</option>
            {races.map((race) => (
              <option key={race.index} value={race.index}>{race.name}</option>
            ))}
          </select>
          <p className="mt-2 text-sm text-gray-400">{raceDescription}</p>

          <label className="block text-lg mt-4 mb-2">Select Class:</label>
          <select
            className="w-full p-2 border border-gray-700 bg-gray-800 rounded"
            onChange={handleClassChange}
            value={character.class}
          >
            <option value="">-- Select Class --</option>
            {classes.map((cls) => (
              <option key={cls.index} value={cls.index}>{cls.name}</option>
            ))}
          </select>
          <p className="mt-2 text-sm text-gray-400">{classDescription}</p>
          <ul className="mt-2 text-sm text-gray-400">
            {classFeatures.map((feature, index) => (
              <li key={index}>• {feature}</li>
            ))}
          </ul>

          <div className="flex justify-between mt-4">
            <Button onClick={handlePrev}>Back</Button>
            <Button onClick={handleNext}>Next</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="text-xl font-bold mb-2 text-yellow-400">Ability Scores</h2>
          <label className="block text-lg mb-2">Choose Method:</label>
          <select
            className="w-full p-2 border border-gray-700 bg-gray-800 rounded mb-4"
            onChange={(e) => setStatMethod(e.target.value)}
            value={statMethod}
          >
            <option value="standard">Standard Array</option>
            <option value="roll">Roll for Stats</option>
          </select>
          {statMethod === "roll" && <Button onClick={rollStats}>🎲 Roll Stats</Button>}
          {statMethod === "standard" && (
            <ul className="mt-4 space-y-2">
              {Object.keys(stats).map((key) => (
                <li key={key} className="p-2 bg-gray-800 border border-gray-700 rounded text-center">
                  <strong>{key}: {stats[key] || ""}</strong>
                  <select
                    className="ml-2 p-1 bg-gray-700 border border-gray-600 rounded"
                    onChange={(e) => handleStatSelection(key, Number(e.target.value))}
                  >
                    <option value="">-- Select --</option>
                    {availableStats.map((num) => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default DnDCharacterBuilder;
