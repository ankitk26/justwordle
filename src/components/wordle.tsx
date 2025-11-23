/** biome-ignore-all lint/suspicious/noArrayIndexKey: <will fix later> */
import { useGameStore } from "~/stores/game-store";
import { Button } from "./ui/button";
import WordleRow from "./wordle-row";

export default function Wordle({ word }: { word: string }) {
  const gameStatus = useGameStore((store) => store.gameStatus);
  const resetGrid = useGameStore((store) => store.resetGrid);
  const grid = useGameStore((store) => store.grid);

  return (
    <div className="space-y-2">
      {grid.map((row, rowIndex) => (
        <WordleRow
          key={`row_${rowIndex}`}
          row={row}
          rowIndex={rowIndex}
          word={word}
        />
      ))}
      <div className="mt-8 flex flex-col items-center justify-center">
        {gameStatus === -1 && <p>You LOST!</p>}
        {gameStatus === 1 && <p>You WON!</p>}
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
