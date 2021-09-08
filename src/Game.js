import React from 'react';
import Board from './Board';
import TextField from '@material-ui/core/TextField';
import fireworks from 'fireworks';

const createFireworks = () => {
  for (var i=0; i<4; i++) {
    for (var j=0; j<4; j++) {
      fireworks({
        x: window.innerWidth / i,
        y: window.innerHeight / j,
        colors: ['#cc3333', '#4CAF50', '#81C784']
      });
    }
  }
}

const calculateWinner = (squares) => {
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

  for (let i = 0; i < lines.length; i += 1) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      createFireworks();
      return { winner: squares[a], winnerRow: lines[i] };
    }
  }

  return { winner: null, winnerRow: null };
};

const getLocation = (move) => {
  const locationMap = {
    0: 'row: 1, col: 1',
    1: 'row: 1, col: 2',
    2: 'row: 1, col: 3',
    3: 'row: 2, col: 1',
    4: 'row: 2, col: 2',
    5: 'row: 2, col: 3',
    6: 'row: 3, col: 1',
    7: 'row: 3, col: 2',
    8: 'row: 3, col: 3',
  };

  return locationMap[move];
};

const initialState = {
  history: [
    {
      squares: Array(9).fill(null),
    },
  ],
  currentStepNumber: 0,
  xPlayerName: 'Player 1',
  yPlayerName: 'Player 2',
  xIsNext: true,
};

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.currentStepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([
        {
          squares,
          currentLocation: getLocation(i),
          stepNumber: history.length,
        },
      ]),
      xIsNext: !this.state.xIsNext,
      currentStepNumber: history.length,
    });
  }

  jumpTo(step) {
    this.setState({
      currentStepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  reset() {
    this.setState(initialState);
  }

  setXPlayerName(e) {
    this.setState({ xPlayerName: e.target.value });
  }

  setYPlayerName(e) {
    this.setState({ yPlayerName: e.target.value });
  }

  render() {
    const { history, xPlayerName, yPlayerName } = this.state;
    const current = history[this.state.currentStepNumber];
    const { winner, winnerRow } = calculateWinner(current.squares);

    let status;
    if (winner) {
      const winnerName = winner === 'X' ? xPlayerName : yPlayerName;
      status = `Winner: ${winnerName}, Congratulations!`;
    } else if (history.length === 10) {
      status = 'Draw. No one won.';
    } else {
      status = `Next Move: ${this.state.xIsNext ? this.state.xPlayerName : this.state.yPlayerName}`;
    }

    return (
      <div className="game">

        <div className="game-info">
          <div className="player-names">
            <div className="player-name-title">Enter your names here!</div>
            <TextField id="player-1" defaultValue="Player 1" onChange={e => this.setXPlayerName(e)}/>
            &nbsp;
            <TextField id="player-2" defaultValue="Player 2" onChange={e => this.setYPlayerName(e)}/>
          </div>
          <div className="status">{status}</div>
          <div className="game-board">
            <Board
              squares={current.squares}
              winnerSquares={winnerRow}
              onClick={i => this.handleClick(i)}
            />
          </div>
          <div className="new-game-button-container">
            <button className="button new-game-button" onClick={() => this.reset()}>
              New game
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Game;
