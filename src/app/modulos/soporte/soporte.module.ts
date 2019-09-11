import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SoporteRoutingModule } from './soporte-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButton, MatButtonModule, MatDialogModule, MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SoporteComponent } from 'src/app/componentes/soporte/soporte.component';
import { SoporteService } from 'src/app/servicios/soporte.service';
import { Soporte } from 'src/app/modelos/soporte';
import { EmpresaService } from 'src/app/servicios/empresa.service';
import { ModuloService } from 'src/app/servicios/modulo.service';
import { SubopcionService } from 'src/app/servicios/subopcion.service';
import { SubmoduloService } from 'src/app/servicios/submodulo.service';
import { BugImagenService } from 'src/app/servicios/bug-imagen.service';
import { BugImagenDialogoComponent } from 'src/app/componentes/bugImagen-dialogo/bug-imagen-dialogo.component';
import { BugImagen } from 'src/app/modelos/bugImagen';

@NgModule({
  declarations: [
    SoporteComponent,
    BugImagenDialogoComponent
  ],
  imports: [
    CommonModule,
    SoporteRoutingModule,
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
    MatDialogModule,
    MatIconModule
  ],
  providers: [
    SoporteService,
    Soporte,
    EmpresaService,
    ModuloService,
    SubopcionService,
    SubmoduloService,
    BugImagenService,
    BugImagen
  ],
  entryComponents: [
    BugImagenDialogoComponent
  ]
})
export class SoporteModule { }
