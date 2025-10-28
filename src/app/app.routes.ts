import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LayoutMainComponent } from './layout/layout-main/layout-main.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StudentComponent } from './mastermenu/student/student/studentmg/student.component';
import { StudentmanageComponent } from './mastermenu/student/student/student-manage/student-manage.component';
import { ARSoftComponent } from './mastermenu/view-student/ar-soft/ar-soft.component';
import { ARDIComponent } from './mastermenu/view-student/ar-di/ar-di.component';
import { HRComponent } from './mastermenu/view-student/hr/hr.component';
import { TesterComponent } from './mastermenu/view-student/tester/tester.component';
import { UXUiComponent } from './mastermenu/view-student/ux-ui/ux-ui.component';
import { AccoutingComponent } from './mastermenu/view-student/accouting/accouting.component';
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
      },
      {
        path: 'arsoft',
        component: ARSoftComponent
      },
      {
        path: 'ardi',
        component: ARDIComponent
      },
      {
        path: 'hr',
        component: HRComponent
      },
      {
        path: 'tester',
        component: TesterComponent
      },
      {
        path: 'uxui',
        component: UXUiComponent
      },
      {
        path: 'accounting',
        component: AccoutingComponent
      }
    ]
  },

  // Wildcard Route
  {
    path: '**',
    redirectTo: 'login'
  }
];
