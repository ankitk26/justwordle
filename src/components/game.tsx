import { useSuspenseQuery } from "@tanstack/react-query";
import { MAX_LETTERS } from "~/lib/constants";
import { wordQueryOptions } from "~/lib/queries";
import GameStatus from "./game-status";
import Wordle from "./wordle";

export default function Game() {
  const { data: word } = useSuspenseQuery(wordQueryOptions(MAX_LETTERS));

  return (
    <section className="mt-16 flex w-full flex-1 flex-col items-center justify-center space-y-8">
      <Wordle word={word} />
      <GameStatus />
    </section>
  );
}
