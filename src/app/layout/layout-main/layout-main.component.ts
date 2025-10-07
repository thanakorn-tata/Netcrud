import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { PrimeIcons } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { NgFor } from '@angular/common';
import { TranslateModule, TranslateService} from '@ngx-translate/core';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-layout-main',
  templateUrl: './layout-main.component.html',
  styleUrl: './layout-main.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MenubarModule,
    ButtonModule,
    NgFor,
    TranslateModule,
    FooterComponent
  ]
})
export class LayoutMainComponent {
  constructor(private translateService: TranslateService) {
    const savedLang = localStorage.getItem('language') || 'en';
    this.translateService.setDefaultLang(savedLang);
    this.translateService.use(savedLang);
  }

  toggleLanguage() {
    const currentLang = this.translateService.currentLang;
    const newLang = currentLang === 'en' ? 'th' : 'en';

    localStorage.setItem('language', newLang);
    window.location.reload();
  }


  sidebarCollapsed = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenWidth();
  }

  ngOnInit() {
    this.checkScreenWidth();
  }

  checkScreenWidth() {
    if (window.innerWidth <= 864) {
      this.sidebarCollapsed = true;
    } else {
      this.sidebarCollapsed = false;
    }
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  sidebarItems = [
    {
      label: 'sidebar.menu1',
      icon: PrimeIcons.CHART_BAR,
      routerLink: '/dashboard'
    },
    {
      label: 'sidebar.menu2',
      icon: PrimeIcons.USERS,
      routerLink: '/student'
    },
    {
      label: 'sidebar.menu3',
      icon: PrimeIcons.MONEY_BILL,
      routerLink: '/budget'
    },
    {
      label: 'sidebar.menu4',
      icon: PrimeIcons.APPLE,
      routerLink: '/restaurant'
    }
  ];

}
