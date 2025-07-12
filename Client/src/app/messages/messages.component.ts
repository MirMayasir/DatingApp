import { Component, OnInit } from '@angular/core';
import { Messages } from 'src/Models/messages';
import { Pagination } from 'src/Models/pagination';
import { MessaageService } from 'src/Services/messaage.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  messages?: Messages[];
  paagination?: Pagination;
  container = 'unread';
  pageNumber = 1;
  pageSize = 5;
   

  constructor(private messageServices: MessaageService){}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(){
    this.messageServices.getMessages(this.pageNumber, this.pageSize, this.container).subscribe({
      next: response => {
        this.messages = response.result;
        this.paagination = response.pagination;
      }
    })
  }

  pageChange(event : any){
    if(this.pageNumber !== event.page){
      this.pageNumber= event.page;
      this.loadMessages();
    }
  }

}
