import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ViewProductComponent } from './view-product/view-product.component';
import { CartComponent } from './cart/cart.component';
import { SearchComponent } from './search/search.component';
import { userGuard } from '../auth/user.guard';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { CartFinalizeOrderComponent } from './cart-finalize-order/cart-finalize-order.component';
import { ReviewComponent } from './review/review.component';

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
    canActivate: [userGuard],
  },{
    path: 'sign-in',
    component: LoginComponent
  },{
    path: 'sign-up',
    component: RegisterComponent
},{
    path:'search/:query',
    component:SearchComponent
  },{
    path: 'profile/:seller',
    component:ViewProfileComponent
  },{
    path:'cart/final-order/:id',
    component:CartFinalizeOrderComponent
  },{
    path: 'review/pd/:productId',
    component: ReviewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShoppingCatalogueRoutingModule { }
