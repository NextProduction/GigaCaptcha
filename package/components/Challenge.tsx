import React from 'react';

const Challenge = ({ onSolve }: { onSolve: () => void }) => {
  return (
    <div>
      <p>🧩 Solve this ridiculous challenge!</p>
      <button onClick={onSolve}>Solve it!</button>
    </div>
  );
};

export default Challenge;
