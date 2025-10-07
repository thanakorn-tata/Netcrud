import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core'; 
import { HardwareITequipmentComponent } from './hardware-itequipment/hardware-itequipment.component';
import { SoftwareApplicationsComponent } from './software-applications/software-applications.component';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { TabsModule } from 'primeng/tabs';

interface Time_duration {
  time: string;
  key: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TabsModule, TranslateModule, HardwareITequipmentComponent, SoftwareApplicationsComponent, FormsModule, Select, TooltipModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  times: Time_duration[] = [];
  selectedtime: Time_duration | undefined;

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    this.translate.get(['dashboard.other.timesec', 'dashboard.other.timehour']).subscribe(translations => {
      this.times = [
        { time: `5 ${translations['dashboard.other.timesec']}`, key: '0' },
        { time: `10 ${translations['dashboard.other.timesec']}`, key: '1' },
        { time: `15 ${translations['dashboard.other.timesec']}`, key: '2' },
        { time: `20 ${translations['dashboard.other.timesec']}`, key: '3' },
        { time: `25 ${translations['dashboard.other.timesec']}`, key: '4' },
        { time: `30 ${translations['dashboard.other.timesec']}`, key: '5' },
        { time: `1 ${translations['dashboard.other.timehour']}`, key: '6' },
        { time: `4 ${translations['dashboard.other.timehour']}`, key: '7' },
        { time: `8 ${translations['dashboard.other.timehour']}`, key: '8' },
        { time: `24 ${translations['dashboard.other.timehour']}`, key: '9' },
      ];
      this.selectedtime = this.times[0];
    });
  }
}
