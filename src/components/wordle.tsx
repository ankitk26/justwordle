/** biome-ignore-all lint/suspicious/noArrayIndexKey: <needed to grab any cell's value> */
import { useGameStore } from "~/stores/game-store";
import { Button } from "./ui/button";
import WordleLetterBox from "./wordle-letter-box";

export default function Wordle({ word }: { word: string }) {
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
        {gameStatus === "lost" && <p className="text-rose-500">You LOST!</p>}
        {gameStatus === "won" && <p className="text-emerald-500">You WON!</p>}
        <Button
          onClick={() => {
            resetGrid();
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
