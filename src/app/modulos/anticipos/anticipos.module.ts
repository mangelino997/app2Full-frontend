import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnticiposComponent } from 'src/app/componentes/tesoreria/anticipos/anticipos.component';
import { TesoreriaModule } from 'src/app/shared/tesoreria.module';
import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, MatSelectModule, MatProgressBarModule, MatCheckboxModule, MatIconModule, MatButtonModule, MatDialogModule, MatRadioModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';



@NgModule({
  declarations: [
    AnticiposComponent
  ],
  imports: [
    TesoreriaModule,
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
    MatCheckboxModule,
    MatIconModule,
    TextMaskModule,
    MatButtonModule,
    MatDialogModule,
    MatRadioModule,
  ],
  providers: [
  ],
  entryComponents: [
  ],
})
export class AnticiposModule { }
