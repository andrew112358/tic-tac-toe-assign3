import * as React from 'react'
import * as ReactBootstrap from 'react-bootstrap'
import { useState } from 'react';

const { Badge, Button, Card } = ReactBootstrap

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const [selectedSquare, setSelectedSquare] = useState(null);
  const currentPlayer = xIsNext ? 'X' : 'O';
  const playerPieceCount = squares.filter(s => s === currentPlayer).length;
  const needsSlide = playerPieceCount >= 3;

  function handleClick(i) {

    if (calculateWinner(squares)) {
      return;
    }

    if (!needsSlide) {
      if (squares[i]) {
        return;
      }
      const nextSquares = squares.slice();
      nextSquares[i] = currentPlayer;
      onPlay(nextSquares);
      return;
    } else {
      if (squares[i] === currentPlayer) {
        setSelectedSquare(i);
        return;
      }
      if (selectedSquare !== null && squares[i] === null) {
        if (!isAdjacent(selectedSquare, i)) {
          return;
        }

        const nextSquares = squares.slice();
        nextSquares[i] = currentPlayer;
        nextSquares[selectedSquare] = null;

        const centerIndex = 4;
        if (squares[centerIndex] === currentPlayer) {
          const isWinningMove = calculateWinner(nextSquares) !== null;
          const vacatingCenter = nextSquares[centerIndex] !== currentPlayer;

          if (!isWinningMove && !vacatingCenter) {
            return;
          }
        }
        setSelectedSquare(null);
        onPlay(nextSquares);
        return;
      }
    }

  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = `Next player: ${currentPlayer} ${needsSlide ? '(Select a piece to slide)' : '(Place piece)'}`;
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if(move >0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function isAdjacent(a, b) {
  const rowA = Math.floor(a / 3);
  const colA = a % 3;
  const rowB = Math.floor(b / 3);
  const colB = b % 3;

  const rowDiff = Math.abs(rowA - rowB);
  const colDiff = Math.abs(colA - colB);

  return (rowDiff <= 1) && (colDiff <= 1) && (rowDiff > 0 || colDiff > 0);
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// export default function App() {
//   const [name, setName] = React.useState('World')

//   return (
//     <div className="container py-4">
//       <Card className="starter-card shadow-sm">
//         <Card.Body className="p-4">
//           <h1 className="greeting display-6 fw-bold">Hello, {name}!</h1>
//           <p className="mb-3 text-secondary">
//             This starter is set up to match the React Essentials notes more closely.
//             For the assignment, build the tic-tac-toe tutorial in this file and leave
//             mounting to <code>src/main.jsx</code>.
//           </p>
//           <div className="d-flex gap-2 flex-wrap align-items-center">
//             <Button variant="primary" onClick={() => setName('CS 35L')}>
//               Set example name
//             </Button>
//             <Badge bg="secondary" pill>
//               ReactBootstrap ready
//             </Badge>
//           </div>
//         </Card.Body>
//       </Card>

//       <Board />
//     // </div>
//   )
// }
