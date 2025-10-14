import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { LayoutMainComponent } from './layout/layout-main/layout-main.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StudentComponent } from './mastermenu/student/student/studentmg/student.component';
import { StudentmanageComponent } from './mastermenu/student/student/student-manage/student-manage.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutMainComponent,
    children: [
      { path: '', redirectTo: 'Dashboard', pathMatch: 'full' },
      { path: 'Dashboard', component: DashboardComponent },
      { path: 'student', component: StudentComponent },
      { path: 'studentmanage', component: StudentmanageComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];
