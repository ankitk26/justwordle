import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import Game from "~/components/game";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="flex flex-col items-center justify-center">
      <header className="flex w-full items-center justify-center border-b p-4">
        <h1 className="font-semibold text-2xl">Justwordle</h1>
      </header>

      <Suspense fallback={<p>Loading...</p>}>
        <Game />
      </Suspense>
    </main>
  );
}
