import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonalFamiliar } from 'src/app/modelos/personal-familiar';

const routes: Routes = [
  {path: '', component: PersonalFamiliar}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalFamiliarRoutingModule { }
