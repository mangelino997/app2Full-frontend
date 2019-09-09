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
    ClienteService,
    Cliente
  ]
})
export class ClienteModule { }
