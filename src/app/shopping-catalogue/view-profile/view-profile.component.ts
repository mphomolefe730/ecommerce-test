import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';
import { productModel } from 'src/app/models/productModel';
import { ActivatedRoute } from '@angular/router';
import { userModel } from 'src/app/models/userModel';
import { ViewProductService } from 'src/app/services/view-product.service';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})


export class ViewProfileComponent implements OnInit {
  constructor(
    private productService: ProductService,
    private activeRoute: ActivatedRoute,
    private userService: UserService,
    private viewProductServ: ViewProductService,
  ){};


  products:productModel[] = [];
  user: userModel | undefined;
  userId: string = '';

  ngOnInit() {
    this.activeRoute.params.subscribe((data: any) => {
      this.userId = data.seller;
      this.productService.getAllSellerProducts(this.userId).subscribe((products: any)=> {
        this.products = products;
      })
      this.userService.getUserById(this.userId).subscribe((data: any)=>{
        this.user = data
      });
    });
  }
  
  // getSellersProducts(id: string): any {
  //   this.productService.getAllSellerProducts(id).subscribe((products: any)=> {
  //     this.products = products;
  //     console.log(this.products);
  //   })
  // }

  viewProductDetails(id: string, productName: string) {
    this.viewProductServ.viewProduct(id, productName);
  }
}