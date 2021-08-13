import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddFolderModalPage } from './add-folder-modal.page';

const routes: Routes = [
  {
    path: '',
    component: AddFolderModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddFolderModalPageRoutingModule {}
