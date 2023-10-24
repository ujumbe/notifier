import { start } from './src/index';

Promise
  .resolve()
  .then(start)
  .catch(console.error);
