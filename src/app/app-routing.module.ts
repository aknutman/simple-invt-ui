import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ItemsComponent } from '../app/items/items.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/items',
    pathMatch: 'full',
  },
  {
    path: 'items',
    component: ItemsComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
