import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { productModel } from 'src/app/models/productModel';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-upload-product',
  templateUrl: './upload-product.component.html',
  styleUrls: ['./upload-product.component.scss']
})
export class UploadProductComponent implements OnInit{
  filePath:string='';
  sending:boolean=false;
  allSelectedValues:string[]=[];
  userId:string='';
  progressLoader = '../../../assets/icons/loader.gif';
  addIconImage = '../../assets/icons/addicon.png';
  url:string='';
  categories:{_id:string,name:string}[]=[];

  uploadProductForm:FormGroup=new FormGroup({
    name:new FormControl('',Validators.required),
    price: new FormControl(0,Validators.required),
    description:new FormControl('',Validators.required),
    image:new FormControl(''),
    stock: new FormControl(0,Validators.required),
    seller: new FormControl(this.userId),
    status: new FormControl(false, Validators.required),
    categories:new FormControl([]),

  })

  constructor(
    private storage:AngularFireStorage,
    private authService:AuthService,
    private categoryservice:CategoryService,
    private toaster: NgToastService,
    private productService:ProductService,
    private router:Router
  ){}

  ngOnInit(): void {
    this.authService.loggedInUser.subscribe(async (data)=>{
      this.userId= await data.userId
    })
    this.categoryservice.getAllCategory().subscribe((categories:any)=>{
      this.categories = categories;
    })
  }
  
  async upload($event:any){
    this.filePath = $event?.target?.files[0];
    const upload = await this.storage.upload(`product-images/${this.userId}`,this.filePath);
    const url = await upload.ref.getDownloadURL();
    this.url = url;
  }

  addCategory(value: string): void {
    if (this.allSelectedValues.includes(value)) {
      this.allSelectedValues = this.allSelectedValues.filter((item) => item !== value);
    } else {
      this.allSelectedValues.push(value);
    }
  }

  addProduct(){
    this.sending=!this.sending;
    this.uploadProductForm.value.categories=this.allSelectedValues;
    this.uploadProductForm.value.seller=this.userId;
    this.uploadProductForm.value.image=this.url;
    if(this.uploadProductForm.status == 'INVALID'){
      this.sending=!this.sending;
      this.toaster.error({detail: 'ERROR', summary: 'theres some fields not completed'});
      return ;
    }
    this.productService.addNewProduct(this.uploadProductForm.value).subscribe(async(response:any)=>{
      const upload = await this.storage.upload(`product-images/${response.productId}`,this.filePath);
      const url = await upload.ref.getDownloadURL();
      this.url = url;

      this.productService.getProductById(response.productId).subscribe((productInformation:any)=>{
        const object:productModel = {
          name: this.uploadProductForm.value.name,
          _id: response.productId,
          price: this.uploadProductForm.value.price,
          image: url,
          description: this.uploadProductForm.value.description,
          stock: this.uploadProductForm.value.stock,
          seller: productInformation.seller,
          status: this.uploadProductForm.value.status,
          categories: productInformation.categories
        }
        this.productService.updateproductById(object._id,object).subscribe((updatedProduct:any)=>{
          this.router.navigate(['/seller/products'])
        })
        this.sending=!this.sending;
        if (response) {
          this.toaster.success({detail:"SUCCESS",summary:'',duration:2000,position:"topCenter"});
        }
      })      
    })
  }
  goBack(){
    this.router.navigate(['/seller/products']);
  }
}
