import { useSuspenseQuery } from "@tanstack/react-query";
import { wordQueryOptions } from "~/lib/queries";
import Wordle from "./wordle";

export default function Game() {
  const { data: word } = useSuspenseQuery(wordQueryOptions);

  return (
    <section className="mt-16 flex w-full flex-1 flex-col items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <h1 className="font-semibold">{word}</h1>
        <Wordle word={word} />
      </div>
    </section>
  );
}
