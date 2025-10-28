import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LayoutMainComponent } from './layout/layout-main/layout-main.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StudentComponent } from './mastermenu/student/student/studentmg/student.component';
import { StudentmanageComponent } from './mastermenu/student/student/student-manage/student-manage.component';

export const routes: Routes = [  {
    path: 'login',
    loadComponent: () => import('./auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register').then(m => m.RegisterComponent)
  },

  // Protected Routes (With Layout)
  {
    path: '',
    component: LayoutMainComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'student',
        component: StudentComponent
      },
      {
        path: 'studentmanage',
        component: StudentmanageComponent
      },
      {
        path: 'studentmanage/:id',
        component: StudentmanageComponent
      }
    ]
  },

  // Wildcard Route
  {
    path: '**',
    redirectTo: 'login'
  }
];
