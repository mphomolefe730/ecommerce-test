import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { productModel } from '../models/productModel';

@Injectable({
  providedIn: 'root'
})
export class ProductService implements OnInit {
  recentlyViewed:string|null='';
  recentlySearched:string|null='';
  
  constructor(
    private http:HttpClient
  ) { }
  
  ngOnInit(): void {
    this.recentlyViewed = localStorage.getItem("smartOne_recentlyViewed");
    this.recentlySearched = localStorage.getItem("smartOne_recentlySearched");
    if (this.recentlyViewed == null) localStorage.setItem("smartOne_recentlyViewed","[]");
    if (this.recentlySearched == null) localStorage.setItem("smartOne_recentlySearched","[]");
  }

  async addToRecentlyViewedProduct(id:string):Promise<void>{
    let temprecentlyViewed:string[] = await JSON.parse(String(this.recentlyViewed));
    const checker = temprecentlyViewed.includes(id);
    if (checker == true) {
      const index = temprecentlyViewed.indexOf(id);
      temprecentlyViewed.splice(index,1);
    }
    temprecentlyViewed.unshift(id);
    localStorage.clear();
    localStorage.setItem("smartOne_recentlyViewed",JSON.stringify(temprecentlyViewed));
    this.recentlyViewed = localStorage.getItem("smartOne_recentlyViewed");
  }
  
  
  getAllProducts(){
    return this.http.get(`${environment.renderApiLink}/api/products/`);
  }
  getProductById(id:string){
    return this.http.get(`${environment.renderApiLink}/api/products/${id}`);
  }
  addNewProduct(productInformation:productModel){
    return this.http.post(`${environment.renderApiLink}/api/products/add`, productInformation);
  }
  getProductByCategory(category:string){
    return this.http.get(`${environment.renderApiLink}/api/category/}`);
  }

  getAllSellerProducts(sellerId:string){
    return this.http.get(`${environment.renderApiLink}/api/products/seller/${sellerId}`);
  }

  updateproductById(productId:string, product:productModel){
    return this.http.put(`${environment.renderApiLink}/api/products/${productId}`,product);
  }
  getProductBySearch(query:{search:string}){
    return this.http.post(`${environment.renderApiLink}/api/products/items/search`,query);
  }
  getProductReviews(productId:string){
    return this.http.get(`${environment.renderApiLink}/api/review/${productId}`);
  }
  addProductReview(reviewForm:{review:string, orderId:string, rank:number, orderStatus:string,productId:string}){
    return this.http.put(`${environment.renderApiLink}/api/review/${reviewForm.productId}`,reviewForm)
  }
}
