import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recommandations',
  templateUrl: './recommandations.component.html',
  styleUrls: ['./recommandations.component.scss']
})

export class RecommandationsComponent implements OnInit, OnChanges {
  @Input() recommendations:any[] = [];

  constructor(
    private productService:ProductService,
    private router:Router
  ){};

  ngOnInit():void{
   // console.log("oninit" + this.recommendations);
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['recommendations']) {
      //console.log(this.recommendations);
    }
  };
  
  async viewProduct(productId:string,productName:string){
    this.productService.addToRecentlyViewedProduct(productId);
    const productNameFormated = productName.split(' ').join('-');
    this.router.navigate([`product/${productNameFormated}/pd/${productId}`]);
  }

}
