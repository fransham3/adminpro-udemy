import { Component, OnInit } from '@angular/core';
import { resolve } from 'url';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: []
})
export class PromesasComponent implements OnInit {

  constructor() {
    
    this.contarTres().then(
      () => console.log('Termino!')
    )
    .catch(error => console.error('Error en lapromesa', error));
   }

  ngOnInit() {
  }

  contarTres() {
    let promesa = new Promise((resolve, reject) => {
      let contador = 0;
      let itervalo = setInterval( () => {
        contador += 1;
        console.log(contador);
        
        if (contador === 3) {
          resolve(true);
          // reject();
          clearInterval(itervalo);
        }
      }, 1000);
    });

    return promesa;

  }

}
