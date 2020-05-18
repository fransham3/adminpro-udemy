import { Component, OnInit } from '@angular/core';
import { Medico } from 'src/app/models/medico.model';
import { MedicoService } from 'src/app/services/service.index';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];

  pags: boolean = false;

  desde: number = 0;
  

  constructor(
    public _medicoService: MedicoService
  ) { }

  ngOnInit() {
    this.cargarMedicos();
    if (this._medicoService.totalMedicos >= 6) {
      this.pags = true;
    }
  }

  cargarMedicos() {
    this._medicoService.cargarMedicos()
                .subscribe(medicos => this.medicos = medicos);
    
  }

  cambiarDesde(valor: number) {
    let desde = this.desde + valor;
    console.log(desde);

    if (desde >= this._medicoService.totalMedicos) {
      return;
    }

    if (desde < 0) {
      return;
    }

    this.desde += valor;
    this.cargarMedicos();
    
  }

  buscarMedico(termino: string) {

    if (termino.length <= 0) {
      this.cargarMedicos();
      return;
    }
    this._medicoService.buscarMedicos(termino)
              .subscribe(medicos => this.medicos = medicos);
  }

  borrarMedico(medico: Medico) {
    this._medicoService.borrarMedico(medico._id)
              .subscribe(() => this.cargarMedicos());
  }

}
