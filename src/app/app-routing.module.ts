import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {RegistrationComponent} from './registration/registration.component';
import {ProductComponent} from './product/product.component';
import { ProtectedServiceService } from './services/protected-service.service';
import { AuthServiceService } from './services/auth-service.service';
import {AddEditProductComponent} from './product/add-edit-product/add-edit-product.component';

const routes: Routes = [
  {path: '', redirectTo: 'registration', pathMatch: 'full'},
  {path: 'login', canActivate: [AuthServiceService], component: LoginComponent},
  {path: 'registration', canActivate: [AuthServiceService], component: RegistrationComponent},
  {path: 'product', canActivate: [ProtectedServiceService], component: ProductComponent},
  {path: 'add-edit-product', canActivate: [ProtectedServiceService], component: AddEditProductComponent},
  {path: 'add-edit-product/:id', canActivate: [ProtectedServiceService], component: AddEditProductComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
