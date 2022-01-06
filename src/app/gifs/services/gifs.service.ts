import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'//esto ayuda a que sea global
})
export class GifsService {

  private apiKey:string = 'CV0Tt4S8ZTNn3AqZIDhynOdcQ2gtYjce';
  private servicioUrl:string = 'https://api.giphy.com/v1/gifs';
  private _historial: string[] = [];
  
  public resultados:Gif[] = [];

  get historial() {
    return [...this._historial];
  }

  constructor(private http:HttpClient){

    //Le decimos que nos regrese el arreglo y si no hay nos regrese un arreglo nulo
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    //this._historial = localStorage.getItem('historial');
    //
    //if(localStorage.getItem('historial')){
     // this._historial = JSON.parse(localStorage.getItem('historial')!);//Aqui el signo de admiracion lo que dice es que por favor confie en nosotros
    //}
    //Resultado
    this.resultados = JSON.parse(localStorage.getItem('resultado')!) || [];
  }

  buscarGifs(query: string) {

    query = query.trim().toLocaleLowerCase();
    if (!this._historial.includes(query)) {
      this._historial.unshift(query);
      this._historial = this._historial.splice(0, 10); //Este es para solo guardar 10 valores
      localStorage.setItem('historial', JSON.stringify(this._historial));
    }
    const params = new HttpParams()
    .set('api_key', this.apiKey)
    .set('limit', '10')
    .set('q', query);

    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`, {params})
    .subscribe( (res)=>{
      this.resultados = res.data;
      localStorage.setItem('resultado', JSON.stringify(this.resultados));
    })
  }
}
