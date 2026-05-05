import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Color = 'white' | 'black';
type Piece = { type: string; color: Color };
type Board = (Piece | null)[][];

const PIECES: Record<Color, Record<string, string>> = {
  white: { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' },
  black: { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' },
};

const CELL = Math.floor(Dimensions.get('window').width / 8);

function initBoard(): Board {
  const b: Board = Array(8).fill(null).map(() => Array(8).fill(null));
  const order = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
  order.forEach((t, i) => {
    b[0][i] = { type: t, color: 'black' };
    b[7][i] = { type: t, color: 'white' };
  });
  for (let i = 0; i < 8; i++) {
    b[1][i] = { type: 'pawn', color: 'black' };
    b[6][i] = { type: 'pawn', color: 'white' };
  }
  return b;
}

function getMoves(board: Board, row: number, col: number): [number, number][] {
  const piece = board[row][col];
  if (!piece) return [];
  const moves: [number, number][] = [];
  const inBounds = (r: number, c: number) => r >= 0 && r < 8 && c >= 0 && c < 8;
  const enemy = (r: number, c: number) => inBounds(r, c) && !!board[r][c] && board[r][c]!.color !== piece.color;
  const slide = (dr: number, dc: number) => {
    let r = row + dr, c = col + dc;
    while (inBounds(r, c)) {
      if (board[r][c]) { if (enemy(r, c)) moves.push([r, c]); break; }
      moves.push([r, c]); r += dr; c += dc;
    }
  };
  if (piece.type === 'pawn') {
    const dir = piece.color === 'white' ? -1 : 1;
    const start = piece.color === 'white' ? 6 : 1;
    if (inBounds(row + dir, col) && !board[row + dir][col]) {
      moves.push([row + dir, col]);
      if (row === start && !board[row + 2 * dir][col]) moves.push([row + 2 * dir, col]);
    }
    if (enemy(row + dir, col - 1)) moves.push([row + dir, col - 1]);
    if (enemy(row + dir, col + 1)) moves.push([row + dir, col + 1]);
  }
  if (piece.type === 'knight') {
    [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]].forEach(([dr, dc]) => {
      const r = row + dr, c = col + dc;
      if (inBounds(r, c) && (!board[r][c] || enemy(r, c))) moves.push([r, c]);
    });
  }
  if (piece.type === 'bishop' || piece.type === 'queen')
    [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(([dr, dc]) => slide(dr, dc));
  if (piece.type === 'rook' || piece.type === 'queen')
    [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dr, dc]) => slide(dr, dc));
  if (piece.type === 'king') {
    [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]].forEach(([dr, dc]) => {
      const r = row + dr, c = col + dc;
      if (inBounds(r, c) && (!board[r][c] || enemy(r, c))) moves.push([r, c]);
    });
  }
  return moves;
}

export default function ChessScreen() {
  const [board, setBoard] = useState<Board>(initBoard());
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [moves, setMoves] = useState<[number, number][]>([]);
  const [turn, setTurn] = useState<Color>('white');
  const [status, setStatus] = useState("White's turn");

  const handlePress = (row: number, col: number) => {
    const piece = board[row][col];
    if (selected) {
      const isMove = moves.some(([r, c]) => r === row && c === col);
      if (isMove) {
        const newBoard = board.map(r => [...r]);
        const moving = { ...newBoard[selected[0]][selected[1]]! };
        if (moving.type === 'pawn' && (row === 0 || row === 7)) moving.type = 'queen';
        const captured = newBoard[row][col];
        newBoard[row][col] = moving;
        newBoard[selected[0]][selected[1]] = null;
        const next: Color = turn === 'white' ? 'black' : 'white';
        setBoard(newBoard);
        setSelected(null);
        setMoves([]);
        if (captured?.type === 'king') {
          setStatus(`${turn === 'white' ? 'White' : 'Black'} wins! 🎉`);
        } else {
          setTurn(next);
          setStatus(`${next === 'white' ? 'White' : 'Black'}'s turn`);
        }
      } else if (piece?.color === turn) {
        setSelected([row, col]);
        setMoves(getMoves(board, row, col));
      } else {
        setSelected(null);
        setMoves([]);
      }
    } else if (piece?.color === turn) {
      setSelected([row, col]);
      setMoves(getMoves(board, row, col));
    }
  };

  const reset = () => {
    setBoard(initBoard());
    setSelected(null);
    setMoves([]);
    setTurn('white');
    setStatus("White's turn");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Chess</Text>
      <Text style={styles.status}>{status}</Text>
      <View style={styles.board}>
        {board.map((row, r) => (
          <View key={r} style={styles.row}>
            {row.map((piece, c) => {
              const isSelected = selected?.[0] === r && selected?.[1] === c;
              const isMove = moves.some(([mr, mc]) => mr === r && mc === c);
              const light = (r + c) % 2 === 0;
              let bg = light ? '#f0d9b5' : '#b58863';
              if (isSelected) bg = '#7fc97f';
              else if (isMove) bg = light ? '#cde6a0' : '#92b45a';
              return (
                <TouchableOpacity
                  key={c}
                  style={[styles.cell, { backgroundColor: bg }]}
                  onPress={() => handlePress(r, c)}
                  activeOpacity={0.8}
                >
                  {piece && (
                    <Text style={[styles.piece, { color: piece.color === 'white' ? '#fff' : '#111' }]}>
                      {PIECES[piece.color][piece.type]}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={reset}>
        <Text style={styles.buttonText}>New Game</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', alignItems: 'center', justifyContent: 'center' },
  title: { color: '#e0e0e0', fontSize: 28, fontWeight: 'bold', marginBottom: 6 },
  status: { color: '#aaa', fontSize: 16, marginBottom: 12 },
  board: { borderWidth: 2, borderColor: '#555' },
  row: { flexDirection: 'row' },
  cell: { width: CELL, height: CELL, alignItems: 'center', justifyContent: 'center' },
  piece: { fontSize: CELL * 0.65, textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 },
  button: { marginTop: 20, backgroundColor: '#4a4a8a', paddingHorizontal: 28, paddingVertical: 12, borderRadius: 8 },
  buttonText: { color: 'white', fontSize: 16 },
});
