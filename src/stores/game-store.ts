import { create } from "zustand";
import type { GridRow } from "~/types";

const maxTries = 6;
const letters = 5;

type GameStoreState = {
  defaultGrid: GridRow[];
  grid: GridRow[];
  gameStatus: number;
};

type GameStoreAction = {
  resetGrid: () => void;
  updateGridCell: (row: number, column: number, value: string) => void;
  winGame: () => void;
  lockGridRow: (rowIndex: number) => void;
};

export const useGameStore = create<GameStoreState & GameStoreAction>((set) => ({
  defaultGrid: Array.from({ length: maxTries }, () => ({
    row: new Array(letters).fill(""),
    isSubmitted: false,
  })),
  gameStatus: 0,
  grid: Array.from({ length: maxTries }, () => ({
    row: new Array(letters).fill(""),
    isSubmitted: false,
  })),
  resetGrid: () => {
    set((state) => ({ grid: state.defaultGrid, gameStatus: 0 }));
  },
  updateGridCell: (pRow: number, pColumn: number, value: string) => {
    set((state) => ({
      grid: state.grid.map((gridRow, rowIndex) => {
        if (rowIndex !== pRow) {
          return gridRow;
        }
        return {
          ...gridRow,
          row: gridRow.row.map((column, columnIndex) => {
            if (columnIndex !== pColumn) {
              return column;
            }
            return value;
          }),
        };
      }),
    }));
  },
  lockGridRow: (pRow: number) =>
    set((state) => ({
      grid: state.grid.map((gridRow, rowIndex) => {
        if (rowIndex !== pRow) {
          return gridRow;
        }
        return { ...gridRow, isSubmitted: true };
      }),
    })),
  winGame: () => {
    set((state) => ({
      grid: state.grid.map((gridRow) => ({ ...gridRow, isSubmitted: true })),
      gameStatus: 1,
    }));
  },
}));
