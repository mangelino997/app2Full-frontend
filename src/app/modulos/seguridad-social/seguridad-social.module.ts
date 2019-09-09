import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeguridadSocialRoutingModule } from './seguridad-social-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SeguridadSocialComponent } from 'src/app/componentes/seguridad-social/seguridad-social.component';
import { SeguridadSocialService } from 'src/app/servicios/seguridad-social.service';

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
    MatProgressBarModule
  ],
  providers: [
    SeguridadSocialService
  ]
})
export class SeguridadSocialModule { }
