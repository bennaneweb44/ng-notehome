import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardUserComponent } from './board-user/board-user.component';
import { BoardModeratorComponent } from './board-moderator/board-moderator.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { RayonListComponent } from './rayons/rayon-list/rayon-list.component';
import { RayonEditComponent } from './rayons/rayon-edit/rayon-edit.component';
import { NotesListComponent } from './notes/notes-list/notes-list.component';
import { NotesEditComponent } from './notes/notes-edit/notes-edit.component';

import { AuthGuardService } from './_services/auth-guard.service';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate:[AuthGuardService] },
  { path: 'user', component: BoardUserComponent, canActivate:[AuthGuardService] },
  { path: 'mod', component: BoardModeratorComponent, canActivate:[AuthGuardService] },
  { path: 'admin', component: BoardAdminComponent, canActivate:[AuthGuardService] },
  { path: 'rayons', component: RayonListComponent, canActivate:[AuthGuardService] },
  { path: 'notes', component: NotesListComponent, canActivate:[AuthGuardService] },
  { path: 'rayon/edit/:id', component: RayonEditComponent, canActivate:[AuthGuardService] },
  { path: 'note/edit/:id', component: NotesEditComponent, canActivate:[AuthGuardService] },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
