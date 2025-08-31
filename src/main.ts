import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { md3 } from 'vuetify/blueprints';
import DayJsAdapter from '@date-io/dayjs';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import '@mdi/font/css/materialdesignicons.css';

import App from './App.vue';

const vuetify = createVuetify({
  components,
  directives,
  blueprint: md3,
  date: {
    adapter: DayJsAdapter,
    formats: {
      fullDateTime24h: 'MMMM D, YYYY HH:mm',
    },
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      light: {
        dark: false,
        colors: {
          // background: '#3960ad',
          // container: '#2c61a3',
          // mainCard: '#28558f',
          // card: '#5580e3',
        },
      },
    },
  },
  // theme: {
  //   defaultTheme: 'light',
  //   themes: {
  //     light: {
  //       dark: false,
  //       colors: {
  //         background: '#326ab5',
  //         container: '#2c61a3',
  //         // card: '#255997',
  //         // card: '#5580e2',
  //         mainCard: '#28558f',
  //         card: '#5580e3',
  //         // card: 'rgba(255, 255, 255, 0.05)',
  //         primary: '#1976D2',
  //       },
  //     },
  //   },
  // },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
});

const app = createApp(App);

app.use(vuetify);
app.use(createPinia());

app.mount('#app');
