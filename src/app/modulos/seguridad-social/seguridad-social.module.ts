import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeguridadSocialRoutingModule } from './seguridad-social-routing.module';

import {
  MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule,
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatIconModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SeguridadSocialComponent } from 'src/app/componentes/seguridad-social/seguridad-social.component';
import { SeguridadSocialService } from 'src/app/servicios/seguridad-social.service';
import { SeguridadSocial } from 'src/app/modelos/seguridadSocial';

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
    MatButtonModule,
    MatIconModule,
  ],
  providers: [
    SeguridadSocialService,
    SeguridadSocial
  ]
})
export class SeguridadSocialModule { }
