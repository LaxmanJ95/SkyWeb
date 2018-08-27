import { Component , OnInit, OnDestroy,ElementRef,Output,EventEmitter, Input,Injector } from '@angular/core';
import { NgForm,FormBuilder,FormGroup,Validators } from '@angular/forms';
import { Router, ActivatedRoute,RouterModule } from '@angular/router';
import {HashLocationStrategy, Location, LocationStrategy} from '@angular/common';
import { BaseComponent } from '../../common/basic/com.common.basic.basecomponent';
import { RestApiService } from '../../common/service/restapi/com.common.service.restapiservice';
import { SessionStorageService } from '../../common/service/com.common.sessionstorage';
import { BusinessService } from '../../service/com.service.business';

import {Business,BusinessRatingSummary} from '../model/com.model.business'
import {Rating, Reviews} from '../model/com.model.ratingReview'
import { ReviewService } from '../../service/com.serivce.review';
import { SessionDataService } from '../../common/service/com.common.sessiondata';
import { AlertService } from '../../common/service/alert/com.common.service.alertservice';
import { Session } from 'selenium-webdriver';
declare var $:any;
@Component({
    selector:'review-list',
    templateUrl:'com.mainmodules.reviewList.html',
    styleUrls:['com.main.reviewList.css'],
    providers: [RestApiService,BusinessService,ReviewService,SessionDataService]
})
export class ReviewListComponent extends BaseComponent{
    id: number;
    subscription;
    count:number;
    userId:number;
    reviewId:number;
    mailReviewId:number;
    deleteReviewId:number;
    reviewComment:string;
    emailFrom:string;
    emailSubject:string;
    review = new Reviews()
    reviewList:any;
    ratingForm : FormGroup;
    emailupForm : FormGroup;
    @Input()
    businessId :number;
    @Output()
    refreshId = new EventEmitter();
    isSpin:boolean = false;
    isLoad:boolean = true;
    isButtonRefresh: boolean = false;
    lastCount:number;
    pageOrder:string="Newest first";
    constructor(injector:Injector,private _router: Router,
        private elRef:ElementRef,
        private _location: Location,
                  private _route: ActivatedRoute,
                  private _restApiService: RestApiService,
                  private _businessService:BusinessService,
                  private _ratingService: ReviewService,private fb: FormBuilder){
        super(injector)
        this.ratingForm = this.fb.group({ 
            _rating: ['',Validators.required],
            _reviewValue: [''],
             _recommendations: ['',Validators.required],
             _pricerating:[''],
             _speedrating:['']
          });
          this.emailupForm = this.fb.group({
            _emailFrom:[''],
            _emailSubject:['',Validators.required]
          });
        SessionDataService.getInstance().wishList$.subscribe(value=> {
            //alert(total);
            this.pageOrder = "Newest first"
          this.getReviews(value);
            //console.log("Header Total cart items:"+total);
          });
      
    }
    ngOnInit(){
       
        this.id = this.businessId;
        SessionDataService.getInstance().refresh$.subscribe(value =>{
            this.userId = this._sessionStorageService.getObject("userId")
            if(this.userId == null)
            this.userId = 0;
            //  alert(this.userId)
        });
       this.userId = this._sessionStorageService.getObject("userId")
       if(this.userId == null)
            this.userId = 0;
        console.log("id value ",this.businessId)
        this.getReviews(this.id)
    
    }
    
    getReviews(id){
        this._restApiService.getById('/rating/getReviewByBusiness',id).then(res=>this.cb_getReviews(res))
    }
    cb_getReviews(res){
        this.isSpin = false;
        if(res.isSuccess){
            console.log(JSON.stringify(res))
        this.reviewList = res.reviewList;
        this.count = this.reviewList.length;
        var totalCount = res.count;
        if(totalCount == this.count){
            this.isLoad = false      
        }
        else{
            this.isLoad = true;
        } 
        }
        
    }
    commentData(id,data){
        this.reviewId = id;
      this._restApiService.getById('/rating/getReviewById',id).then(res =>this.cb_editData(res))
    }
    cb_editData(res){
        this.review = res.reviews
    }
    saveReview(){
        var request = {
            review:this.review,
            date: "" 

        }
        this._ratingService.editReview(request).then(res => this.cb_saveReview(res) )
    }
    cb_saveReview(res){
        if(res.isSuccess){
            this.getReviews(this.id)
            this.refreshId.emit(1)
        }
    }
    deleteReview(id){
        this.deleteReviewId = id;
    }
    delete(){
        var request = {
            id:this.deleteReviewId,
            businessId:this.businessId
        } 
        this._ratingService.deleteReview(request).then(res => this.cb_delete(res))
    }
    cb_delete(res){
        if(res.isSuccess){
            this.getReviews(this.businessId)
            this.refreshId.emit(1)
        }
    }
    checkToEdit(){
        return this.reviewId
    }
    pageOrderSelection(value){
        this.pageOrder = value;
         this.getLoadMore();
    }
    getLoadMore(){
        this.isSpin = true;
        // alert(this.pageOrder)
        var request = {
            value:this.count,
            businessId:this.businessId,
            pageOrder:this.pageOrder
        }
        this._ratingService.getReviewPagination(request).then(res => this.cb_getLoadMore(res))
    }
    cb_getLoadMore(res){
        this.isSpin = false;
        this.reviewList = res.reviewList;
        this.count = this.reviewList.length;
        var totalCount = res.count;
        if(totalCount == this.count)
            this.isLoad = false;
        else
            this.isLoad = true;
    }
    storeId(id,userId){
        // alert(userId)
        this.mailReviewId = id
        // alert(this.mailReviewId)
        SessionDataService.getInstance().toIdMail(''+userId);
        this._sessionStorageService.setObject('toId',userId);
        var request = {
            fromId:this.userId,
            reviewId:this.mailReviewId
        }
        this._ratingService.mailToReviewer(request).then(res => this.cb_submitEmail(res))
    }
    submitEmail(){
        // this.isButtonRefresh = true;
       
    }
    cb_submitEmail(res){
        this._router.navigate(['business/message'])
        // this.isButtonRefresh = false;
        // if(res.isSuccess){
        //     $('#questionModal').modal('toggle');
        //     // AlertService.getInstance().publishMessage('success','Email Sent');
        //     this.emailupForm.reset();
        //     $('#successModal').modal('toggle');
        // }
    }
    moveToUserReport(id,name){
        if(this.userId != 0)
            this._router.navigate(['dashboard/userReport/'+id,name]);
        else
            $('#loginModal').modal('toggle');
    }
    
}