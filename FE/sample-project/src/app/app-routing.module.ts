import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { AdminGuard } from './services/admin.guard';




const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [AdminGuard] },
  // { path: 'users', loadChildren: usersModule, canActivate: [AuthGuard] },
  // { path: 'account', loadChildren: accountModule },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
