import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart from 'chart.js/auto';
import { routes } from './app.routes';import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { provideAnimations } from '@angular/platform-browser/animations';

import BlueAura from './shared/theme/blue-aura.theme'; // 👈 ตรงนี้ต้องเป็น path ของไฟล์ที่คุณสร้างเอง

import { translationProviders } from './translation.config';

Chart.register(ChartDataLabels);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: BlueAura
      }
    }),
    ...translationProviders
  ]

};
