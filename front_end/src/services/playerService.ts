import { APIs } from "@/config";

export const savePlayer = async (username: string) => {
  const res = await fetch(APIs.savePlayer(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });

  if (!res.ok) {
    throw new Error("Failed to save player");
  }

  return res.json(); //  saved player
};

export const fetchPlayerStats = async (
  username: string,
  query: Record<string, string | number>
) => {
  const queryStr = new URLSearchParams(query as any).toString();
  const url = `${APIs.getPlayerStats(username)}${
    queryStr ? "?" + queryStr : ""
  }`;

  const res = await fetch(url);

  if (!res.ok) {
    console.error("Failed to fetch stats");
    if (res.status === 404) {
      throw new Error(`Player '${username}' not found`);
    }
    throw new Error("Failed to fetch player stats");
    // return null;
  }

  return res.json(); // returns player stats
};
