import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { BoardPiece } from '@/hooks/useChessGame';
import { Piece } from './Piece';

const LIGHT_SQUARE = '#F0D9B5';
const DARK_SQUARE = '#B58863';
const SELECTED_COLOR = 'rgba(20, 85, 30, 0.8)';
const LEGAL_MOVE_COLOR = 'rgba(20, 85, 30, 0.5)';

type Props = {
  piece: BoardPiece;
  isLight: boolean;
  isSelected: boolean;
  isLegalMove: boolean;
  onPress: () => void;
  size: number;
};

export function Square({ piece, isLight, isSelected, isLegalMove, onPress, size }: Props) {
  const bgColor = isSelected
    ? SELECTED_COLOR
    : isLight
    ? LIGHT_SQUARE
    : DARK_SQUARE;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.square, { width: size, height: size, backgroundColor: bgColor }]}
      activeOpacity={0.8}
    >
      {isLegalMove && !piece && (
        <View style={[styles.legalDot, { width: size * 0.3, height: size * 0.3, borderRadius: size * 0.15, backgroundColor: LEGAL_MOVE_COLOR }]} />
      )}
      {isLegalMove && piece && (
        <View style={[styles.legalCapture, { borderRadius: size * 0.05, borderColor: LEGAL_MOVE_COLOR, borderWidth: size * 0.07 }]} />
      )}
      {piece && (
        <Piece type={piece.type} color={piece.color} size={size} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  square: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  legalDot: {
    position: 'absolute',
  },
  legalCapture: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
