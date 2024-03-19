import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ViewProductComponent } from './view-product/view-product.component';
import { CartComponent } from './cart/cart.component';
import { SignupLoginComponent } from './signup-login/signup-login.component';
import { userGuard } from '../auth/user.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'product/:productname/pd/:productid',
    component: ViewProductComponent,
  },{
    path: 'cart',
    component: CartComponent,
    canActivate:[userGuard]
  },{
    path: 'sign-in',
    component: SignupLoginComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShoppingCatalogueRoutingModule { }
