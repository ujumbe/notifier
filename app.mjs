import { start } from "./src/index.mjs";

Promise
  .resolve()
  .then(start)
  .catch(console.error);
