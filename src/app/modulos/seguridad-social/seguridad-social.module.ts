import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeguridadSocialRoutingModule } from './seguridad-social-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SeguridadSocialComponent } from 'src/app/componentes/seguridad-social/seguridad-social.component';
import { SeguridadSocialService } from 'src/app/servicios/seguridad-social.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';

@NgModule({
  declarations: [
    SeguridadSocialComponent,
  ],
  imports: [
    CommonModule,
    SeguridadSocialRoutingModule,
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
    SeguridadSocialService,
    SubopcionPestaniaService
  ]
})
export class SeguridadSocialModule { }
