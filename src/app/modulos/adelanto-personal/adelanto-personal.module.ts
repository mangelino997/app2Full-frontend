import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdelantoPersonalRoutingModule } from './adelanto-personal-routing.module';
import {
  MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule,
  MatSelectModule, MatProgressBarModule, MatDialog, MatButtonModule, MatDialogModule, MatIconModule, MatTooltipModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdelantoPersonalComponent, PrestamoDialogo, DetalleAdelantoDialogo } from 'src/app/componentes/adelanto-personal/adelanto-personal.component';
import { TextMaskModule } from 'angular2-text-mask';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/servicios/loader.service';
import { PersonalAdelanto } from 'src/app/modelos/personalAdelanto';
import { PersonalAdelantoService } from 'src/app/servicios/personal-adelanto.service';
import { PersonalService } from 'src/app/servicios/personal.service';
import { BasicoCategoriaService } from 'src/app/servicios/basico-categoria.service';
import { FechaService } from 'src/app/servicios/fecha.service';

@NgModule({
  declarations: [
    AdelantoPersonalComponent,
    PrestamoDialogo,
    DetalleAdelantoDialogo,
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
    TextMaskModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule
  ],
  providers: [
    ToastrService,
    LoaderService,
    PersonalAdelanto,
    PersonalAdelantoService,
    MatDialog,
    PersonalService,
    BasicoCategoriaService,
    FechaService,
  ],
  entryComponents: [
    PrestamoDialogo,
    DetalleAdelantoDialogo]
})
export class AdelantoPersonalModule { }
