import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';

export const MusicAppTheme = definePreset(Aura, {
  components: {
    card: {
      root: {
        borderRadius: '0',
      },
    },
  },
});
