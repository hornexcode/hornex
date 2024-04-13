import { addons } from '@storybook/manager-api';

import { create } from '@storybook/theming';

addons.setConfig({
  theme: create({
    brandTitle: 'Hornex',
    fontBase: '"Open Sans", sans-serif',
    base: 'light',
  }),
});
