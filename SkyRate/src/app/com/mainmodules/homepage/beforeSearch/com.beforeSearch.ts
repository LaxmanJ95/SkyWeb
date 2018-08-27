import {Component, Injector} from '@angular/core';
import {ActivatedRoute} from '@angular/router'

import { BusinessService } from '../../../service/com.service.business';
import { BaseComponent } from '../../../common/basic/com.common.basic.basecomponent';
import { Router } from '@angular/router/src/router';
import { FormComponent } from '../../../common/basic/com.common.basic.formcomponent';
import { IpService } from '../../../service/com.service.ipaddress';
import { RestApiService } from '../../../common/service/restapi/com.common.service.restapiservice';
declare var $:any;
@Component({
    selector:'before-search',
    templateUrl:'com.beforeSearch.html',
    styleUrls:['com.beforeSearch.css'],
    providers:[BusinessService,IpService,RestApiService]
})
export class BeforeSearchComponent extends FormComponent{

    searchList:any;
    searchValue:any;
    count:number=0;
    currentPage: number = 0;
    lastPage:number;
    roleId:number;
    pageTotal:number;
    constructor(injector:Injector,
        private _ipService : IpService,
        private _businessService : BusinessService,
        private _restApiService:RestApiService,
        private _route : ActivatedRoute,
       ) {
        super(injector); 
        // this.roleId = this._sessionStorageService.getObject("roleId");
       
}
ngOnInit(){
    console.log("ip");
   
        this._ipService.getIpAddress().subscribe(data => {
            console.log("ip address ",data.query);
          this._sessionStorageService.setObject('ipAddress',data.query)
        });
  }

updateFromChild($event){
    console.log(" search "+$event)
    this.searchValue = $event
    var request = {
        name:this.searchValue
    }
    if(this.searchValue != "")
     this._businessService.searchBusiness(request).then(res => this.cb_searchBusiness(res))
     else{
        // this.count = 0;
        // this.searchList = null;
     }
  }
  cb_searchBusiness(res){
    this.searchList = res.business;
    this.pageTotal = res.count/10;
    this.currentPage = 1;
    this.count = this.searchList.length/10;
     var i = this.count;
           this.lastPage = Math.floor(i);
        if(this.lastPage == 0)
            this.lastPage = 1;
  
    // this._router.navigate(['/dashboard'])
    console.log(this.searchList.length)    
}
getHeaderStyle(){
    var header;
    if(this.searchList == null){
        header = {
            'background':  ' url(assets/img/Home_background.png) no-repeat center center fixed',
            'height':'650px',
            'background-size': 'cover'
        }
    }
    else{
        header = {
            'background-color':'#204279'
        }
    }
    return header;

}
getSearchStyle(){
    var searchStyle;
    if(this.searchList == null){ 
        searchStyle= {
            'margin-top':'250px'
        }
    }
    return searchStyle;
}

reviewBusiness(value){
     this._router.navigate(['dashboard/reviewBusiness/'+value]);
}
cb_getBusiness(res){
    this.searchList = res.business
}
start(){
        this.currentPage = 1;
        var request = {
            search:this.searchValue,
            value:this.currentPage,
            // roleId:this.roleId
        }
        console.log("previous value "+this.currentPage)
        this._businessService.getBusinessPagination(request).then(res => this.cb_getBusiness(res))
      
   }
   previous(){
    console.log("previous in current "+this.currentPage)
    console.log("previous in last "+this.lastPage)
      if(this.currentPage > 1){
       this.currentPage -= 1;
       var request = {
        search:this.searchValue,
        value:this.currentPage,
        // roleId:this.roleId
    }
       this._businessService.getBusinessPagination(request).then(res => this.cb_getBusiness(res))
       console.log("previous value "+this.currentPage)
     }
   }
   next(){

     if(this.lastPage > this.currentPage){
    
        var page = +this.currentPage
        page+=1;
        this.currentPage = page
        var request = {
            search:this.searchValue,
            value:this.currentPage,
            // roleId:this.roleId
        }
        console.log("page befoe send  "+page)
        this._businessService.getBusinessPagination(request).then(res => this.cb_getBusiness(res))  
   }
  }
   end(){
     this.currentPage = this.lastPage
     var request = {
        search:this.searchValue,
        value:this.currentPage,
        // roleId:this.roleId
    }
     this._businessService.getBusinessPagination(request).then(res => this.cb_getBusiness(res))
   }

}