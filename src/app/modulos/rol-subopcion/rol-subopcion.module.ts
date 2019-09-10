import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolSubopcionRoutingModule } from './rol-subopcion-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatSidenavModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RolSubopcionComponent } from 'src/app/componentes/rol-subopcion/rol-subopcion.component';
import { RolSubopcionService } from 'src/app/servicios/rol-subopcion.service';

@NgModule({
  declarations: [
    RolSubopcionComponent,
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
    MatButtonModule
  ],
  providers: [
    RolSubopcionService
  ]
})
export class RolSubopcionModule { }
