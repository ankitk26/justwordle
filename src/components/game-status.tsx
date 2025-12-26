import { useSuspenseQuery } from "@tanstack/react-query";
import { MAX_LETTERS } from "~/lib/constants";
import { wordQueryOptions } from "~/lib/queries";
import { useGameStore } from "~/stores/game-store";
import { Button } from "./ui/button";

export default function GameStatus() {
  const { data: word, refetch } = useSuspenseQuery(
    wordQueryOptions(MAX_LETTERS)
  );

  const gameStatus = useGameStore((store) => store.gameStatus);
  const resetGrid = useGameStore((store) => store.resetGrid);

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      {gameStatus === "lost" && (
        <div className="flex flex-col items-center text-rose-500">
          <h2 className="text-lg">{word}</h2>
          <p>You LOST!</p>
        </div>
      )}
      {gameStatus === "won" && <p className="text-emerald-500">You WON!</p>}
      <Button
        onClick={() => {
          refetch();
          resetGrid();
        }}
      >
        Reset
      </Button>
    </div>
  );
}
