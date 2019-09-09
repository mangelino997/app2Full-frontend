import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonalRoutingModule } from './personal-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatSidenavModule, MatIconModule, MatDividerModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PersonalComponent } from 'src/app/componentes/personal/personal.component';
import { TextMaskModule } from 'angular2-text-mask';
import { PersonalService } from 'src/app/servicios/personal.service';

@NgModule({
  declarations: [
    PersonalComponent,
  ],
  imports: [
    CommonModule,
    PersonalRoutingModule,
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
    PersonalService
  ]
})
export class PersonalModule { }
