import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { FormsModule } from '@angular/forms';
import { ForgotPasswordPageComponent } from './pages/forgot-password/forgot-password-page.component';
import { ResetPasswordPageComponent } from './pages/reset-password/reset-password-page.component';

@NgModule({
  declarations: [
    LoginPageComponent,
    ForgotPasswordPageComponent,
    ResetPasswordPageComponent,
  ],
  imports: [SharedModule, FormsModule, AuthRoutingModule],
})
export class AuthModule {}
