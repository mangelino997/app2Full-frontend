import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClienteEventualRoutingModule } from './cliente-eventual-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClienteEventualComponent } from 'src/app/componentes/cliente-eventual/cliente-eventual.component';
import { TextMaskModule } from 'angular2-text-mask';
import { ClienteEventual } from 'src/app/modelos/clienteEventual';

@NgModule({
  declarations: [
    ClienteEventualComponent,
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
    ClienteEventual
  ]
})
export class ClienteEventualModule { }
