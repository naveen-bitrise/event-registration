import { Chess, Square } from 'chess.js';
import { useCallback, useState } from 'react';

export type BoardPiece = {
  type: string;
  color: 'w' | 'b';
  square: string;
} | null;

export type GameStatus = 'playing' | 'check' | 'checkmate' | 'stalemate' | 'draw';

function getStatus(chess: Chess): GameStatus {
  if (chess.isCheckmate()) return 'checkmate';
  if (chess.isStalemate()) return 'stalemate';
  if (chess.isDraw()) return 'draw';
  if (chess.isCheck()) return 'check';
  return 'playing';
}

export function useChessGame() {
  const [chess] = useState(() => new Chess());
  const [board, setBoard] = useState<BoardPiece[][]>(() => chess.board());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoveSquares, setLegalMoveSquares] = useState<Set<string>>(new Set());
  const [turn, setTurn] = useState<'w' | 'b'>('w');
  const [status, setStatus] = useState<GameStatus>('playing');

  const refreshState = useCallback(() => {
    setBoard(chess.board());
    setTurn(chess.turn());
    setStatus(getStatus(chess));
  }, [chess]);

  const onSquarePress = useCallback(
    (square: string) => {
      if (status === 'checkmate' || status === 'stalemate' || status === 'draw') return;

      if (selectedSquare === square) {
        setSelectedSquare(null);
        setLegalMoveSquares(new Set());
        return;
      }

      if (selectedSquare && legalMoveSquares.has(square)) {
        try {
          chess.move({ from: selectedSquare as Square, to: square as Square, promotion: 'q' });
          setSelectedSquare(null);
          setLegalMoveSquares(new Set());
          refreshState();
        } catch {
          setSelectedSquare(null);
          setLegalMoveSquares(new Set());
        }
        return;
      }

      const piece = chess.get(square as Square);
      if (piece && piece.color === chess.turn()) {
        setSelectedSquare(square);
        const moves = chess.moves({ square: square as Square, verbose: true });
        setLegalMoveSquares(new Set(moves.map((m) => m.to)));
      } else {
        setSelectedSquare(null);
        setLegalMoveSquares(new Set());
      }
    },
    [chess, selectedSquare, legalMoveSquares, status, refreshState]
  );

  const resetGame = useCallback(() => {
    chess.reset();
    setSelectedSquare(null);
    setLegalMoveSquares(new Set());
    refreshState();
  }, [chess, refreshState]);

  return { board, selectedSquare, legalMoveSquares, turn, status, onSquarePress, resetGame };
}
