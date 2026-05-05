import React from 'react';
import { Text, StyleSheet } from 'react-native';

const PIECE_SYMBOLS: Record<string, string> = {
  wk: '♔',
  wq: '♕',
  wr: '♖',
  wb: '♗',
  wn: '♘',
  wp: '♙',
  bk: '♚',
  bq: '♛',
  br: '♜',
  bb: '♝',
  bn: '♞',
  bp: '♟',
};

type Props = {
  type: string;
  color: 'w' | 'b';
  size: number;
};

export function Piece({ type, color, size }: Props) {
  const key = `${color}${type}`;
  const symbol = PIECE_SYMBOLS[key] ?? '?';
  return (
    <Text style={[styles.piece, { fontSize: size * 0.65, color: color === 'w' ? '#FFFFFF' : '#1A1A1A' }]}>
      {symbol}
    </Text>
  );
}

const styles = StyleSheet.create({
  piece: {
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
