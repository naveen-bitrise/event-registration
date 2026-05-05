import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BoardPiece } from '@/hooks/useChessGame';
import { Square } from './Square';

type Props = {
  board: BoardPiece[][];
  selectedSquare: string | null;
  legalMoveSquares: Set<string>;
  onSquarePress: (square: string) => void;
  squareSize: number;
};

function toSquareName(row: number, col: number): string {
  const file = String.fromCharCode('a'.charCodeAt(0) + col);
  const rank = 8 - row;
  return `${file}${rank}`;
}

export function ChessBoard({ board, selectedSquare, legalMoveSquares, onSquarePress, squareSize }: Props) {
  return (
    <View style={styles.board}>
      {board.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((piece, colIndex) => {
            const square = toSquareName(rowIndex, colIndex);
            const isLight = (rowIndex + colIndex) % 2 === 0;
            return (
              <Square
                key={square}
                piece={piece}
                isLight={isLight}
                isSelected={selectedSquare === square}
                isLegalMove={legalMoveSquares.has(square)}
                onPress={() => onSquarePress(square)}
                size={squareSize}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    borderWidth: 2,
    borderColor: '#4A3728',
  },
  row: {
    flexDirection: 'row',
  },
});
