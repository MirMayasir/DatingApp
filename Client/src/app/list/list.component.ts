import { Component, OnInit } from '@angular/core';
import { Members } from 'src/Models/members';
import { Pagination } from 'src/Models/pagination';
import { MembersService } from 'src/Services/members.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  members : Members[] | undefined;
  predicate = 'liked';
  pageNumber = 1;
  pageSize = 5;
  pagination : Pagination | undefined;

  constructor(private memberServices:MembersService){}
  ngOnInit(): void {
    this.loadLikes();
  }



  loadLikes(){
    return this.memberServices.getLikes(this.predicate, this.pageNumber, this.pageSize).subscribe({
      next: response =>{
        this.members = response.result
        this.pagination = response.pagination;
      }
    })
  }

  pageChanged(event : any){
    if( this.pageNumber !== event.page){
      this.pageNumber = event.page;
      this.loadLikes();
    }
  }

}
