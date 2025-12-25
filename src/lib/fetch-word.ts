import { createServerFn } from "@tanstack/react-start";

export const fetchWord = createServerFn({ method: "GET" })
  .inputValidator((s: number) => s)
  .handler(async ({ data }) => {
    const response = await fetch(
      `https://random-word-api.vercel.app/api?words=1&length=${data}&type=uppercase`
    );
    const jsonData = await response.json();

    if (!response.ok) {
      return "ERROR";
    }

    return jsonData;
  });
