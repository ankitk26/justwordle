import { useSuspenseQuery } from "@tanstack/react-query";
import { MAX_LETTERS } from "~/lib/constants";
import { wordQueryOptions } from "~/lib/queries";
import Wordle from "./wordle";

export default function Game() {
  const { data: word, refetch } = useSuspenseQuery(
    wordQueryOptions(MAX_LETTERS)
  );

  return (
    <section className="mt-16 flex w-full flex-1 flex-col items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        {/*<h1 className="font-semibold">{word}</h1>*/}
        <Wordle refetch={refetch} word={word} />
      </div>
    </section>
  );
}
