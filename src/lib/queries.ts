import { queryOptions } from "@tanstack/react-query";
import { fetchWord } from "./fetch-word";

export const wordQueryOptions = (letterCount: number) =>
  queryOptions({
    queryKey: ["word"],
    queryFn: () => fetchWord({ data: letterCount }),
    refetchOnWindowFocus: false,
    select: (data) => data[0],
  });
