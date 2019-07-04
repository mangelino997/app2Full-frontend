import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { OrdenVentaService } from 'src/app/servicios/orden-venta.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-eliminar-modal',
  templateUrl: './eliminar-modal.component.html',
  styleUrls: ['./eliminar-modal.component.css']
})
export class EliminarModalComponent implements OnInit {
  dialogRef: any;

  constructor() { }

  ngOnInit() {
  }
}

