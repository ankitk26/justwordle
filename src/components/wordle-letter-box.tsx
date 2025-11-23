import type { ChangeEvent } from "react";
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

function getBoxId(row: number, letterIndex: number) {
  return `${row}_${letterIndex}_box`;
}

export default function WordleLetterBox({
  row,
  rowIndex,
  columnIndex,
  word,
}: Props) {
  const boxId = getBoxId(rowIndex, columnIndex);
  const previousBoxId = getBoxId(rowIndex, columnIndex - 1);
  const nextBoxId = getBoxId(rowIndex, columnIndex + 1);
  const nextRowFirstBoxId = getBoxId(rowIndex + 1, 0);

  const updateGridCell = useGameStore((store) => store.updateGridCell);
  const winGame = useGameStore((store) => store.winGame);
  const lockGridRow = useGameStore((store) => store.lockGridRow);

  const handleCharacterChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (row.isSubmitted) {
      return;
    }
    const currentLetter = event.target.value.at(-1);

    if (!currentLetter) {
      if (columnIndex === 0) {
        updateGridCell(rowIndex, columnIndex, "");
        return;
      }
      document.getElementById(previousBoxId)?.focus();
      return;
    }

    const upperCaseLetter = currentLetter.toUpperCase();
    const letterCode = upperCaseLetter.charCodeAt(0);
    if (letterCode < 65 || letterCode > 90) {
      return;
    }

    updateGridCell(rowIndex, columnIndex, upperCaseLetter);
    if (columnIndex === word.length - 1) {
      return;
    }
    document.getElementById(nextBoxId)?.focus();
  };

  const getBoxBackground = () => {
    if (!row.isSubmitted || row.row[columnIndex] === "") {
      return "";
    }
    if (row.row[columnIndex] === word[columnIndex]) {
      return "bg-green-200";
    }
    if (word.includes(row.row[columnIndex])) {
      return "bg-amber-200";
    }
    return "bg-neutral-300";
  };

  return (
    <input
      className={cn(
        "flex size-10 items-center justify-center rounded border border-border text-center text-sm",
        row.isSubmitted &&
          "cursor-default caret-transparent focus:outline-none",
        getBoxBackground()
      )}
      id={boxId}
      onChange={handleCharacterChange}
      onKeyUp={(e) => {
        // If row is submitted, don't do anything
        if (row.isSubmitted) {
          return;
        }

        // Check if Backspace is entered and character is empty
        // If yes, then focus on previous box
        if (e.code === "Backspace" && row.row[columnIndex] === "") {
          document.getElementById(previousBoxId)?.focus();
        }

        if (
          e.code !== "Enter" ||
          row.row[columnIndex] === "" ||
          columnIndex !== word.length - 1
        ) {
          return;
        }

        console.log("word submitted");
        let hasSolved = true;

        console.log("start validating");
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
        // go to next row
        document.getElementById(nextRowFirstBoxId)?.focus();
      }}
      value={row.row[columnIndex]}
    />
  );
}
