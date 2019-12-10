import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgendaTelefonicaRoutingModule } from './agenda-telefonica-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgendaTelefonicaComponent } from 'src/app/componentes/agenda-telefonica/agenda-telefonica.component';
import { AgendaTelefonicaService } from 'src/app/servicios/agenda-telefonica.service';
import { LocalidadService } from 'src/app/servicios/localidad.service';
import { AgendaTelefonica } from 'src/app/modelos/agendaTelefonica';

@NgModule({
  declarations: [
    AgendaTelefonicaComponent,
  ],
  imports: [
    CommonModule,
    AgendaTelefonicaRoutingModule,
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
    MatIconModule,
    MatTooltipModule
  ],
  providers: [
    AgendaTelefonicaService,
    LocalidadService,
    AgendaTelefonica
  ]
})
export class AgendaTelefonicaModule { }
