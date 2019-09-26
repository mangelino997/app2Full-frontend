import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdenRecoleccionRoutingModule } from './orden-recoleccion-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatIconModule, MatDividerModule, MatButtonModule, MatDialogModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrdenRecoleccionComponent } from 'src/app/componentes/orden-recoleccion/orden-recoleccion.component';
import { TextMaskModule } from 'angular2-text-mask';
import { OrdenRecoleccionService } from 'src/app/servicios/orden-recoleccion.service';
import { OrdenRecoleccion } from 'src/app/modelos/ordenRecoleccion';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { LocalidadService } from 'src/app/servicios/localidad.service';
import { ClienteService } from 'src/app/servicios/cliente.service';
import { BarrioService } from 'src/app/servicios/barrio.service';
import { SucursalService } from 'src/app/servicios/sucursal.service';
import { ClienteEventualComponent } from 'src/app/componentes/cliente-eventual/cliente-eventual.component';
import { AfipCondicionIvaService } from 'src/app/servicios/afip-condicion-iva.service';
import { TipoDocumentoService } from 'src/app/servicios/tipo-documento.service';
import { ZonaService } from 'src/app/servicios/zona.service';
import { RubroService } from 'src/app/servicios/rubro.service';
import { ClienteEventual } from 'src/app/modelos/clienteEventual';
import { CobradorService } from 'src/app/servicios/cobrador.service';

@NgModule({
  declarations: [
    OrdenRecoleccionComponent,
    ClienteEventualComponent,
    
  ],
  imports: [
    CommonModule,
    OrdenRecoleccionRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatDialogModule,
    TextMaskModule,
  ],
  providers: [
    OrdenRecoleccionService,
    OrdenRecoleccion,
    SubopcionPestaniaService,
    LocalidadService,
    ClienteService,
    BarrioService,
    SucursalService,
    ClienteService,
    AfipCondicionIvaService,
    TipoDocumentoService,
    CobradorService,
    ZonaService,
    RubroService,
    ClienteEventual
  ],
  entryComponents: [
    ClienteEventualComponent,
    
  ]
})
export class OrdenRecoleccionModule { }
