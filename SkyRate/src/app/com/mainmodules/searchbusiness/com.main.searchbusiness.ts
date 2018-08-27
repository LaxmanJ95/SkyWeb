import {Component, Injector, Output, EventEmitter, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {map} from 'rxjs/operators/map';
import {  ActivatedRoute } from '@angular/router';
import {MatAutocompleteTrigger} from '@angular/material'
import { BusinessService } from '../../service/com.service.business';
import { FormComponent } from '../../common/basic/com.common.basic.formcomponent';
import { SessionDataService } from '../../common/service/com.common.sessiondata';
import { RestApiService } from '../../common/service/restapi/com.common.service.restapiservice';
declare var $:any;

@Component({
    selector:'search',
    templateUrl:'com.main.searchbusiness.html',
    styleUrls:['com.main.searchbusiness.css'],
    providers: [BusinessService,SessionDataService,RestApiService]
})
export class SearchBusinessComponent extends FormComponent{
    @ViewChild(MatAutocompleteTrigger) trigger: MatAutocompleteTrigger;
    @Output()
    stringChanged = new EventEmitter();
   category:any;
  options:any;
    country:any;
    categoryValue:string="";
    countryValue:string="";
    selectedBuiness:string = "";
    searchfield:string="";
    optionValue:string = "";
    sessionValue:string="";
    roleId:number = 0;
    myControl: FormControl = new FormControl();
    userId:number;
    constructor(injector:Injector,
        private _restApiService : RestApiService,
        private _businessService : BusinessService,
        private _route : ActivatedRoute,
       ) {
        super(injector); 
        this.roleId = this._sessionStorageService.getObject("roleId");
        this.userId = this._sessionStorageService.getObject("userId")
        // alert(this.userId)
        SessionDataService.getInstance().totalCartItemCount$.subscribe(value=> {
            //alert(total);
             this.sessionValue = value
              this.selectedBuiness = this.sessionValue
          });
        SessionDataService.getInstance().refresh$.subscribe(value =>{
            this.userId = this._sessionStorageService.getObject("userId")
            //  alert(this.userId)
        });
        
    this.getSearchBusiness();   
}
getSearchBusiness(){
    var request = {
        name:"",
        category:this.categoryValue,
        country:this.countryValue,
        page:1,
        roleId:this.roleId
    }
     this._businessService.searchBusiness(request).then(res => this.cb_searchBusiness(res))
}
ngOnInit(){
    this.selectedBuiness = this.sessionValue;
    this.getCategory();
    this.getCountry();
}
getCountry(){
    this._restApiService.get('/address/getCountryList').then(res => this.cb_getCountry(res))
}
cb_getCountry(res){
    this.country = res.country;
}
getCategory(){
    this._restApiService.get('/business/getCategory').then(res => this.cb_getCategory(res))
}
cb_getCategory(res){
    this.category = res.category;
    // alert(JSON.stringify(this.category))
}
moreOptions(){
    // alert(this.categoryValue)
    this.trigger.closePanel();
    this.mapCategoryValue();
     this.mapWishListResponse()
     this.mapCountryValue();
    
    if(this.selectedBuiness == undefined)
        this.selectedBuiness = "";
    this._router.navigate(['dashboard/search-list/'],{ queryParams: { search: this.selectedBuiness, country:this.countryValue, category: this.categoryValue } });
}
onCountryChange(){
    this.getSearchBusiness();
}
onSelectChange(value){
    this.categoryValue = value;
    this.searchfield = "";
    this.selectedBuiness = "";
    this.mapCategoryValue();
    this.mapWishListResponse()
    this.getSearchBusiness();
}
onChange(value){
    var request = {
        name:value,
        country:this.countryValue,
        category:this.categoryValue,
        page:1,
        roleId:this.roleId
    }
      this._businessService.searchBusiness(request).then(res => this.cb_searchBusiness(res))
}

cb_searchBusiness(res){
     this.options = res.business;
}
callSomeFunction(value,name){
    this.selectedBuiness = name;
    this.mapWishListResponse()
    this._router.navigate(['dashboard/review/',value,name]);
}
mapWishListResponse(){
    SessionDataService.getInstance().updateTotalCartItemsCount(""+this.selectedBuiness)
}
mapCountryValue(){
    SessionDataService.getInstance().countryValueMethod(""+this.countryValue);
}
mapCategoryValue(){
    SessionDataService.getInstance().categoryValueMethod(""+this.categoryValue);
}
newBusiness(){
    this._router.navigate(['business/update_business']);
}


}