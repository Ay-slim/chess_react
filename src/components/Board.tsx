import { useState } from 'react';
import Square from './Square'
import { allowDrop, drop } from '../logic/utils';
import { BoardState, PlayerColor } from '../types';
import '../App.css';

const Board = () => {
  const [state, setState] = useState<BoardState>({
    a1: { loc: [0, 0], piece: 'wr2' },
    b1: { loc: [1, 0], piece: 'wn2' },
    c1: { loc: [2, 0], piece: 'wb2' },
    d1: { loc: [3, 0], piece: 'wq1' },
    e1: { loc: [4, 0], piece: 'wk' },
    f1: { loc: [5, 0], piece: 'wb1' },
    g1: { loc: [6, 0], piece: 'wn1' },
    h1: { loc: [7, 0], piece: 'wr1' },
    a2: { loc: [0, 1], piece: 'wp1' },
    b2: { loc: [1, 1], piece: 'wp2' },
    c2: { loc: [2, 1], piece: 'wp3' },
    d2: { loc: [3, 1], piece: 'wp4' },
    e2: { loc: [4, 1], piece: 'wp5' },
    f2: { loc: [5, 1], piece: 'wp6' },
    g2: { loc: [6, 1], piece: 'wp7' },
    h2: { loc: [7, 1], piece: 'wp8' },
    a3: { loc: [0, 2], piece: '' },
    b3: { loc: [1, 2], piece: '' },
    c3: { loc: [2, 2], piece: '' },
    d3: { loc: [3, 2], piece: '' },
    e3: { loc: [4, 2], piece: '' },
    f3: { loc: [5, 2], piece: '' },
    g3: { loc: [6, 2], piece: '' },
    h3: { loc: [7, 2], piece: '' },
    a4: { loc: [0, 3], piece: '' },
    b4: { loc: [1, 3], piece: '' },
    c4: { loc: [2, 3], piece: '' },
    d4: { loc: [3, 3], piece: '' },
    e4: { loc: [4, 3], piece: '' },
    f4: { loc: [5, 3], piece: '' },
    g4: { loc: [6, 3], piece: '' },
    h4: { loc: [7, 3], piece: '' },
    a5: { loc: [0, 4], piece: '' },
    b5: { loc: [1, 4], piece: '' },
    c5: { loc: [2, 4], piece: '' },
    d5: { loc: [3, 4], piece: '' },
    e5: { loc: [4, 4], piece: '' },
    f5: { loc: [5, 4], piece: '' },
    g5: { loc: [6, 4], piece: '' },
    h5: { loc: [7, 4], piece: '' },
    a6: { loc: [0, 5], piece: '' },
    b6: { loc: [1, 5], piece: '' },
    c6: { loc: [2, 5], piece: '' },
    d6: { loc: [3, 5], piece: '' },
    e6: { loc: [4, 5], piece: '' },
    f6: { loc: [5, 5], piece: '' },
    g6: { loc: [6, 5], piece: '' },
    h6: { loc: [7, 5], piece: '' },
    a7: { loc: [0, 6], piece: 'bp8' },
    b7: { loc: [1, 6], piece: 'bp7' },
    c7: { loc: [2, 6], piece: 'bp6' },
    d7: { loc: [3, 6], piece: 'bp5' },
    e7: { loc: [4, 6], piece: 'bp4' },
    f7: { loc: [5, 6], piece: 'bp3' },
    g7: { loc: [6, 6], piece: 'bp2' },
    h7: { loc: [7, 6], piece: 'bp1' },
    a8: { loc: [0, 7], piece: 'br2' },
    b8: { loc: [1, 7], piece: 'bb2' },
    c8: { loc: [2, 7], piece: 'bb2' },
    d8: { loc: [3, 7], piece: 'bq1' },
    e8: { loc: [4, 7], piece: 'bk' },
    f8: { loc: [5, 7], piece: 'bb1' },
    g8: { loc: [6, 7], piece: 'bn1' },
    h8: { loc: [7, 7], piece: 'br1' },
  })
  const [currentPlayerColor, setCurrentPlayerColor] = useState<PlayerColor>('w')

  return (
    <div className="container">
      <table className="board">
        {['8', '7', '6', '5', '4', '3', '2', '1'].map((row) => (
          <tr key={`row-${row}`}>
            {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((col) => {
              const id = col + row;
              return (
                <Square
                  key={id}
                  id={id}
                  onDrop={drop}
                  onDragOver={allowDrop}
                  pieceId={state[id].piece}
                  currentColor={currentPlayerColor}
                />
              );
            })}
          </tr>
        ))}
      </table>
    </div>
  );
}

export default Board