/** biome-ignore-all lint/suspicious/noArrayIndexKey: <needed to grab any cell's value> */

import { useGameStore } from "~/stores/game-store";
import WordleLetterBox from "./wordle-letter-box";

export default function Wordle({ word }: { word: string }) {
  const grid = useGameStore((store) => store.grid);

  return (
    <div className="flex flex-col items-center space-y-2">
      {grid.map((row, rowIndex) => (
        <div
          className="flex items-center justify-center gap-2"
          key={`row_${rowIndex}`}
        >
          {row.row.map((column, columnIndex) => {
            const key = `${rowIndex}_${columnIndex}_box`;
            return (
              <WordleLetterBox
                column={column}
                columnIndex={columnIndex}
                key={key}
                row={row}
                rowIndex={rowIndex}
                word={word}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
