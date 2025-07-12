import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.css']
})
export class ErrorsComponent {

  baseUrl = "https://localhost:7212/api/Buggy/";
  validationErrors : string [] = [];
  
  constructor(private http:HttpClient) {}

  get404Error(){
    this.http.get(this.baseUrl + "not-found").subscribe({
      next : response => console.log(response),
      error: error => console.log(error)
    })
  }

  get400Error(){
    this.http.get(this.baseUrl + "bad-request").subscribe({
      next : response => console.log(response),
      error: error => console.log(error)
    })
  }

  get500Error(){
    this.http.get(this.baseUrl + "server-error").subscribe({
      next : response => console.log(response),
      error: error => console.log(error)
    })
  }

  get401Error(){
    this.http.get(this.baseUrl + "Auth").subscribe({
      next : response => console.log(response),
      error: error => console.log(error)
    })
  }

  get400ValidationError(){
    this.http.post("https://localhost:7212/api/Accounts/Register", {}).subscribe({
      next : response => console.log(response),
      error: error => {
        console.log(error)
        this.validationErrors = error;

      }
    })
  }
 

}
