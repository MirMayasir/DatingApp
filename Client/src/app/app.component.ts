import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/Models/user';
import { AccountService } from 'src/Services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Client';
  Users : any;

  constructor(private http:HttpClient, private accountservice:AccountService) {}

  ngOnInit(): void {
    this.setCurrentUser();
      
  }

  setCurrentUser(){
      const userString = localStorage.getItem('user');
      if(!userString) return;
      const user : User = JSON.parse(userString);
      this.accountservice.setCurrentUser(user);
  }
}
