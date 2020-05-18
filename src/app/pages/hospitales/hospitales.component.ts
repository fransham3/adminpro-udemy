import { Component, OnInit } from '@angular/core';
import { Hospital } from 'src/app/models/hospital.model';
import { HospitalService } from 'src/app/services/service.index';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';
import Swal from 'sweetalert2';
import swal from 'sweetalert';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html'
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];

  desde: number = 0;
  totalRegistros: number = 0;

  cargando: boolean = true;

  constructor(
    public _hospitalService: HospitalService,
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarHospitales();

    this._modalUploadService.notificacion
                  .subscribe(resp => this.cargarHospitales());
  }

  mostrarModal(id: string) {

    this._modalUploadService.mostrarModal('hospitales', id);

  }

  
  guardarhospital(hospital: Hospital) {
    this._hospitalService.actualizarHospital(hospital)
    .subscribe();
  }
  
  borrarhospital(hospital: Hospital) {
    this._hospitalService.borrarHospital(hospital._id)
    .subscribe(() => this.cargarHospitales());
  }
  
  async crearHospital() {
    const ipAPI = '//api.ipify.org?format=json'
    
    const inputValue = fetch(ipAPI)
    .then(response => response.json())
    .then(data => data.ip)
    
    const { value: nombreHosp } = await Swal.fire({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del hospital',
      input: 'text',
      inputValue: inputValue,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'Tienes que escribir algo!';
        }
      }
    })
    
    if (nombreHosp) {
      this._hospitalService.crearHospital(nombreHosp)
                    .subscribe(() => this.cargarHospitales());
      Swal.fire(`<span class="text-themecolor">${nombreHosp} </span> -- añadido`);
    }
    
    // Swal.fire({
      //   title: '',
      //   text: '',
      //   cotent
    // });
  }

  cargarHospitales() {
    
    this.cargando = true;
    
    this._hospitalService.cargarHospitales(this.desde)
                  .subscribe(hospitales => {
                    this.hospitales = hospitales;
                    this.totalRegistros = hospitales.total;
                  });
  }
  
  cambiarDesde(valor: number) {
    let desde = this.desde + valor;
    console.log(desde);

    if (desde >= this.totalRegistros) {
      return;
    }

    if (desde < 0) {
      return;
    }

    this.desde += valor;
    this.cargarHospitales();
    
  }

  buscarHospital(termino: string) {
    
    if (termino.length <= 0) {
      this.cargarHospitales();
      return;
    }
    
    this.cargando = true;
    
    this._hospitalService.buscarHospital(termino)
                      .subscribe((hospitales: Hospital[]) => {
                        
                        this.hospitales = hospitales;
                        this.cargando = false;
                        
                      });
    
  }

}
