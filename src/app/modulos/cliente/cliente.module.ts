import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClienteRoutingModule } from './cliente-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatSidenavModule, MatDividerModule, MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClienteComponent } from 'src/app/componentes/cliente/cliente.component';
import { TextMaskModule } from 'angular2-text-mask';
import { ClienteService } from 'src/app/servicios/cliente.service';
import { Cliente } from 'src/app/modelos/cliente';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { RolOpcionService } from 'src/app/servicios/rol-opcion.service';
import { BarrioService } from 'src/app/servicios/barrio.service';
import { LocalidadService } from 'src/app/servicios/localidad.service';

@NgModule({
  declarations: [
    ClienteComponent,
  ],
  imports: [
    CommonModule,
    ClienteRoutingModule,
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
    MatDividerModule,
    TextMaskModule
  ],
  providers: [
    SubopcionPestaniaService,
    RolOpcionService,
    ClienteService,
    BarrioService,
    LocalidadService,
    Cliente,
  ]
})
export class ClienteModule { }
