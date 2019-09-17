import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatIconModule, MatDividerModule, MatButtonModule, MatDialogModule } from '@angular/material';
import { TextMaskModule } from 'angular2-text-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViajeCombustible } from 'src/app/modelos/viajeCombustible';
import { ProveedorService } from 'src/app/servicios/proveedor.service';
import { InsumoProductoService } from 'src/app/servicios/insumo-producto.service';
import { ViajeCombustibleService } from 'src/app/servicios/viaje-combustible';
@NgModule({
  declarations: [
    OrdenCombustibleModule
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatDialogModule,
    TextMaskModule,
  ],
  providers: [
    ViajeCombustible,
    ProveedorService,
    InsumoProductoService,
    ViajeCombustibleService,
    

  ],
})
export class OrdenCombustibleModule { }