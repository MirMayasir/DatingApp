import { Component, OnInit } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Members } from 'src/Models/members';
import { Pagination } from 'src/Models/pagination';
import { User } from 'src/Models/user';
import { UserParams } from 'src/Models/userParams';
import { AccountService } from 'src/Services/account.service';
import { MembersService } from 'src/Services/members.service';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.css']
})
export class MembersListComponent implements OnInit{
  
  members : Members[] | undefined
  pagination : Pagination | undefined;
  userPrams : UserParams | undefined;
  user : User | undefined;
  genderList = [{value : 'male', display: 'Males'}, {value: 'female', display:'Females'}];

  constructor(private memberService:MembersService, private accountServices: AccountService){
    this.accountServices.currentUser$.pipe(take(1)).subscribe({
      next : response =>{
        if(response){
          this.userPrams = new UserParams(response);
          this.user = response;
        }
      }
    })
  }


  ngOnInit(): void {
    this.loadMembers();
  }


  loadMembers(){
    if(!this.userPrams) return;
    this.memberService.getMembers(this.userPrams).subscribe({
      next : response =>{
        if(response.result && response.pagination){
          this.members = response.result;
          this.pagination = response.pagination;
        }
      }
    })
  }

 restFilters(){
  if(this.user){
    this.userPrams = new UserParams(this.user);
    this.loadMembers();
  }
 }

  pageChanged(event : any){
    if( this.userPrams && this.userPrams?.pageNumber !== event.page){
      this.userPrams.pageNumber = event.page;
      
      this.loadMembers();
    }
  }

}
