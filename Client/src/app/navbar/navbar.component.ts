import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/Services/account.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  model : any = {}
  
  constructor(public accountServices: AccountService, private route: Router, private toster: ToastrService){}

  ngOnInit(): void {
     
  }

  login(){
    this.accountServices.login(this.model).subscribe({
      next: response => {
        this.route.navigateByUrl('/members') 
      },
      complete() {
        console.log("completed");
      },
      
      
    })
  }

  logout(){
    this.accountServices.logout();
    this.route.navigateByUrl('/')
    
  }


}
