import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolSubopcionRoutingModule } from './rol-subopcion-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatSidenavModule, MatButtonModule, MatDialogModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RolSubopcionComponent, RolSubopcionDialog } from 'src/app/componentes/rol-subopcion/rol-subopcion.component';
import { RolSubopcionService } from 'src/app/servicios/rol-subopcion.service';

@NgModule({
  declarations: [
    RolSubopcionComponent,
    RolSubopcionDialog
  ],
  imports: [
    CommonModule,
    RolSubopcionRoutingModule,
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
    MatButtonModule,
    MatDialogModule
  ],
  providers: [
    RolSubopcionService
  ],
  entryComponents: [
    RolSubopcionDialog
  ]
})
export class RolSubopcionModule { }
