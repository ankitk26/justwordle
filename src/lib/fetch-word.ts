import { createServerFn } from "@tanstack/react-start";

export const fetchWord = createServerFn({ method: "GET" }).handler(async () => {
  const response = await fetch(
    "https://random-word-api.vercel.app/api?words=1&length=5&type=uppercase"
  );
  const jsonData = await response.json();

  if (!response.ok) {
    return "ERROR";
  }

  return jsonData;
});
