import { Component , OnInit, OnDestroy,ElementRef, Input,Injector, ViewChild, NgZone } from '@angular/core';
import { NgForm,FormBuilder,FormGroup,Validators } from '@angular/forms';
import { Router, ActivatedRoute,RouterModule } from '@angular/router';
import {HashLocationStrategy, Location, LocationStrategy} from '@angular/common';
import { BaseComponent } from '../../common/basic/com.common.basic.basecomponent';
import { RestApiService } from '../../common/service/restapi/com.common.service.restapiservice';
import { SessionStorageService } from '../../common/service/com.common.sessionstorage';
import { BusinessService } from '../../service/com.service.business';

import {Business,BusinessRatingSummary} from '../model/com.model.business'
import {Rating, Reviews, Bookmark} from '../model/com.model.ratingReview'
import { ReviewService } from '../../service/com.serivce.review';
import { SessionDataService } from '../../common/service/com.common.sessiondata';
import { CookieService } from 'ngx-cookie-service';
import { identifierModuleUrl } from '@angular/compiler';
import { UniqueUsernameValidators } from '../../usermgmt/signup/validators/com.usermgmt.uniqueuser.validator';
import { UniqueBusinessValidators } from '../../service/com.service.businessValidators';
import { AlertService } from '../../common/service/alert/com.common.service.alertservice';
import { MapsAPILoader } from '@agm/core';
import {} from '@types/googlemaps'
declare var $ :any;
@Component({
    selector:'review',
    templateUrl:'com.main.updateBusiness.html',
    styleUrls:['com.main.updateBusiness.css'],
    providers: [RestApiService,BusinessService,ReviewService,SessionDataService]
})
export class UpdateBusinessComponent extends BaseComponent{
    id: number=0;businessName:string;
    subscription;
    business = new Business();
    userId:number = 0;
    roleId:number = 0;
    optionsModel: number[];
    selectedItems = [];
    deleteItems = [];
    dropdownSettings = {};
    category  = [];
    EditPictureButtonLabel:string;
    businessForm :FormGroup;
    isModalOpen:boolean = false;
    isReviewOpen:boolean = false;
    states:any;country:any;
    isStateManual:boolean= false;
    isMarked:boolean = false;
    profileImage:string;
    isActive:boolean = false;
    isExistingImageAvailable:boolean = true;
    BUSINESS_IMAGE_UPLOADER_URL="upload/productImageUploader";
    @ViewChild('search') public searchElement : ElementRef;
    constructor(injector:Injector,private _router: Router,
        private mapsAPILoader : MapsAPILoader, private ngZone: NgZone,
        private elRef:ElementRef,private cookieService: CookieService,
        private _location: Location,
                  private _route: ActivatedRoute,
                  private _restApiService: RestApiService,
                  private _businessService:BusinessService,
                  private _ratingService: ReviewService,private fb: FormBuilder){
        super(injector)
    
          this.dropdownSettings = { 
            singleSelection: false, 
            text:"Select Categories",
            enableCheckAll:true,
            selectAllText:'Select All',
            labelKey:'category',
            primaryKey:'id',
            unSelectAllText:'UnSelect All',
            enableSearchFilter: true,
            classes:"myclass custom-class"
          };        
        }

