import "dotenv/config";
import { createWithNested } from "./src/create-with-nested.js";
import { z } from "zod";

try {
  await createWithNested();
} catch (e) {
  console.error(e);
}
