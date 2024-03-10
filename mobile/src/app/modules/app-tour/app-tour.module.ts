import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppTourPageRoutingModule } from './app-tour-routing.module';

import { AppTourPage } from './app-tour.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppTourPageRoutingModule
  ],
  declarations: [AppTourPage]
})
export class AppTourPageModule {}