    ngOnInit(){
        this.subscription= this._route.params.subscribe(params=>{
            this.id=+params["id"];
            this._sessionStorageService.setObject("businessId",this.id);
        this.userId = this._sessionStorageService.getObject("userId");
        this.roleId = this._sessionStorageService.getObject("roleId");
        SessionDataService.getInstance().refresh$.subscribe(value =>{
            this.userId = this._sessionStorageService.getObject("userId");
            if(this.userId == null)
            this.userId = 0;
            this.roleId = this._sessionStorageService.getObject("roleId")
    });
        this.businessForm = this.fb.group({ 
            _name: ['',Validators.compose([
                Validators.required]),UniqueBusinessValidators.businessExists(this._businessService,this.id)],
           _address: ['',Validators.required],
            // _city: [],
            _address2:[''],_address3:[''],
            // _country:[],
            // _state:[],
            // _zip:[],
            _designatorCode:['',Validators.required],
            _certificateNumber:['',Validators.required],
            _certificateHoldingOffice:['',Validators.required],
            _category:['',Validators.required],
            _overview: [''],
            _capabilities: [''],
            _website:['']
         });
        // alert(this.business.id)
        if(Number.isInteger(this.id)){
            this.business.id = this.id
        this.getBusinessById(this.business.id);
        this.mapBusinessIdRefresh()
        }
        else{
            this.id = 0;
        }
                    });
                    
        this.getStates();
        this.getCountry();
        this.getCategory();
        this.dropdownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'category',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 3,
            allowSearchFilter:false
        };
        this.mapsAPILoader.load().then(() => {
            let autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, {
              types: ["address"]
            });
            autocomplete.addListener("place_changed", () => {
              this.ngZone.run(() => {
                //get the place result
                let place: google.maps.places.PlaceResult = autocomplete.getPlace();
      
                //verify result
                if (place.geometry === undefined || place.geometry === null) {
                  return;
                }
               console.log("json    "+JSON.stringify(place))
               console.log(place.formatted_address)
this.business.address = place.formatted_address;
               let splitString = place.formatted_address
               let x = splitString.split(",")
               let last = x.length;
               var value = last - 1;
                this.business.country =  x[value];
                //set latitude, longitude and zoom
                // this.latitude = place.geometry.location.lat();
                // this.longitude = place.geometry.location.lng();
                // this.zoom = 12;
              });
            });
          });
    }
    getBusinessById(id){
        // alert(id)
        var request = {
            id:id
        }
        this._businessService.getBusinessById(request).then(res => this.cb_getBusinessById(res));
    }
    cb_getBusinessById(res){
        this.business = res.business;
        this.selectedItems = res.category;
        if(this.business.active == 0)
            this.isActive = true;
        
    }
    getCountry(){
        this._restApiService.get('/address/getCountry').then(res => this.cb_getCountry(res))
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
    getStates(){
        this._restApiService.get('/address/getStates').then(res => this.cb_getStates(res))
    }
    cb_getStates(res){
        this.states = res.states;
    }
    stateChanged(country){
        if(country == "United States"){
            this.isStateManual = false;
        }
        else
            this.isStateManual = true;
    }
    addBusiness(){
        if(!this.isActive)
            this.business.active = 1;
        else
            this.business.active = 0;
        
        var request = {
            business:this.business,
            category:this.selectedItems,
            deleteCategory: this.deleteItems,
            userId:this.userId
        }
        if(this.id == 0)
        this._businessService.addUpdateBusiness(request).then(res => this.cb_addUpdateBusiness(res))
        else
        this._businessService.addUpdateBusiness(request).then(res => this.cb_updateBusiness(res))
    }
    cb_updateBusiness(res){
        if(res.isSuccess){
            console.log(res)
            this.isActive = false;
            this.businessName = this.business.name
            this.businessForm.reset();
            $('#successModal').modal('toggle');
        }
    }
    cb_addUpdateBusiness(res){
        if(res.isSuccess){
            console.log(res)
            this.isActive = false;
            this.businessName = this.business.name
            this.businessForm.reset();
            $('#saveModal').modal('toggle');
               AlertService.getInstance().publishMessage('success','Business added successfully..')
        }
    }
    modalUpdate(){
        $('#successModal').modal('toggle');
        this._router.navigate(['dashboard/review/',this.business.id,this.businessName]);
        
    }
    modalSave(){
        // $('#saveModal').modal('toggle');
        this._location.back();
        console.log("back")
    }
    mapAlertService(){
        SessionDataService.getInstance().alertService(""+"1");
    }
    onItemSelect(item:any){
        console.log(item);
        for(let x of this.selectedItems){
            for(let y of this.deleteItems){
                 if(x.id == y.id){
                    this.deleteItems.splice(this.deleteItems.indexOf(y))
                    console.log("index value ",this.deleteItems)
                 }
                }
            }
    
    }
    OnItemDeSelect(item:any){
        this.deleteItems.push(item);
        
        console.log("delete : "+JSON.stringify(this.deleteItems))
    }
    onSelectAll(items: any){
        console.log(items);
        for(let x of this.selectedItems){
            for(let y of this.deleteItems){
                 if(x.id == y.id){
                    this.deleteItems.splice(this.deleteItems.indexOf(y))
                    console.log("index value ",this.deleteItems)
                 }
                }
            }
    }
    onDeSelectAll(items: any){
        console.log(items);
    }
    editPicture(){
        this.isExistingImageAvailable=!this.isExistingImageAvailable;
        if(this.isExistingImageAvailable){
          this.EditPictureButtonLabel="Edit Picture"
        }else{
          this.EditPictureButtonLabel="Cancel Edit"
        }
       
      }
    uploadComplete(event){
       this.business.imageUrl = event.uploadedURL
       alert(this.business.imageUrl)
    }
    mapBusinessIdRefresh(){
        SessionDataService.getInstance().businessIdRefresh(""+this.id);
    }
    cancel(){
        this._location.back();
    }
    mailToClient(){
        this._router.navigate(['business/mail']);
    }
}