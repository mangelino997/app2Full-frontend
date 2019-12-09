import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Foto } from './foto';
import { Pdf } from './pdf';
import { Injectable } from '@angular/core';
//Define la entidad de la base de datos.
@Injectable()
export class Personal {
    //define un formulario FormGroup
    public formulario: FormGroup;
    //constructor
    constructor(private foto: Foto, private pdf: Pdf) {
        // crear el formulario para la seccion de modulos
        this.formulario = new FormGroup({
            id: new FormControl(),
            version: new FormControl(),
            nombre: new FormControl('', [Validators.required, Validators.maxLength(22)]),
            apellido: new FormControl('', [Validators.required, Validators.maxLength(22)]),
            nombreCompleto: new FormControl('', [Validators.maxLength(40)]),
            tipoDocumento: new FormControl('', Validators.required),
            numeroDocumento: new FormControl('', [Validators.required]),
            cuil: new FormControl('', [Validators.required]),
            empresa: new FormControl(),
            domicilio: new FormControl('', [Validators.required, Validators.maxLength(60)]),
            barrio: new FormControl(),
            localidad: new FormControl('', Validators.required),
            localidadNacimiento: new FormControl('', Validators.required),
            fechaNacimiento: new FormControl('', Validators.required),
            telefonoFijo: new FormControl('', Validators.maxLength(45)),
            telefonoMovil: new FormControl('', Validators.maxLength(45)),
            estadoCivil: new FormControl('', Validators.required),
            correoelectronico: new FormControl('', Validators.maxLength(30)),
            sexo: new FormControl('', Validators.required),
            sucursal: new FormControl('', Validators.required),
            area: new FormControl('', Validators.required),
            fechaInicio: new FormControl('', Validators.required),
            fechaFin: new FormControl(),
            antiguedadAntAnio: new FormControl(),
            antiguedadAntMes: new FormControl(),
            esJubilado: new FormControl(),
            esMensualizado: new FormControl(),
            categoria: new FormControl('', Validators.required),
            obraSocial: new FormControl('', Validators.required),
            sindicato: new FormControl('', Validators.required),
            seguridadSocial: new FormControl('', Validators.required),
            afipSituacion: new FormControl('', Validators.required),
            afipCondicion: new FormControl('', Validators.required),
            afipActividad: new FormControl('', Validators.required),
            afipModContratacion: new FormControl('', Validators.required),
            afipLocalidad: new FormControl('', Validators.required),
            afipSiniestrado: new FormControl('', Validators.required),
            adherenteObraSocial: new FormControl(),
            aporteAdicObraSocial: new FormControl(),
            contribAdicObraSocial: new FormControl(),
            aporteAdicSegSoc: new FormControl(),
            aporteDifSegSoc: new FormControl(),
            contribTareaDifSegSoc: new FormControl(),
            enConvenioColectivo: new FormControl('', Validators.required),
            conCoberturaSCVO: new FormControl('', Validators.required),
            recibeAdelanto: new FormControl('', Validators.required),
            recibePrestamo: new FormControl('', Validators.required),
            cuotasPrestamo: new FormControl(),
            usuarioAlta: new FormControl(),
            usuarioBaja: new FormControl(),
            usuarioMod: new FormControl(),
            vtoLicenciaConducir: new FormControl(),
            vtoCurso: new FormControl(),
            vtoCursoCargaPeligrosa: new FormControl(),
            vtoLINTI: new FormControl(),
            vtoLibretaSanidad: new FormControl(),
            vtoPsicoFisico: new FormControl(),
            usuarioModLC: new FormControl(),
            usuarioModCurso: new FormControl(),
            usuarioModCursoCP: new FormControl(),
            usuarioModLINTI: new FormControl(),
            usuarioModLS: new FormControl(),
            fechaModLC: new FormControl(),
            fechaModCurso: new FormControl(),
            fechaModCursoCP: new FormControl(),
            fechaModLINTI: new FormControl(),
            fechaModLS: new FormControl(),
            talleCamisa: new FormControl('', Validators.maxLength(20)),
            tallePantalon: new FormControl('', Validators.maxLength(20)),
            talleCalzado: new FormControl('', Validators.maxLength(20)),
            turnoMEntrada: new FormControl(),
            turnoMSalida: new FormControl(),
            turnoTEntrada: new FormControl(),
            turnoTSalida: new FormControl(),
            turnoNEntrada: new FormControl(),
            turnoNSalida: new FormControl(),
            turnoSEntrada: new FormControl(),
            turnoSSalida: new FormControl(),
            turnoDEntrada: new FormControl(),
            turnoDSalida: new FormControl(),
            turnoRotativo: new FormControl(),
            turnoFueraConvenio: new FormControl(),
            telefonoMovilEmpresa: new FormControl('', Validators.maxLength(45)),
            telefonoMovilFechaEntrega: new FormControl(),
            telefonoMovilFechaDevolucion: new FormControl(),
            telefonoMovilObservacion: new FormControl('', Validators.maxLength(100)),
            esChofer: new FormControl('', Validators.required),
            esChoferLargaDistancia: new FormControl('', Validators.required),
            esAcompReparto: new FormControl('', Validators.required),
            observaciones: new FormControl('', Validators.maxLength(200)),
            alias: new FormControl('', Validators.maxLength(100)),
            estaActiva: new FormControl('', Validators.required),
            foto: this.foto.formulario,
            pdfLicConducir: this.pdf.crearFormulario(),
            pdfLibSanidad: this.pdf.crearFormulario(),
            pdfLinti: this.pdf.crearFormulario(),
            pdfDni: this.pdf.crearFormulario(),
            pdfAltaTemprana: this.pdf.crearFormulario()
        })
    }
}