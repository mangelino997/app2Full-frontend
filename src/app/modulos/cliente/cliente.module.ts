import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClienteRoutingModule } from './cliente-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatSidenavModule, MatDividerModule, MatIconModule, MatButtonModule, MatDialogModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClienteComponent } from 'src/app/componentes/cliente/cliente.component';
import { TextMaskModule } from 'angular2-text-mask';
import { ClienteService } from 'src/app/servicios/cliente.service';
import { Cliente } from 'src/app/modelos/cliente';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { RolOpcionService } from 'src/app/servicios/rol-opcion.service';
import { BarrioService } from 'src/app/servicios/barrio.service';
import { LocalidadService } from 'src/app/servicios/localidad.service';
import { CobradorService } from 'src/app/servicios/cobrador.service';
import { VendedorService } from 'src/app/servicios/vendedor.service';
import { ZonaService } from 'src/app/servicios/zona.service';
import { RubroService } from 'src/app/servicios/rubro.service';
import { AfipCondicionIvaService } from 'src/app/servicios/afip-condicion-iva.service';
import { TipoDocumentoService } from 'src/app/servicios/tipo-documento.service';
import { ResumenClienteService } from 'src/app/servicios/resumen-cliente.service';
import { SucursalService } from 'src/app/servicios/sucursal.service';
import { SituacionClienteService } from 'src/app/servicios/situacion-cliente.service';
import { CompaniaSeguroService } from 'src/app/servicios/compania-seguro.service';
import { CondicionVentaService } from 'src/app/servicios/condicion-venta.service';
import { UsuarioEmpresaService } from 'src/app/servicios/usuario-empresa.service';
import { CuentaBancariaDialogoComponent } from 'src/app/componentes/cuenta-bancaria-dialogo/cuenta-bancaria-dialogo.component';
import { CuentaBancariaService } from 'src/app/servicios/cuenta-bancaria.service';

@NgModule({
  declarations: [
    ClienteComponent,
    CuentaBancariaDialogoComponent
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
    MatButtonModule,
    MatDialogModule,
    TextMaskModule
  ],
  providers: [
    SubopcionPestaniaService,
    ClienteService,
    BarrioService,
    LocalidadService,
    Cliente,
    RolOpcionService,
    BarrioService,
    LocalidadService,
    CobradorService,
    VendedorService,
    ZonaService,
    RubroService,
    AfipCondicionIvaService,
    TipoDocumentoService,
    ResumenClienteService,
    SucursalService,
    SituacionClienteService,
    CompaniaSeguroService,
    CondicionVentaService,
    UsuarioEmpresaService,
    CuentaBancariaService
  ],
  entryComponents: [
    CuentaBancariaDialogoComponent
  ]
})
export class ClienteModule { }
