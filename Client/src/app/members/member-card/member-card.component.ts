
import { Component, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Members } from 'src/Models/members';
import { MembersService } from 'src/Services/members.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent {

  @Input() member : Members | undefined;

  constructor(private memberService:MembersService, private toster: ToastrService){}

  addLike(member : Members){
    return this.memberService.addLike(member.userName).subscribe({
      next : _ =>{
        this.toster.success('you liked ' + member.knownAs)
      }
    })
  }

  
}
