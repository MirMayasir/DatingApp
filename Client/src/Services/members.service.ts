import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Members } from 'src/Models/members';
import { PaginatedResult } from 'src/Models/pagination';
import { UserParams } from 'src/Models/userParams';
import { getPaginatedHeaders, getPaginatedResult } from './PaginatiomHelpers';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members : Members [] = [];
  constructor(private http : HttpClient) { }

  // getMembers(){

  //   if(this.members.length > 0){
  //     return of(this.members);
  //   }
  //   return this.http.get<Members[]>(this.baseUrl + 'User').pipe(
  //     map(mem => {
  //       this.members=mem;
  //       return this.members
  //     })
  //   )
  // }

  getMembers(userPrams : UserParams){
    let params = getPaginatedHeaders(userPrams.pageNumber, userPrams.pageSize);

    params = params.append('minAge', userPrams.minAge);
    params = params.append('maxAge', userPrams.maxAge);
    params = params.append('gender', userPrams.gender);
    params = params.append('orderBy', userPrams.orderBy);
    return getPaginatedResult<Members[]>(this.baseUrl + 'User', params, this.http)
  }


  addLike(username : string){
    return this.http.post(this.baseUrl + 'Likes/' + username, {});
  }

  getLikes(predicate : string, pageNumber: number, pageSize:number){
    let params = getPaginatedHeaders(pageNumber, pageSize);
    params = params.append('predicate', predicate);

    return getPaginatedResult<Members[]>(this.baseUrl + 'Likes', params, this.http);
    // return this.http.get<Members[]>(this.baseUrl + 'Likes?predicate=' + predicate);
  }

  getMember(username: string){

    const member = this.members.find(x=> x.userName === username);
    if(member){
      return of(member);
    }
    return this.http.get<Members>(this.baseUrl + 'User/' + username);
  }

  updateMember(member : Members){
    return this.http.put(this.baseUrl + 'User', member).pipe(
      map(() =>{
        const index = this.members.indexOf(member);
        this.members[index] = {...this.members[index], ...member}
      })
    )
  }

  setMainPhoto(photoId : number){
    return this.http.put(this.baseUrl + 'User/set-main-photo/' + photoId ,{})
  }

  deletePhoto(publicId:number){
    return this.http.delete(this.baseUrl + 'User/delete-photo/' + publicId)
  }
  
}
