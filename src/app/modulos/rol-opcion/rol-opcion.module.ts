import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolOpcionRoutingModule } from './rol-opcion-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatDialogModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RolOpcionComponent, RolOpcionDialog } from 'src/app/componentes/rol-opcion/rol-opcion.component';
import { RolOpcionService } from 'src/app/servicios/rol-opcion.service';

@NgModule({
  declarations: [
    RolOpcionComponent,
    RolOpcionDialog
  ],
  imports: [
    CommonModule,
    RolOpcionRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    MatButtonModule,
    MatDialogModule
  ],
  providers: [
    RolOpcionService
  ],
  entryComponents: [
    RolOpcionDialog
  ]
})
export class RolOpcionModule { }
