import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteEventualRoutingModule } from './cliente-eventual-routing.module';
import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { ClienteEventual } from 'src/app/modelos/clienteEventual';
import { AfipCondicionIvaService } from 'src/app/servicios/afip-condicion-iva.service';
import { TipoDocumentoService } from 'src/app/servicios/tipo-documento.service';
import { BarrioService } from 'src/app/servicios/barrio.service';
import { LocalidadService } from 'src/app/servicios/localidad.service';
import { CobradorService } from 'src/app/servicios/cobrador.service';
import { ZonaService } from 'src/app/servicios/zona.service';
import { RubroService } from 'src/app/servicios/rubro.service';
import { SucursalService } from 'src/app/servicios/sucursal.service';
import { ClienteService } from 'src/app/servicios/cliente.service';

@NgModule({
  declarations: [
    ClienteEventualModule,
  ],
  imports: [
    CommonModule,
    ClienteEventualRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    TextMaskModule
  ],
  providers: [
    ClienteEventual,
    AfipCondicionIvaService,
    TipoDocumentoService,
    BarrioService,
    LocalidadService,
    CobradorService,
    ZonaService,
    RubroService,
    SucursalService,
    ClienteService,
    ClienteEventual,
  ]
})
export class ClienteEventualModule { }
