import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-reparto-comprobante',
  templateUrl: './reparto-comprobante.component.html',
  styleUrls: ['./reparto-comprobante.component.css']
})
export class RepartoComprobanteComponent implements OnInit {

  //Define el formulario General
  public formularioComprobante: FormGroup;
  constructor() { }

  ngOnInit() {
  }

}
