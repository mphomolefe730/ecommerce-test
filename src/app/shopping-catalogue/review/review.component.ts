import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit{
  productId:string = "";
  productOrderStatus:string = "";
  noReviews:boolean = true;
  notAllowedToReview:boolean = true;
  errorMessage:string = "";
  reviews:any[] = [];
  userId:string = "";

  ratings:{label:string,value:number}[] = [
    { label: 'Excellent', value: 5 },
    { label: 'Good', value: 4 },
    { label: 'Average', value: 3 },
    { label: 'Poor', value: 2 },
    { label: 'Terrible', value: 1 }
  ];

  userReview:string="";
  userRating:number=0;

  reviewForm:FormGroup= new FormGroup({
    comment: new FormControl(this.userReview),
    rank: new FormControl(this.userRating),
    orderStatus: new FormControl(this.productOrderStatus),
    productId: new FormControl(this.productId),
    orderId: new FormControl('')
  });

  constructor(
    private productService:ProductService,
    private inventoryService:InventoryService,
    private authService:AuthService,
    private toaster:NgToastService,
    private activeRouter:ActivatedRoute
  ){}

  ngOnInit(): void {
    this.authService.loggedInUser.subscribe(async (userInformation)=>{
      this.userId = await userInformation?.userId;
    });

    this.activeRouter.params.subscribe(async (data:any)=>{
      this.productService.getProductReviews(data.productId).subscribe({
            next: async (reviewData:any)=>{
              this.productId = data.productId;
              //handling for no comments sent by back end
              if (reviewData.status == 'fail'){
                console.log(reviewData);
                this.noReviews = true;
                this.errorMessage = reviewData.message;
              }else{
                this.noReviews = false;
                //add all product comments to an object
                reviewData.reviews.forEach((r:any)=>{
                  this.reviews.push(r);
                });
                console.log(this.reviews);
              }

              //check if user has ordered product and if so make product review available
              if(this.authService.isLoggedIn()){
                this.inventoryService.getInventoryByUserProductIdAndStatus(this.productId,this.userId,"COMPLETE").subscribe({
                  next: (inven:any) => {
                    //turn on ability to comment
                    if(inven.status == false){
                      this.notAllowedToReview = true;
                    }else if(inven.status == 'success'){
                      this.notAllowedToReview = false;
                      //correcting of values
                      this.reviewForm.setValue({
                        comment: this.userReview,
                        rank: this.userRating,
                        productId: this.productId,
                        orderStatus: inven.inventory[0].status,
                        orderId: inven.inventory[0]._id
                      });
                    };
                  },error: e =>{
                    console.log(e);
                  }
                });
              }
            },
            error: err => {
              console.log(err);
            }
          });
      });
  };

  submitReview(){
    //error handling
    if(this.userRating == 0){
      this.toaster.error({detail:"error",summary:"Unable to submit, please add a rating",duration:5000});
      return;
    }else if(this.userReview == ''){
      this.toaster.error({detail:"Error",summary:"Unable to submit, comment section empty",duration:5000})
      return;
    };
    this.productService.addProductReview(this.reviewForm.value).subscribe({
      next: (reviewStatus:any)=>{
        console.log(reviewStatus);
        this.toaster.success({detail:reviewStatus.status, summary: reviewStatus.message, duration:5000});

      },error: err=>{
        console.log(err);
        this.toaster.error({detail: err.status,summary: err.message,duration:5000});
      }
    });
  };
}
