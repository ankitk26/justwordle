import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import Wordle from "~/components/wordle";
import { wordQueryOptions } from "~/lib/queries";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: word, isPending, isError } = useQuery(wordQueryOptions);

  return (
    <main className="flex flex-col items-center justify-center">
      <header className="flex w-full items-center justify-center border-b p-4">
        <h1 className="font-semibold text-2xl">Justwordle</h1>
      </header>

      <section className="mt-16 flex w-full flex-1 flex-col items-center justify-center">
        {isPending && <p>Loading...</p>}
        {!(isPending || isError) && (
          <div className="flex flex-col items-center space-y-4">
            <h1 className="font-semibold">{word}</h1>
            <Wordle word={word} />
          </div>
        )}
      </section>
    </main>
  );
}
