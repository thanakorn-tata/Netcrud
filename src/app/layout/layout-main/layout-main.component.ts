import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { PrimeIcons } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { NgFor } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FooterComponent } from '../footer/footer.component';
import { AuthService, User } from '../../services/test/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  routerLink?: string;
  expanded?: boolean;
  submenu?: MenuItem[];
}

@Component({
  selector: 'app-layout-main',
  templateUrl: './layout-main.component.html',
  styleUrls: ['./layout-main.component.scss'],
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
  currentUser: User | null = null;
  isAdmin: boolean = false;
  sidebarCollapsed = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private translateService: TranslateService
  ) {
    const savedLang = localStorage.getItem('language') || 'en';
    this.translateService.setDefaultLang(savedLang);
    this.translateService.use(savedLang);
  }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.isAdmin = this.authService.isAdmin();
    this.checkScreenWidth();
  }

  toggleLanguage(): void {
    const currentLang = this.translateService.currentLang;
    const newLang = currentLang === 'en' ? 'th' : 'en';
    localStorage.setItem('language', newLang);
    window.location.reload();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenWidth();
  }

  checkScreenWidth(): void {
    this.sidebarCollapsed = window.innerWidth <= 864;
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleSubmenu(item: MenuItem): void {
    if (item.submenu) {
      item.expanded = !item.expanded;
    }
  }

  sidebarItems: MenuItem[] = [
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
      label: 'แผนก',
      icon: PrimeIcons.BUILDING,
      expanded: false,
      submenu: [
        {
          label: 'AR soft',
          icon: PrimeIcons.DESKTOP,
          routerLink: '/arsoft'
        },
        {
          label: 'AR DI',
          icon: PrimeIcons.DOLLAR,
          routerLink: '/ardi'
        },
        {
          label: 'Tester',
          icon: PrimeIcons.USER,
          routerLink: '/tester'
        },
        {
          label: 'UX/UI',
          icon: PrimeIcons.CHART_LINE,
          routerLink: '/uxui'
        },
        {
          label: 'Accounting',
          icon: PrimeIcons.SHOPPING_CART,
          routerLink: '/accounting'
        },
        {
          label: 'Human Resources',
          icon: PrimeIcons.SHOPPING_CART,
          routerLink: '/hr'
        }
      ]
    }
  ];

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        this.router.navigate(['/login']);
      }
    });
  }
}
