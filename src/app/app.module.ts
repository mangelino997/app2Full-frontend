import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatMenuModule, MatToolbarModule, MatDividerModule,
  MatSelectModule, MatTabsModule, MatIconModule, MatCardModule} from '@angular/material';
import { Routes, RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StompConfig, StompService } from '@stomp/ng2-stompjs';

//Servicios
import { AppService } from './servicios/app.service';
import { LoginService } from './servicios/login.service';
import { GuardiaService } from './servicios/guardia.service';
import { UsuarioService } from './servicios/usuario.service';
import { PaisService } from './servicios/pais.service';
import { ProvinciaService } from './servicios/provincia.service';
import { LocalidadService } from './servicios/localidad.service';
import { EmpresaService } from './servicios/empresa.service';
import { PestaniaService } from './servicios/pestania.service';
import { AgendaTelefonicaService } from './servicios/agenda-telefonica.service';
import { AreaService } from './servicios/area.service';
import { BancoService } from './servicios/banco.service';
import { BarrioService } from './servicios/barrio.service';
import { CategoriaService } from './servicios/categoria.service';
import { CobradorService } from './servicios/cobrador.service';
import { CompaniaSeguroService } from './servicios/compania-seguro.service';
import { MarcaProductoService } from './servicios/marca-producto.service';
import { MarcaVehiculoService } from './servicios/marca-vehiculo.service';
import { ModuloService } from './servicios/modulo.service';
import { ObraSocialService } from './servicios/obra-social.service';
import { OrigenDestinoService } from './servicios/origen-destino.service';

//Componentes
import { AppComponent } from './app.component';
import { LoginComponent } from './componentes/login/login.component';
import { PaisComponent } from './componentes/pais/pais.component';
import { HomeComponent } from './componentes/home/home.component';
import { UsuarioComponent } from './componentes/usuario/usuario.component';
import { EmpresaComponent } from './componentes/empresa/empresa.component';
import { PestaniaComponent } from './componentes/pestania/pestania.component';
import { AgendaTelefonicaComponent } from './componentes/agenda-telefonica/agenda-telefonica.component';
import { AreaComponent } from './componentes/area/area.component';
import { BancoComponent } from './componentes/banco/banco.component';
import { BarrioComponent } from './componentes/barrio/barrio.component';
import { CategoriaComponent } from './componentes/categoria/categoria.component';
import { CobradorComponent } from './componentes/cobrador/cobrador.component';
import { CompaniaSeguroComponent } from './componentes/compania-seguro/compania-seguro.component';
import { MarcaProductoComponent } from './componentes/marca-producto/marca-producto.component';
import { MarcaVehiculoComponent } from './componentes/marca-vehiculo/marca-vehiculo.component';
import { ModuloComponent } from './componentes/modulo/modulo.component';
import { ObraSocialComponent } from './componentes/obra-social/obra-social.component';
import { LocalidadComponent } from './componentes/localidad/localidad.component';
import { OrigenDestinoComponent } from './componentes/origen-destino/origen-destino.component';
import { ProvinciaComponent } from './componentes/provincia/provincia.component';

//Rutas
const appRoutes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent, canActivate: [GuardiaService]},
  {path: 'generalespaises', component: PaisComponent, canActivate: [GuardiaService]},
  {path: 'generalesagendatelefonica', component: AgendaTelefonicaComponent, canActivate: [GuardiaService]},
  {path: 'area', component: AreaComponent, canActivate: [GuardiaService]},//Revisar
  {path: 'contablebancos', component: BancoComponent, canActivate: [GuardiaService]},
  {path: 'generalesbarrios', component: BarrioComponent, canActivate: [GuardiaService]},
  {path: 'categoriasadministrar', component: CategoriaComponent, canActivate: [GuardiaService]},
  {path: 'generalescobradores', component: CobradorComponent, canActivate: [GuardiaService]},
  {path: 'companiaseguro', component: CompaniaSeguroComponent, canActivate: [GuardiaService]},//Revisar
  {path: 'generaleslocalidades', component: LocalidadComponent, canActivate: [GuardiaService]},
  {path: 'logisticamarcasproductos', component: MarcaProductoComponent, canActivate: [GuardiaService]},
  {path: 'logisticamarcasvehiculos', component: MarcaVehiculoComponent, canActivate: [GuardiaService]},
  {path: 'menumodulos', component: ModuloComponent, canActivate: [GuardiaService]},
  {path: 'obrassocialesadministrar', component: ObraSocialComponent, canActivate: [GuardiaService]},
  {path: 'origenesdestinosadministrar', component: OrigenDestinoComponent, canActivate: [GuardiaService]},
  {path: 'generalesprovincias', component: ProvinciaComponent, canActivate: [GuardiaService]}
]

const stompConfig: StompConfig = {
  url: 'ws://127.0.0.1:8080/jit/socket',
  headers: {},
  heartbeat_in: 0,
  heartbeat_out: 20000,
  reconnect_delay: 5000,
  debug: true
};

@NgModule({
  declarations: [
    AppComponent,
    PaisComponent,
    LoginComponent,
    HomeComponent,
    UsuarioComponent,
    EmpresaComponent,
    PestaniaComponent,
    AgendaTelefonicaComponent,
    AreaComponent,
    BancoComponent,
    BarrioComponent,
    CategoriaComponent,
    CobradorComponent,
    CompaniaSeguroComponent,
    MarcaProductoComponent,
    MarcaVehiculoComponent,
    ModuloComponent,
    ObraSocialComponent,
    LocalidadComponent,
    OrigenDestinoComponent,
    ProvinciaComponent
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
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
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
    ProvinciaService,
    LocalidadService,
    EmpresaService,
    PestaniaService,
    AgendaTelefonicaService,
    AreaService,
    BancoService,
    BarrioService,
    CategoriaService,
    CobradorService,
    CompaniaSeguroService,
    MarcaProductoService,
    MarcaVehiculoService,
    ModuloService,
    ObraSocialService,
    OrigenDestinoService,
    StompService,
    {
      provide: StompConfig,
      useValue: stompConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
