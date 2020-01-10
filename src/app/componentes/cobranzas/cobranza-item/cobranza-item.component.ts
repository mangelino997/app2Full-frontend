import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cobranza-item',
  templateUrl: './cobranza-item.component.html',
  styleUrls: ['./cobranza-item.component.css']
})
export class CobranzaItemComponent implements OnInit {

   //Define el formulario
   public formulario: FormGroup;
  constructor() { }

  ngOnInit() {
    //inicializa el formulario de Cobranza y sus elementos
    this.formulario = new FormGroup({});
  }

}
