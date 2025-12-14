import type { ChangeEvent } from "react";
import { MAX_TRIES } from "~/lib/constants";
import { cn } from "~/lib/utils";
import { useGameStore } from "~/stores/game-store";
import type { GridRow } from "~/types";

type Props = {
  row: GridRow;
  rowIndex: number;
  column: string;
  columnIndex: number;
  word: string;
};

function getBoxId(rowIndex: number, columnIndex: number) {
  return `${rowIndex}_${columnIndex}_box`;
}

export default function WordleLetterBox({
  row,
  rowIndex,
  columnIndex,
  word,
}: Props) {
  const currentBoxId = getBoxId(rowIndex, columnIndex);
  const previousBoxId = getBoxId(rowIndex, columnIndex - 1);
  const nextBoxId = getBoxId(rowIndex, columnIndex + 1);
  const nextRowFirstBoxId = getBoxId(rowIndex + 1, 0);

  const updateGridCell = useGameStore((store) => store.updateGridCell);
  const winGame = useGameStore((store) => store.winGame);
  const loseGame = useGameStore((store) => store.loseGame);
  const lockGridRow = useGameStore((store) => store.lockGridRow);

  function handleCharacterChange(event: ChangeEvent<HTMLInputElement>) {
    // do nothing if the row is already submitted
    if (row.isSubmitted) {
      return;
    }

    // take input's last character value
    const currentLetter = event.target.value.at(-1);

    // do nothing if current letter is empty or not defined
    if (!currentLetter) {
      return;
    }

    const upperCaseLetter = currentLetter.toUpperCase();
    const letterAsciiCode = upperCaseLetter.charCodeAt(0);

    // only allow english alphabets
    if (letterAsciiCode < 65 || letterAsciiCode > 90) {
      return;
    }

    updateGridCell(rowIndex, columnIndex, upperCaseLetter);

    if (columnIndex === word.length - 1) {
      return;
    }
    document.getElementById(nextBoxId)?.focus();
  }

  function getBoxBackground() {
    if (!row.isSubmitted || row.row[columnIndex] === "") {
      return "";
    }
    if (row.row[columnIndex] === word[columnIndex]) {
      return "bg-emerald-200 dark:bg-emerald-600";
    }
    if (word.includes(row.row[columnIndex])) {
      return "bg-amber-200 dark:bg-amber-600";
    }
    return "bg-neutral-300 dark:bg-neutral-600";
  }

  function decideWinOrLoss() {
    let hasSolved = true;

    // validate if word entered matches the game's word
    for (let i = 0; i < word.length; i++) {
      if (row.row[i] !== word[i]) {
        hasSolved = false;
        break;
      }
    }

    // if entered word matches the game's word, player has won
    // lock all the rows to prevent entering anything anymore
    if (hasSolved) {
      winGame();
    }

    // if not solved, lock the current row to avoid editing the previous attempts
    lockGridRow(rowIndex);

    // check if it is the last row
    // at this point, the game is lost
    if (rowIndex === MAX_TRIES - 1) {
      loseGame();
      return;
    }

    // go to next row
    document.getElementById(nextRowFirstBoxId)?.focus();
  }

  function monitorKeyPressChanges(e: React.KeyboardEvent<HTMLInputElement>) {
    // If row is submitted, don't do anything
    if (row.isSubmitted) {
      return;
    }

    // check if Backspace is entered
    if (e.code === "Backspace") {
      if (row.row[columnIndex] === "") {
        // if cell is empty go to previous box except the first box
        if (columnIndex !== 0) {
          document.getElementById(previousBoxId)?.focus();
        }
      } else {
        // empty the current cell's value
        updateGridCell(rowIndex, columnIndex, "");
      }
    }

    // ignore if anyone of the following events occur
    if (
      // not an Enter key press
      e.code !== "Enter" ||
      // last cell is empty
      row.row[columnIndex] === "" ||
      columnIndex !== word.length - 1
    ) {
      return;
    }

    // genuine submission, check if user won
    decideWinOrLoss();
  }

  return (
    <input
      className={cn(
        "flex size-10 items-center justify-center rounded border border-border text-center text-sm",
        row.isSubmitted &&
          "cursor-default caret-transparent focus:outline-none",
        getBoxBackground()
      )}
      id={currentBoxId}
      onChange={handleCharacterChange}
      onKeyDown={monitorKeyPressChanges}
      value={row.row[columnIndex]}
    />
  );
}
