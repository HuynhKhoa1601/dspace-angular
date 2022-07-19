import * as child from 'child_process';

import { AppConfig } from '../src/config/app-config.interface';
import { buildAppConfig } from '../src/config/config.server';

const appConfig: AppConfig = buildAppConfig();

/**
 * Calls `ng serve` with the following arguments configured for the UI in the app config: host, port, nameSpace, ssl
 */
child.spawn(
  `ng serve --host 0.0.0.0 --port 80 --serve-path ${appConfig.ui.nameSpace} --ssl false  --disable-host-check`,
  { stdio: 'inherit', shell: true }
);
