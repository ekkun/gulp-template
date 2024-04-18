// TypeScript
import './modules/include';

import { test } from './modules/export';

window.addEventListener('load', (): void => {
  test();
});
