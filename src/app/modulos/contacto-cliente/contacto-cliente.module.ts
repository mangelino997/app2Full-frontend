import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactoClienteRoutingModule } from './contacto-cliente-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactoClienteComponent } from 'src/app/componentes/contacto-cliente/contacto-cliente.component';
import { ContactoClienteService } from 'src/app/servicios/contacto-cliente.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { ClienteService } from 'src/app/servicios/cliente.service';
import { TipoContactoService } from 'src/app/servicios/tipo-contacto.service';

@NgModule({
  declarations: [
    ContactoClienteComponent,
  ],
  imports: [
    CommonModule,
    ContactoClienteRoutingModule,
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
    MatIconModule
  ],
  providers: [
    ContactoClienteService,
    SubopcionPestaniaService,
    ClienteService,
    TipoContactoService
  ]
})
export class ContactoClienteModule { }