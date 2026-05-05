import React from 'react';
import { Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChessBoard } from '@/components/chess/ChessBoard';
import { useChessGame } from '@/hooks/useChessGame';

const BOARD_PADDING = 16;
const screenWidth = Dimensions.get('window').width;
const boardSize = screenWidth - BOARD_PADDING * 2;
const squareSize = Math.floor(boardSize / 8);

function statusMessage(status: string, turn: 'w' | 'b'): string {
  if (status === 'checkmate') return `Checkmate! ${turn === 'w' ? 'Black' : 'White'} wins!`;
  if (status === 'stalemate') return 'Stalemate! Draw.';
  if (status === 'draw') return 'Draw!';
  if (status === 'check') return `${turn === 'w' ? 'White' : 'Black'} is in check!`;
  return `${turn === 'w' ? 'White' : 'Black'} to move`;
}

export default function GameScreen() {
  const { board, selectedSquare, legalMoveSquares, turn, status, onSquarePress, resetGame } =
    useChessGame();

  const handleSquarePress = (square: string) => {
    onSquarePress(square);
    if (status === 'checkmate' || status === 'stalemate' || status === 'draw') {
      Alert.alert('Game Over', statusMessage(status, turn), [
        { text: 'New Game', onPress: resetGame },
      ]);
    }
  };

  const isGameOver = status === 'checkmate' || status === 'stalemate' || status === 'draw';

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Chess</Text>

      <View style={styles.statusContainer}>
        <View style={[styles.turnIndicator, { backgroundColor: turn === 'w' ? '#FFFFFF' : '#1A1A1A' }]} />
        <Text style={styles.statusText}>{statusMessage(status, turn)}</Text>
      </View>

      <View style={styles.boardContainer}>
        <ChessBoard
          board={board}
          selectedSquare={selectedSquare}
          legalMoveSquares={legalMoveSquares}
          onSquarePress={handleSquarePress}
          squareSize={squareSize}
        />
      </View>

      <TouchableOpacity style={styles.newGameButton} onPress={resetGame}>
        <Text style={styles.newGameText}>{isGameOver ? 'Play Again' : 'New Game'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2C2C',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F0D9B5',
    letterSpacing: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#3C3C3C',
    borderRadius: 20,
  },
  turnIndicator: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#888',
  },
  statusText: {
    color: '#F0D9B5',
    fontSize: 15,
    fontWeight: '600',
  },
  boardContainer: {
    paddingHorizontal: BOARD_PADDING,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  newGameButton: {
    backgroundColor: '#1B5E20',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  newGameText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
