import { useState } from 'react';
import Square from './Square'
import { allowDrop, drop } from '../logic/utils';
import { BoardState } from '../types';
import '../App.css';

const Board = () => {
  const [state, setState] = useState<BoardState>({
    a1: [0,0,'wr2'], b1:[1,0,'wn2'],c1:[2,0,'wb2'],d1:[3,0,'wq1'],e1:[4,0,'wk'], f1:[5,0,'wb1'], g1:[6,0,'wn1'], h1:[7,0,'wr1'],        
    a2:[0,1,'wp1'],b2:[1,1,'wp2'],c2:[2,1,'wp3'],d2:[3,1,'wp4'],e2:[4,1,'wp5'], f2:[5,1,'wp6'], g2:[6,1,'wp7'], h2:[7,1,'wp8'],        
    a3:[0,2,''],b3:[1,2,''],c3:[2,2,''],d3:[3,2,''],e3:[4,2,''], f3:[5,2,''], g3:[6,2,''], h3:[7,2,''],
    a4:[0,3,''],b4:[1,3,''],c4:[2,3,''],d4:[3,3,''],e4:[4,3,''], f4:[5,3,''], g4:[6,3,''], h4:[7,3,''],  
    a5:[0,4,''],b5:[1,4,''],c5:[2,4,''],d5:[3,4,''],e5:[4,4,''], f5:[5,4,''], g5:[6,4,''], h5:[7,4,''],
    a6:[0,5,''],b6:[1,5,''],c6:[2,5,''],d6:[3,5,''],e6:[4,5,''], f6:[5,5,''], g6:[6,5,''], h6:[7,5,''],
    a7:[0,6,'bp8'],b7:[1,6,'bp7'],c7:[2,6,'bp6'],d7:[3,6,'bp5'],e7:[4,6,'bp4'], f7:[5,6,'bp3'], g7:[6,6,'bp2'], h7:[7,6,'bp1'], 
    a8:[0,7,'br2'],b8:[1,7,'bb2'],c8:[2,7,'bb2'],d8:[3,7,'bq1'],e8:[4,7,'bk'], f8:[5,7,'bb1'], g8:[6,7,'bn1'], h8:[7,7,'br1']
  }) 

  return (
    <div className="container">
      <table className="board">
        {/* Rows of chess squares */}
        {['8', '7', '6', '5', '4', '3', '2', '1'].map((row) => (
          <tr key={`row-${row}`}>
            {/* Columns of chess squares */}
            {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((col) => {
              const id = col + row;
              return (
                <Square
                  key={id}
                  id={id}
                  onDrop={drop}
                  onDragOver={allowDrop}
                  pieceId={state[id][2]}
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