/** biome-ignore-all lint/suspicious/noArrayIndexKey: <needed to grab any cell's value> */

import type {
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import { useGameStore } from "~/stores/game-store";
import { Button } from "./ui/button";
import WordleLetterBox from "./wordle-letter-box";

export default function Wordle({
  word,
  refetch,
}: {
  word: string;
  refetch: (
    options?: RefetchOptions | undefined
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  ) => Promise<QueryObserverResult<any, Error>>;
}) {
  const gameStatus = useGameStore((store) => store.gameStatus);
  const resetGrid = useGameStore((store) => store.resetGrid);
  const grid = useGameStore((store) => store.grid);

  return (
    <div className="space-y-2">
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

      <div className="mt-8 flex flex-col items-center justify-center">
        {gameStatus === "lost" && (
          <p className="text-rose-500">You LOST! {word}</p>
        )}
        {gameStatus === "won" && (
          <p className="text-emerald-500">You WON! {word}</p>
        )}
        <Button
          onClick={() => {
            refetch();
            resetGrid();
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
