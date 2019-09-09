import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdelantoPersonalRoutingModule } from './adelanto-personal-routing.module';
import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdelantoPersonalComponent } from 'src/app/componentes/adelanto-personal/adelanto-personal.component';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  declarations: [
    AdelantoPersonalComponent,
  ],
  imports: [
    CommonModule,
    AdelantoPersonalRoutingModule,
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
  ]
})
export class AdelantoPersonalModule { }
