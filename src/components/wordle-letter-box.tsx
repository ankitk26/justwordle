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

  const wordCharacterFrequency = new Array<number>(26).fill(0);
  const submittedWord = row.row.join("");

  for (const character of word) {
    wordCharacterFrequency[getCharacterIndex(character)] += 1;
  }

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

  function getCharacterIndex(character: string) {
    const characterAsciiCode = character.charCodeAt(0);
    return characterAsciiCode - 65;
  }

  function getBoxBackground() {
    const correctColor = "bg-emerald-200 dark:bg-emerald-600";
    const incorrectColor = "bg-neutral-300 dark:bg-neutral-600";
    const partiallyCorrectColor = "bg-amber-200 dark:bg-amber-600";

    if (!row.isSubmitted || row.row[columnIndex] === "") {
      return "";
    }

    let finalColorCode = "";
    for (const [index, character] of row.row.entries()) {
      if (character === word[index]) {
        finalColorCode += "C";
        wordCharacterFrequency[getCharacterIndex(character)] -= 1;
      } else if (wordCharacterFrequency[getCharacterIndex(character)] > 0) {
        finalColorCode += "P";
        wordCharacterFrequency[getCharacterIndex(character)] -= 1;
      } else {
        finalColorCode += "I";
      }
    }

    if (finalColorCode[columnIndex] === "C") {
      return correctColor;
    }

    if (finalColorCode[columnIndex] === "I") {
      return incorrectColor;
    }

    return partiallyCorrectColor;
  }

  function handleAfterSubmissionState() {
    if (submittedWord === word) {
      winGame();
      return;
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

    // handle what to do after submission
    handleAfterSubmissionState();
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
