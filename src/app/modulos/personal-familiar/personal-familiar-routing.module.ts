import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonalFamiliarComponent } from 'src/app/componentes/personal-familiar/personal-familiar.component';

const routes: Routes = [
  {path: '', component: PersonalFamiliarComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalFamiliarRoutingModule { }
