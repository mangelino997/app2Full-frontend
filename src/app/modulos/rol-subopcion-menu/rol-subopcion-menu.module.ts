import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolSubopcionMenuRoutingModule } from './rol-subopcion-menu-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatSidenavModule, MatIconModule, MatCheckboxModule, MatButtonModule, MatDialogModule, MatMenuModule, MatDividerModule, MatToolbarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RolSubopcionMenuComponent, UsuarioDialogo, VistaPreviaDialogo, PestaniaDialogo } from 'src/app/componentes/rol-subopcion-menu/rol-subopcion-menu.component';
import { RolSubopcionService } from 'src/app/servicios/rol-subopcion.service';
import { RolService } from 'src/app/servicios/rol.service';
import { ModuloService } from 'src/app/servicios/modulo.service';
import { SubmoduloService } from 'src/app/servicios/submodulo.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@NgModule({
  declarations: [
    RolSubopcionMenuComponent,
    UsuarioDialogo,
    VistaPreviaDialogo,
    PestaniaDialogo
  ],
  imports: [
    CommonModule,
    RolSubopcionMenuRoutingModule,
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
    MatCheckboxModule,
    MatButtonModule,
    MatDialogModule,
    MatMenuModule,
    MatDividerModule,
    MatToolbarModule
  ],
  providers: [
    RolSubopcionService,
    RolService,
    ModuloService,
    SubmoduloService,
    SubopcionPestaniaService,
    UsuarioService
  ],
  entryComponents: [
    UsuarioDialogo,
    VistaPreviaDialogo,
    PestaniaDialogo
  ]
})
export class RolSubopcionMenuModule { }
