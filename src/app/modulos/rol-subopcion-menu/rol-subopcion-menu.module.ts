import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolSubopcionMenuRoutingModule } from './rol-subopcion-menu-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatSidenavModule, MatIconModule, MatCheckboxModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RolSubopcionMenuComponent } from 'src/app/componentes/rol-subopcion-menu/rol-subopcion-menu.component';

@NgModule({
  declarations: [
    RolSubopcionMenuComponent,
  ],
  imports: [
    CommonModule,
    RolSubopcionMenuRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatIconModule,
    MatCheckboxModule
  ]
})
export class RolSubopcionMenuModule { }
