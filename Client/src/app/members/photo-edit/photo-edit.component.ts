import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Members } from 'src/Models/members';
import { Photo } from 'src/Models/photos';
import { User } from 'src/Models/user';
import { AccountService } from 'src/Services/account.service';
import { MembersService } from 'src/Services/members.service';

@Component({
  selector: 'app-photo-edit',
  templateUrl: './photo-edit.component.html',
  styleUrls: ['./photo-edit.component.css']
})
export class PhotoEditComponent implements OnInit{
 
  @Input() member : Members | undefined;

  uploader : FileUploader | undefined;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;

  user : User | undefined;

  constructor(private accountService : AccountService, private memberService:MembersService){
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next : us => {
        if(us){
          this.user= us;
        }
      }
    })
  }
  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(e : any){
    this.hasBaseDropZoneOver = e;
  }

  setMain(photo:Photo){
    this.memberService.setMainPhoto(photo.id).subscribe({
      next: ()=>{
        if(this.user?.photoUrl && this.member){
          this.user.photoUrl = photo.url;
          this.accountService.setCurrentUser(this.user);
          this.member.photoUrl = photo.url;
          this.member.photos.forEach(p=>{
            if(p.isMain) p.isMain=false;
            if(p.id === photo.id) p.isMain=true;
          })
        }
      }
    })
  }

  deletePhoto(photoId : number){
    this.memberService.deletePhoto(photoId).subscribe({
      next : ()=>{
        if(this.member){
          this.member.photos = this.member.photos.filter(x=> x.id !== photoId);
        }
      }
    })
  }

  initializeUploader(){
    this.uploader = new FileUploader({
      url : this.baseUrl + 'User/add-photo',
      authToken : 'Bearer ' + this.user?.token,
      isHTML5 : true,
      allowedFileType : ['image'],
      removeAfterUpload: true,
      autoUpload:false,
      maxFileSize: 10*1024*1024
    });

    this.uploader.onAfterAddingFile = (file) =>{
     file.withCredentials = false;
    }

    this.uploader.onSuccessItem = (item, response, status, headers) =>{
      if(response){
        const photo = JSON.parse(response);
        this.member?.photos.push(photo);
        if(photo.isMain && this.user && this.member){
          this.user.photoUrl = photo.url;
          this.member.photoUrl = photo.url;
          this.accountService.setCurrentUser(this.user);
        }
      }
    }
  }

}
