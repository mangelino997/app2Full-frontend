import { Component } from '@angular/core';
import { UsuarioService } from '../../servicios/usuario.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html'
})
export class UsuarioComponent {

  //Constructor
  constructor(private usuarioService: UsuarioService) { }

}
