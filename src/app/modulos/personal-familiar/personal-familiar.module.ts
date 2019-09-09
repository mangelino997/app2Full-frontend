import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonalFamiliarRoutingModule } from './personal-familiar-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PersonalFamiliarComponent } from 'src/app/componentes/personal-familiar/personal-familiar.component';
import { TextMaskModule } from 'angular2-text-mask';
import { PersonalFamiliarService } from 'src/app/servicios/personal-familiar.service';

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
    TextMaskModule
  ],
  providers: [
    PersonalFamiliarService
  ]
})
export class PersonalFamiliarModule { }
