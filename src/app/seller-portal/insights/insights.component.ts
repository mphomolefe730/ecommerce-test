import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { ChartModel } from 'src/app/models/chartModel';
import { inventoryModel } from 'src/app/models/inventoryModel';
import { orderStatus } from 'src/app/models/orderStatus';
import { AuthService } from 'src/app/services/auth.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { RoleService } from 'src/app/services/role.service';

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.scss']
})
export class InsightsComponent implements OnInit{
  user:string='';
  userId:string='';
  chart:any;
  chart2:any;
  
  unfurfilled:ChartModel = {totalRevenue: 0, numberOfOrders: 0};
  complete:ChartModel = {totalRevenue: 0, numberOfOrders: 0};
  declined:ChartModel= {totalRevenue: 0, numberOfOrders: 0};
  pending:ChartModel = {totalRevenue: 0, numberOfOrders: 0};
  
  barColors = [
    "#b91d47",
    "#00aba9",
    "#2b5797",
    "#e8c3b9",
  ];

  statuses=["UNFURFILLED", "COMPLETE", "DECLINED", "PENDING"];
  
  constructor(
    private inventoryService:InventoryService,
    private authService:AuthService,
    private roleService:RoleService
  ){}
  
  ngOnInit(): void {
    this.authService.loggedInUser.subscribe(async (userInformation)=>{
      this.user= await userInformation.name;
      this.userId= await userInformation.userId;
      const userRole:any = await this.roleService.role.filter((a)=> a._id == userInformation.role)[0];
      
      if (userRole.role == "seller") {
        this.inventoryService.getAllSellerOrders(this.userId).subscribe((data:any)=>{
          let product:any= data.order;

          product.forEach((product:inventoryModel)=>{
            switch(product.status){
              case "UNFURFILLED": {
                this.unfurfilled.numberOfOrders+=1;
                this.unfurfilled.totalRevenue += product.total;
                break;
              }
              case "PENDING": {
                this.pending.numberOfOrders+=1;
                this.pending.totalRevenue += product.total;
                break;
              }
              case "DECLINED": {
                this.declined.numberOfOrders+=1;
                this.declined.totalRevenue += product.total;
                break;
              }
              default:{
                this.complete.numberOfOrders+=1;
                this.complete.totalRevenue += product.total;
              }
            }
          })
          
          this.chart = new Chart('canvas', {
            type: 'doughnut',
            data: {
              labels: this.statuses,
              datasets: [
                {
                  data: [this.unfurfilled.numberOfOrders, this.complete.numberOfOrders, this.declined.numberOfOrders, this.pending.numberOfOrders],
                  backgroundColor:this.barColors,
                  borderWidth: 1,
                },
              ],
            },
              options: {
                  plugins: {
                      title: {
                          display: true,
                          text: 'Order Qauntity Ratio'
                      }
                  }
              }
          });

          this.chart2 = new Chart('canvas2', {
            type: 'bar',
            data: {
              labels: this.statuses,
              datasets: [
                {
                  data: [this.unfurfilled.totalRevenue, this.complete.totalRevenue, this.declined.totalRevenue, this.pending.totalRevenue],
                  backgroundColor:this.barColors,
                  borderWidth: 1,
                },
              ],
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Revenue By Category'
                    }
                }
            },
          });
        //################################################################################
        });
      }
    })
  };

}
