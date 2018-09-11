import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { LoginService } from './login.service';

@Injectable()
export class GuardiaService implements CanActivate {
  logueado:boolean = false;
  constructor(private loginService: LoginService) {
    if(this.loginService.getLogueado()) {
      this.logueado = true;
    } else {
      this.logueado = false;
    }
  }
  public canActivate(): boolean {
    return this.logueado;
  }
}
