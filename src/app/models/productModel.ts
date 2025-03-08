import { categoryModel } from "./categoryModel";
import { userModel } from "./userModel";

export interface productModel{
    name:string,
    _id:string,
    price:number,
    image:string,
    description:string,
    stock:number,
    status:boolean,
    seller:userModel,
    categories:categoryModel[]
}
