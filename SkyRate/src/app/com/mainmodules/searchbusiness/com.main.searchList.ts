import {Component, Injector} from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router'

import { BusinessService } from '../../service/com.service.business';
import { BaseComponent } from '../../common/basic/com.common.basic.basecomponent';

import { FormComponent } from '../../common/basic/com.common.basic.formcomponent';
import { SessionDataService } from '../../common/service/com.common.sessiondata';
import { SessionStorageService } from '../../common/service/com.common.sessionstorage';


@Component({
    selector:'search-list',
    templateUrl:'com.main.searchList.html',
    styleUrls:['../homepage/beforeSearch/com.beforeSearch.css'],
    providers:[BusinessService,SessionDataService]
})
export class SearchListComponent extends BaseComponent{
    subscription;
    searchList:any;
    searchValue:any;
    categoryValue:string="";
    countryValue:string="";
    name:any;
    id:string;
    count:number=0;
    roleId:number=0;
    currentPage: number = 0;
    lastPage:number;
    pageTotal:number;
    constructor(injector:Injector,
        private _router : Router,
        private _businessService : BusinessService,
        private _route : ActivatedRoute,
       ) {
        super(injector); 
       
}
ngOnInit(){
    this.id=this._route.snapshot.queryParamMap.get('search')
    this.categoryValue = this._route.snapshot.queryParamMap.get('category')
    this.countryValue = this._route.snapshot.queryParamMap.get('country')
    // alert(this.id + " "+this.categoryValue)
    window.scrollTo(0, 0)
    this.roleId = this._sessionStorageService.getObject("roleId");
    this.updateFromParent(this.id);
    SessionDataService.getInstance().totalCartItemCount$.subscribe(value=> {
        this.id = value;
        this.updateFromChild(value)
        //console.log("Header Total cart items:"+total);
      });
      SessionDataService.getInstance().categoryValue$.subscribe(value=> {
          this.categoryValue = value;
        this.updateFromChild(this.id)
      });
      SessionDataService.getInstance().countryValue$.subscribe(value=> {
        this.countryValue = value;
      this.updateFromChild(this.id)
    });
     
    
   
}
    updateFromParent(value){
        this.searchValue = value
        //  alert(this.searchValue)
        var request = {
            name:this.searchValue,
            category:this.categoryValue,
            country:this.countryValue,
            roleId:this.roleId
        }
         this._businessService.searchBusiness(request).then(res => this.cb_searchBusiness(res))
        
    }
    updateFromChild(value){
        console.log(" search "+value)
        this.searchValue = value
        // alert(this.categoryValue)
        var request = {
            name:this.searchValue,
            category:this.categoryValue,
            country:this.countryValue,
            roleId:this.roleId
        }
         this._businessService.searchBusiness(request).then(res => this.cb_searchBusiness(res))
        
      }
      cb_searchBusiness(res){
        this.searchList = res.business;
        this.pageTotal = res.count/10;
        this.currentPage = 1;
        this.count = this.searchList.length/10;
         var i = this.pageTotal;
        
               this.lastPage = Math.round(this.pageTotal);
            if(this.lastPage == 0)
                this.lastPage = 1;
      
        // this._router.navigate(['/dashboard'])
        console.log(this.searchList.length)    
    }

    reviewBusiness(id,value){
          this._router.navigate(['dashboard/review/'+id,value]);
        // this._router.navigate(['dashboard/report']);
    }
    cb_getBusiness(res){
        this.searchList = res.business
    }
    pagesearch(event){
        // alert(this.currentPage)
        // this.currentPage = null;
        var request = {
            search:this.searchValue,
            value:event,
            category:this.categoryValue,
            roleId:this.roleId
        }
        console.log("previous value "+this.currentPage)
        this._businessService.getBusinessPagination(request).then(res => this.cb_getBusiness(res))
       }
    start(){
            this.currentPage = 1;
            var request = {
                search:this.searchValue,
                value:this.currentPage,
                category:this.categoryValue,
                roleId:this.roleId
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
            category:this.categoryValue,
            roleId:this.roleId
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
                category:this.categoryValue,
                roleId:this.roleId
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
            category:this.categoryValue,
            roleId:this.roleId
        }
         this._businessService.getBusinessPagination(request).then(res => this.cb_getBusiness(res))
       }
}