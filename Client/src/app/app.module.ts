import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './navbar/navbar.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ListComponent } from './list/list.component';
import { MessagesComponent } from './messages/messages.component';
import { MembersListComponent } from './members/members-list/members-list.component';
import { MembersDetailsComponent } from './members/members-details/members-details.component';
import { ToastrModule } from 'ngx-toastr';
import { ErrorsComponent } from './errors/errors.component';
import { ErrorsInterceptor } from './Interceptor/errors.interceptor';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { MemberCardComponent } from './members/member-card/member-card.component';
import { JwtInterceptor } from './Interceptor/jwt.interceptor';
import {TabsModule} from 'ngx-bootstrap/tabs';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoadingInterceptor } from './Interceptor/loading.interceptor';
import { PhotoEditComponent } from './members/photo-edit/photo-edit.component';
import { FileUploadModule } from 'ng2-file-upload';
import { TextInputComponent } from './text-input/text-input.component';
import { DatePickerComponent } from './forms/date-picker.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TimeagoModule } from "ngx-timeago";


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    RegisterComponent,
    ListComponent,
    MessagesComponent,
    MembersListComponent,
    ErrorsComponent,
    NotFoundComponent,
    ServerErrorComponent,
    MemberCardComponent,
    MemberEditComponent,
    PhotoEditComponent,
    TextInputComponent,
    DatePickerComponent,
   
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    BsDatepickerModule,
    TabsModule.forRoot(),
    PaginationModule.forRoot(),
    TimeagoModule.forRoot(),
    
    ToastrModule.forRoot({
      positionClass : 'toast-bottom-right'
    }),

    ButtonsModule.forRoot(),

    NgxSpinnerModule.forRoot({
      type:'line-scale-party',
    }),
    FileUploadModule
  ],
  providers: [
    {provide : HTTP_INTERCEPTORS, useClass : ErrorsInterceptor, multi:true},
    {provide : HTTP_INTERCEPTORS, useClass : JwtInterceptor, multi:true},
    {provide : HTTP_INTERCEPTORS, useClass : LoadingInterceptor, multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
