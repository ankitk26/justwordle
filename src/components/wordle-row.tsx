import type { GridRow } from "~/types";
import WordleLetterBox from "./wordle-letter-box";

type Props = {
  row: GridRow;
  rowIndex: number;
  word: string;
};

export default function WordleRow({ row, rowIndex, word }: Props) {
  return (
    <div className="flex items-center justify-center gap-2">
      {row.row.map((column, columnIndex) => {
        const key = `${rowIndex}_${columnIndex}_box`;
        return (
          <WordleLetterBox
            column={column}
            columnIndex={columnIndex}
            key={key}
            row={row}
            rowIndex={rowIndex}
            word={word}
          />
        );
      })}
    </div>
  );
}
