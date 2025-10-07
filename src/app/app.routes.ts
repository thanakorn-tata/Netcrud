import { Routes } from '@angular/router';
import { LayoutMainComponent } from './layout/layout-main/layout-main.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StudentComponent } from './mastermenu/student/student/student.component';
import { BudgetComponent } from './mastermenu/student/budget/budget.component';
import { RestaurantComponent } from './mastermenu/student/restaurant/restaurant.component';

export const routes: Routes = [
    { path: '', component: LayoutMainComponent,
      children: [
        { path: '', redirectTo: 'Dashboard', pathMatch: 'full' },
        { path: 'Dashboard', component: DashboardComponent },
        { path: 'student', component: StudentComponent },
        { path: 'budget', component: BudgetComponent },
        { path: 'restaurant', component: RestaurantComponent }

      ]
    },
    { path: '**', redirectTo: '' }
  ];

