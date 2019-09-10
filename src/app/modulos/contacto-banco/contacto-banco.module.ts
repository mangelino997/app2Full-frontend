import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactoBancoRoutingModule } from './contacto-banco-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactoBancoComponent } from 'src/app/componentes/contacto-banco/contacto-banco.component';
import { ContactoBancoService } from 'src/app/servicios/contacto-banco.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { SucursalBancoService } from 'src/app/servicios/sucursal-banco.service';
import { TipoContactoService } from 'src/app/servicios/tipo-contacto.service';

@NgModule({
  declarations: [
    ContactoBancoComponent,
  ],
  imports: [
    CommonModule,
    ContactoBancoRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    MatButtonModule
  ],
  providers: [
    ContactoBancoService,
    SubopcionPestaniaService,
    SucursalBancoService,
    TipoContactoService
  ]
})
export class ContactoBancoModule { }
