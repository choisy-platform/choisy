import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppTourPage } from './app-tour.page';

const routes: Routes = [
  {
    path: '',
    component: AppTourPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppTourPageRoutingModule {}
