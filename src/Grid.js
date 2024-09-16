import React, { useState } from "react";
import axios from "axios";
import "./Grid.css";  // We'll use this for styling the grid

const Grid = () => {
    const initialGrid = Array(10).fill(Array(10).fill('empty')); // Create a 10x10 grid with 'empty' values
    const [grid, setGrid] = useState(initialGrid); // Grid state
    const [hits, setHits] = useState([]);
    const [misses, setMisses] = useState([]);
    const [result, setResult] = useState(null);
  
  // Function to start the game
  const handleStartGame = async () => {
    try {
      const response = await axios.get('https://localhost:44342/api/Game/start', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(response.data);
      if(response.data == "Game started."){
        setGrid(initialGrid);
      }

    } catch (error) {
      console.error('Error starting the game:', error);
    }
  };
  // Handle cell click
  const handleShoot = async (row, col) => {
    const position = String.fromCharCode(65 + row) + (col + 1); // Convert row, col to "A1", "B3" etc.
    const formData = new FormData();
    formData.append('position', position);  // Add the position to the form data

    try {
    //   const response = await axios.post("https://localhost:44342/api/Game/shoot", { position });
      const response = await axios.post('https://localhost:44342/api/Game/shoot', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
      console.log(response.data)

      // Update grid based on the result (hit or miss)
      const newGrid = grid.map((r, rowIndex) =>
        r.map((cell, colIndex) => {
          if (rowIndex === row && colIndex === col) {
            return response.data == "Hit!" ? 'hit' : 'miss';
          }
          return cell;
        })
      );
      setGrid(newGrid); // Update the grid state

      // You could add logic here to display when a ship is sunk
    } catch (error) {
      console.error("Error attacking the target", error);
      setResult('Error occurred while shooting');
    }
  };

  // Render icons based on cell state
  const renderIcon = (cell) => {
    if (cell === 'hit') {
      return '🔥'; // Fire emoji for a hit
    } else if (cell === 'miss') {
      return '❌'; // Water drop emoji for a miss
    }
    return '🌊'; // Wave emoji for an empty cell
  };

  return (
    <div className="grid">
        <div style={{ padding: '10px 20px' }}>
          <button style={{ padding: '10px 20px' }} onClick={handleStartGame}>Start/Reset Game</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 50px)' }}>
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                width: '50px',
                height: '50px',
                border: '1px solid black',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              onClick={() => handleShoot(rowIndex, colIndex)}
            >
              {renderIcon(cell)}
            </div>
          ))
        )}
      </div>

      {result && <div>Result: {JSON.stringify(result)}</div>}
    </div>
  );
};

export default Grid;
