"use server";

import fs from "fs/promises";
import path from "path";
import type { User } from "./types";

const usersFilePath = path.join(process.cwd(), "data/users.json");

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function attemptLogin(
  email: string,
  pass: string,
): Promise<User | null> {
  await delay(500);

  let users: User[] = [];
  try {
    const jsonData = await fs.readFile(usersFilePath, "utf-8");
    users = JSON.parse(jsonData);
  } catch (error) {
    console.error("Error reading users file:", error);
    return null;
  }

  const user = users.find((u) => u.email === email);

  if (user && pass === "password") {
    return user;
  }

  return null;
}
