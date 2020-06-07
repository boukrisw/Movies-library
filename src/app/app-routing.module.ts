import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountComponent } from './account/account.component';
import { FilmsComponent } from './films/films.component';
import { ActivityComponent } from './activity/activity.component';
import { DetailsfilmComponent } from './detailsfilm/detailsfilm.component';

const routes: Routes = [
  {path: '' , component: FilmsComponent},
  {path: 'account' , component: AccountComponent},
  {path: 'activity' , component: ActivityComponent},
  {path: 'details' , component: DetailsfilmComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


export const routingComponents = [AccountComponent,FilmsComponent,ActivityComponent,DetailsfilmComponent ]