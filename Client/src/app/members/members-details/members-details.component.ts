import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';


import { TabsModule } from 'ngx-bootstrap/tabs';
import { TimeagoModule } from 'ngx-timeago';
import { Members } from 'src/Models/members';
import { MembersService } from 'src/Services/members.service';

@Component({
  selector: 'app-members-details',
  standalone: true,
  templateUrl: './members-details.component.html',
  styleUrls: ['./members-details.component.css'],
  imports:[CommonModule, TabsModule, GalleryModule, TimeagoModule]
})
export class MembersDetailsComponent implements OnInit{
  images : GalleryItem[] = [];
  member : Members | undefined;

  constructor(private memberService:MembersService, private route:ActivatedRoute){}
  ngOnInit() {
    this.loadMember();
  }
  
  loadMember(){
    var username = this.route.snapshot.paramMap.get('username');
    if(!username) return;
    this.memberService.getMember(username).subscribe({
      next : result => {
        this.member=result,
        this.getImages();
      }
    })
  }

  getImages(){
    if(!this.member) return
    for(const photo of this.member.photos){
      this.images.push(new ImageItem({src: photo.url, thumb: photo.url}));
      this.images.push(new ImageItem({src: photo.url, thumb: photo.url}));
    }
  }
}
