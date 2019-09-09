import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdelantoLoteRoutingModule } from './adelanto-lote-routing.module';
import { AdelantoLoteComponent } from 'src/app/componentes/adelanto-lote/adelanto-lote.component';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatDialog, MatButtonModule, MatDialogModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { SucursalService } from 'src/app/servicios/sucursal.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/servicios/loader.service';
import { BasicoCategoriaService } from 'src/app/servicios/basico-categoria.service';
import { FechaService } from 'src/app/servicios/fecha.service';
import { CategoriaService } from 'src/app/servicios/categoria.service';
import { PersonalAdelantoService } from 'src/app/servicios/personal-adelanto.service';
import { PersonalAdelanto } from 'src/app/modelos/personalAdelanto';

@NgModule({
  declarations: [
    AdelantoLoteComponent,
  ],
  imports: [
    CommonModule,
    AdelantoLoteRoutingModule,
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
  ],
  providers: [
    SubopcionPestaniaService,
    ToastrService,
    LoaderService,
    MatDialog,
    CategoriaService,
    BasicoCategoriaService,
    FechaService,
    SucursalService,
    PersonalAdelantoService,
    PersonalAdelanto

  ]
})
export class AdelantoLoteModule { }
