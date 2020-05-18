import { Injectable } from '@angular/core';
import { Hospital } from 'src/app/models/hospital.model';
import { URL_SERVICIOS } from 'src/app/config/config';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../service.index';
import { map } from 'rxjs/internal/operators/map';
import swal from 'sweetalert';
import { UsuarioService } from '../usuario/usuario.service';


@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  totalHospitales: number = 0;

  hospital: Hospital;

  constructor(
    public http: HttpClient,
    public router: Router,
    public _usuarioService: UsuarioService,
    public _subirArchivoService: SubirArchivoService
  ) { }

  actualizarHospital(hospital: Hospital) {
    let url = URL_SERVICIOS + '/hospital/' + hospital._id;
    url += '?token=' + this._usuarioService.token;

    return this.http.put (url, hospital)
              .pipe(map((resp: any) => {
                swal('Hospital actualizado', hospital.nombre, 'success');
                return resp.hospital;
              }));
  }

  cambiarImagen(archivo: File, id: string) {

    this._subirArchivoService.subirArchivo(archivo, 'hospitales', id)
          .then((resp: any) => {
            
            this.hospital.img = resp.hospital.img;
            swal('Imagen actualizada', this.hospital.nombre, 'success');
            
          })
          .catch(resp => {
            console.log(resp);
          });

   }

  cargarHospitales(desde: number = 0) {

    let url = URL_SERVICIOS + '/hospital?desde=' + desde;
    return this.http.get(url)
          .pipe(map((resp: any) => {
              this.totalHospitales = resp.total;
              return resp.hospitales;
              }));
   }

   obtenerHospital(id: string) {
      let url = URL_SERVICIOS + '/hospital/' + id;
      return this.http.get(url)
        .pipe(map((resp: any) => resp.hospital));
   }

   borrarHospital(id: string) {
    let url = URL_SERVICIOS + '/hospital/' + id;
    url += '?token=' + this._usuarioService.token;

    return this.http.delete(url)
            .pipe(map(resp => swal('Hospital eliminado', 'Borrado correctamente', 'success')));
   }

   crearHospital(nombre: string) {
    let url = URL_SERVICIOS + '/hospital/';
    url += '?token=' + this._usuarioService.token;

    return this.http.post(url, {nombre})
         .pipe(map((resp: any) => resp.hospital));
   }

   buscarHospital(termino: string) {
     let url = URL_SERVICIOS + '/busqueda/coleccion/hospitales/' + termino;
     return this.http.get(url)
               .pipe(map((resp: any) => resp.hospitales));
   }
}
