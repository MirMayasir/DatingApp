import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from 'src/Models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http:HttpClient) { }

  login(model:any){
    return this.http.post<User>(this.baseUrl + 'Accounts/Login', model).pipe(
      map((resopnse:User) =>
      {
        const user = resopnse;
        if(user){
          this.setCurrentUser(user);
        }
      })
    )
  }

  register(model :any){
    return this.http.post<User>(this.baseUrl+ "Accounts/Register", model).pipe(
      map(user =>{
        if(user){
          this.setCurrentUser(user);
        }

        return user;
      })

    )
  }

  setCurrentUser(user:User){
    localStorage.setItem('user', JSON.stringify(user))
    this.currentUserSource.next(user);
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
}
