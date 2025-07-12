import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { getPaginatedHeaders, getPaginatedResult } from './PaginatiomHelpers';
import { ParsedVariable } from '@angular/compiler';
import { Messages } from 'src/Models/messages';


@Injectable({
  providedIn: 'root'
})
export class MessaageService {
  baseUrl = environment.apiUrl;

  constructor(private http:HttpClient) { }
  getMessages(pageNumber:number, pageSize : number, container:string){
    let params = getPaginatedHeaders(pageNumber, pageSize);
    params = params.append('container', container);
    return getPaginatedResult<Messages[]>(this.baseUrl + 'Message', params, this.http);
  }
}
