import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'language',
    loadChildren: () => import('./modules/language/language.module').then( m => m.LanguagePageModule)
  },
  {
    path: 'app-tour',
    loadChildren: () => import('./modules/app-tour/app-tour.module').then( m => m.AppTourPageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
