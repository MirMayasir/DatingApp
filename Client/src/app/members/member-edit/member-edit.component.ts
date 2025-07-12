import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Members } from 'src/Models/members';
import { User } from 'src/Models/user';
import { AccountService } from 'src/Services/account.service';
import { MembersService } from 'src/Services/members.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit{

  @ViewChild('editMember') editForm : NgForm | undefined;
  @HostListener('window:beforeunload', ['$event']) unloadNotification ($event:any){
    if(this.editForm?.dirty){
      $event.returnValue = true;
    }

  }
  member : Members | undefined;
  user : User | null = null;

  constructor(private accountServices:AccountService, private memberServices:MembersService, private toastr:ToastrService){
    this.accountServices.currentUser$.pipe(take(1)).subscribe({
      next : user => this.user = user
    })
  }
  ngOnInit(){
    this.loadMember();
  }

  loadMember(){
    if(!this.user) return

    this.memberServices.getMember(this.user.username).subscribe({
      next : mem => this.member=mem
    })
  }

  updateMember(){
    this.memberServices.updateMember(this.editForm?.value).subscribe({
      next : _ =>{
        this.toastr.success("profile updated");
        this.editForm?.reset(this.member);
      }
    })
    
  }

}
