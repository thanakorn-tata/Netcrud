import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader'; // Make sure 'ngx-ui-loader' is installed
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng-buddhist-year-datepicker'; // Make sure 'primeng-buddhist-year-datepicker' is installed
import { ChipModule } from 'primeng/chip';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { PasswordModule } from 'primeng/password';
import { SliderModule } from 'primeng/slider';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';
import { DataViewModule } from 'primeng/dataview';
import { ListboxModule } from 'primeng/listbox';
import { OrderListModule } from 'primeng/orderlist';
import { PickListModule } from 'primeng/picklist';
import { GalleriaModule } from 'primeng/galleria';
import { CarouselModule } from 'primeng/carousel';
import { ImageModule } from 'primeng/image';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ContextMenuModule } from 'primeng/contextmenu';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { StepperModule } from 'primeng/stepper';
import { TabsModule } from 'primeng/tabs';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenubarModule } from 'primeng/menubar';
import { PanelModule } from 'primeng/panel';
import { AccordionModule } from 'primeng/accordion';
import { ChartModule } from 'primeng/chart';
import { TreeModule } from 'primeng/tree';
import { DialogModule } from 'primeng/dialog';
import { PopoverModule } from 'primeng/popover';
import { DrawerModule } from 'primeng/drawer';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { OverlayModule } from 'primeng/overlay';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TranslateModule } from '@ngx-translate/core';
import { DividerModule } from 'primeng/divider';

@NgModule({
    exports: [
        CommonModule,
        FormsModule,
        NgxUiLoaderModule,
        /* 📋 Input Components */
        InputTextModule,
        TextareaModule,
        InputNumberModule,
        DatePickerModule,
        ChipModule,
        SelectModule,
        MultiSelectModule,
        AutoCompleteModule,
        PasswordModule,
        SliderModule,
        ToggleSwitchModule,
        ColorPickerModule,
        /* ✅ Button & Toggles */
        ButtonModule,
        SplitButtonModule,
        ToggleButtonModule,
        CheckboxModule,
        RadioButtonModule,
        /* 📊 Data Display */
        TableModule,
        TreeTableModule,
        DataViewModule,
        ListboxModule,
        OrderListModule,
        PickListModule,
        GalleriaModule,
        CarouselModule,
        ImageModule,
        AvatarModule,
        BadgeModule,
        TooltipModule,
        /* 🧭 Menus & Navigation */
        MenuModule,
        TieredMenuModule,
        ContextMenuModule,
        BreadcrumbModule,
        StepperModule,
        TabsModule,
        PanelMenuModule,
        MegaMenuModule,
        SliderModule,
        MenubarModule,
        PanelModule,
        AccordionModule,
        /* 📊 Charts & Visualizations */
        ChartModule,
        TreeModule,
        /* 🖥️ Overlays & Dialogs */
        DialogModule,
        PopoverModule,
        DrawerModule,
        ConfirmPopupModule,
        ConfirmDialogModule,
        OverlayModule,
        OverlayBadgeModule,
        /* 📦 File & Upload */
        FileUploadModule,
        /* ⏳ Progress & Notifications */
        ProgressBarModule,
        SkeletonModule,
        ToastModule,
        /* 🗃️ Miscellaneous */
        TagModule,
        ScrollPanelModule,
        DividerModule,
        /** Add On */

        TranslateModule
    ]
})
export class PrimeNgSharedModule {
}
