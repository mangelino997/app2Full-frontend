import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatMenuModule, MatToolbarModule, MatDividerModule, MatSelectModule, MatTabsModule, MatIconModule, MatCardModule} from '@angular/material';
import { Routes, RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//Servicios
import { AppService } from './servicios/app.service';
import { LoginService } from './servicios/login.service';
import { GuardiaService } from './servicios/guardia.service';
import { UsuarioService } from './servicios/usuario.service';
import { PaisService } from './servicios/pais.service';
import { EmpresaService } from './servicios/empresa.service';
import { PestaniaService } from './servicios/pestania.service';

//Componentes
import { AppComponent } from './app.component';
import { LoginComponent } from './componentes/login/login.component';
import { PaisComponent } from './componentes/pais/pais.component';
import { HomeComponent } from './componentes/home/home.component';
import { UsuarioComponent } from './componentes/usuario/usuario.component';
import { EmpresaComponent } from './componentes/empresa/empresa.component';
import { PestaniaComponent } from './componentes/pestania/pestania.component';

//Rutas
const appRoutes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent, canActivate: [GuardiaService]},
  {path: 'generalespaises', component: PaisComponent, canActivate: [GuardiaService]}
]

@NgModule({
  declarations: [
    AppComponent,
    PaisComponent,
    LoginComponent,
    HomeComponent,
    UsuarioComponent,
    EmpresaComponent,
    PestaniaComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatMenuModule,
    MatToolbarModule,
    MatDividerModule,
    MatSelectModule,
    MatTabsModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule,
    NgbModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  providers: [
    AppService,
    LoginService,
    GuardiaService,
    UsuarioService,
    PaisService,
    EmpresaService,
    PestaniaService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
