import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactoBancoRoutingModule } from './contacto-banco-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactoBancoComponent } from 'src/app/componentes/contacto-banco/contacto-banco.component';
import { ContactoBancoService } from 'src/app/servicios/contacto-banco.service';
import { SucursalBancoService } from 'src/app/servicios/sucursal-banco.service';
import { ContactoBanco } from 'src/app/modelos/contactoBanco';

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
    MatButtonModule,
    MatIconModule
  ],
  providers: [
    ContactoBancoService,
    SucursalBancoService,
    ContactoBanco
  ]
})
export class ContactoBancoModule { }
