import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CobradorRoutingModule } from './cobrador-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
<<<<<<< HEAD
  MatSelectModule, MatProgressBarModule, MatDialogModule, MatButtonModule, MatIconModule } from '@angular/material';
=======
  MatSelectModule, MatProgressBarModule, MatDialogModule, MatButtonModule, MatDialog, MatDividerModule } from '@angular/material';
>>>>>>> b3cee1458e9c9c8a1cab36e13ac19dfddc6fd205
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CobradorComponent, CambiarCobradorPrincipalDialogo } from 'src/app/componentes/cobrador/cobrador.component';
import { CobradorService } from 'src/app/servicios/cobrador.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { Cobrador } from 'src/app/modelos/cobrador';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/servicios/loader.service';

@NgModule({
  declarations: [
    CobradorComponent,
    CambiarCobradorPrincipalDialogo
  ],
  imports: [
    CommonModule,
    CobradorRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    MatDialogModule,
    MatButtonModule,
<<<<<<< HEAD
    MatIconModule
=======
    MatDividerModule

>>>>>>> b3cee1458e9c9c8a1cab36e13ac19dfddc6fd205
  ],
  providers: [
    CobradorService,
    SubopcionPestaniaService,
    ToastrService,
    LoaderService,
    MatDialog,
    CobradorService,
    Cobrador
  ],
  entryComponents: [
    CambiarCobradorPrincipalDialogo
  ]
})
export class CobradorModule { }
