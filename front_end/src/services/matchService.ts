import { APIs } from "@/config";
import type { MatchInput } from "@/types";

export const saveMatch = async (input: MatchInput) => {
  try {
    const res = await fetch(APIs.saveMatch(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to save match: ${res.status} ${text}`);
    }

    return await res.json(); // { id }
  } catch (err) {
    console.error("Error saving match:", err);
    throw err;
  }
};
