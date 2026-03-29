import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ForgotPasswordPageComponent } from './pages/forgot-password/forgot-password-page.component';
import { ResetPasswordPageComponent } from './pages/reset-password/reset-password-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  { path: 'forgot-password', component: ForgotPasswordPageComponent },
  { path: 'reset-password', component: ResetPasswordPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
