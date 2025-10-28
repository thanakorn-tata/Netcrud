import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart from 'chart.js/auto';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';

import BlueAura from './shared/theme/blue-aura.theme';

import { translationProviders } from './translation.config';
import { credentialsInterceptor } from './auth/credentials.interceptor'; // ✅ ตัวพิมพ์เล็ก

Chart.register(ChartDataLabels);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([credentialsInterceptor]) // ✅ ใช้ชื่อตัวพิมพ์เล็ก
    ),
    providePrimeNG({
      theme: {
        preset: BlueAura
      }
    }),
    ...translationProviders
  ]
};
