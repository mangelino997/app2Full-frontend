import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonalFamiliarRoutingModule } from './personal-familiar-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PersonalFamiliarComponent } from 'src/app/componentes/personal-familiar/personal-familiar.component';
import { TextMaskModule } from 'angular2-text-mask';
import { PersonalFamiliarService } from 'src/app/servicios/personal-familiar.service';
import { PersonalService } from 'src/app/servicios/personal.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { PersonalFamiliar } from 'src/app/modelos/personal-familiar';
import { LocalidadService } from 'src/app/servicios/localidad.service';
import { SexoService } from 'src/app/servicios/sexo.service';
import { TipoDocumentoService } from 'src/app/servicios/tipo-documento.service';
import { MesService } from 'src/app/servicios/mes.service';
import { TipoFamiliarService } from 'src/app/servicios/tipo-familiar.service';

@NgModule({
  declarations: [
    PersonalFamiliarComponent,
  ],
  imports: [
    CommonModule,
    PersonalFamiliarRoutingModule,
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
    TextMaskModule,
    MatIconModule
  ],
  providers: [
    PersonalFamiliarService,
    PersonalService,
    PersonalFamiliar,
    LocalidadService,
  ]
})
export class PersonalFamiliarModule { }
