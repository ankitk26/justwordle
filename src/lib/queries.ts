import { queryOptions } from "@tanstack/react-query";
import { fetchWord } from "./fetch-word";

export const wordQueryOptions = queryOptions({
  queryKey: ["word"],
  queryFn: fetchWord,
  refetchOnWindowFocus: false,
  select: (data) => data[0],
});
