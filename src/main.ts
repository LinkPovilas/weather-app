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
  },
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
