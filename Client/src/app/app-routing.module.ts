import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MembersListComponent } from './members/members-list/members-list.component';
import { MembersDetailsComponent } from './members/members-details/members-details.component';
import { ListComponent } from './list/list.component';
import { MessagesComponent } from './messages/messages.component';
import { authGuard } from './Guard/auth.guard';
import { ErrorsComponent } from './errors/errors.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { preventUnsavedChangesGuard } from './Guard/prevent-unsaved-changes.guard';


const routes: Routes = [

    {path : '', component:HomeComponent},


    {path : '' ,
      runGuardsAndResolvers : 'always',
      canActivate:[authGuard],
      children:[
        {path: 'members' , component:MembersListComponent},
        {path: 'members/:username', component:MembersDetailsComponent},
        {path: 'member/edit', component:MemberEditComponent, canDeactivate:[preventUnsavedChangesGuard]},
        {path: 'messages', component:MessagesComponent},
        {path : 'lists', component:ListComponent},
  
      ]
    },
    {path : 'errors', component:ErrorsComponent},
    {path : 'not-found', component:NotFoundComponent},
    {path : 'server-error', component:ServerErrorComponent},
    {path : '**', component:HomeComponent, pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
