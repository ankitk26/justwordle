import { create } from "zustand";
import { MAX_LETTERS, MAX_TRIES } from "~/lib/constants";
import type { GameStatus, GridRow } from "~/types";

type GameStoreState = {
  defaultGrid: GridRow[];
  grid: GridRow[];
  gameStatus: GameStatus;
};

type GameStoreAction = {
  resetGrid: () => void;
  updateGridCell: (row: number, column: number, value: string) => void;
  winGame: () => void;
  loseGame: () => void;
  lockGridRow: (rowIndex: number) => void;
};

export const useGameStore = create<GameStoreState & GameStoreAction>((set) => ({
  defaultGrid: Array.from({ length: MAX_TRIES }, () => ({
    row: new Array(MAX_LETTERS).fill(""),
    isSubmitted: false,
  })),
  grid: Array.from({ length: MAX_TRIES }, () => ({
    row: new Array(MAX_LETTERS).fill(""),
    isSubmitted: false,
  })),
  gameStatus: "not_started",
  resetGrid: () => {
    set((state) => ({ grid: state.defaultGrid, gameStatus: "not_started" }));
  },
  updateGridCell: (
    paramRowIndex: number,
    paramColumnIndex: number,
    newCellValue: string
  ) => {
    set((state) => ({
      grid: state.grid.map((gridRow, rowIndex) => {
        if (rowIndex !== paramRowIndex) {
          return gridRow;
        }
        return {
          ...gridRow,
          row: gridRow.row.map((column, columnIndex) => {
            if (columnIndex !== paramColumnIndex) {
              return column;
            }
            return newCellValue;
          }),
        };
      }),
    }));
  },
  lockGridRow: (paramRowIndex: number) =>
    set((state) => ({
      grid: state.grid.map((gridRow, rowIndex) => {
        if (rowIndex !== paramRowIndex) {
          return gridRow;
        }
        return { ...gridRow, isSubmitted: true };
      }),
    })),
  winGame: () => {
    set((state) => ({
      grid: state.grid.map((gridRow) => ({ ...gridRow, isSubmitted: true })),
      gameStatus: "won",
    }));
  },
  loseGame: () => {
    set(() => ({ gameStatus: "lost" }));
  },
}));
