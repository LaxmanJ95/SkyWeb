
import { Headers } from '@angular/http';
import { RequestOptions } from '@angular/http';
import { Injectable, Inject,ViewChild,ElementRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { Subject }    from 'rxjs/Subject';
import {Injector} from '@angular/core';


import {ConfigService} from './../common/service/config/com.common.service.config.configmanager';
import {LoggingService} from './../common/service/logging/com.common.service.logging';
import {HttpUtil} from './../common/util/com.common.util.httputil'
import {SessionDataService} from '../common/service/com.common.sessiondata'
import {UserProfileService} from '../usermgmt/service/com.service.userprofile';
import {SessionStorageService} from '../common/service/com.common.sessionstorage';
import {BaseService} from '../common/basic/com.common.basic.baseservice';
import {Observable} from 'rxjs/Observable';
import { URLSearchParams , Http } from '@angular/http';
@Injectable()
export class BusinessService extends BaseService{

    private SEARCH_BUSINESS_URL=  this._APIURL+ "/business/searchBusiness";
    private GET_BUSINESS_BY_ID_URL = this._APIURL+ "/business/getBusinessById";
    private GET_BUSINESS_PAGINATION_URL = this._APIURL+ "/business/getBusinessByPagination";
    private GET_POPULAR_SEARCH_URL = this._APIURL+ "/business/popularSearches";
    private ADD_BUSINESS_URL = this._APIURL+ "/business/addUpdateBusiness"
    private BUSINESS_EXISTS_URL = this._APIURL+ "/business/businessNameExists"
    private UPDATE_BUSINESS_APPROVAL = this._APIURL+ "/business/updateApproval"
    private UPDATE_BUSINESS_ACTIVE = this._APIURL+ "/business/setBusinessActive"
    private GET_CLAIMED_BUSINESS_URL = this._APIURL+ "/business/getClaimed"
    private GET_CLAIMED_BUSINESS_PAGINATION_URL = this._APIURL+ "/business/getClaimedPagination"
    userId :any;

    constructor(
        private _userProfileService: UserProfileService,
        injector:Injector) {

          super(injector);
          //this.initURL(this._configService);
          this.userId = _userProfileService.getUserId();
       //   this._loggingService.logDebug( this.getName(), "APIService"+this._configService.getProperty("APIService"));
          this._loggingService.logInfo( this.getName(), "UserId:"+this.userId);

          
    }
    
    searchBusiness(request : any){
        return this._http.post(this.SEARCH_BUSINESS_URL, JSON.stringify(request), this._httpHeaderOptions)
            .toPromise()
            .then(res => res.json());
    }
    getBusinessById(request:any){
        return this._http.post(this.GET_BUSINESS_BY_ID_URL,JSON.stringify(request),this._httpHeaderOptions)
        .toPromise()
        .then(res=>res.json())
    }
    getBusinessPagination(request:any){
        return this._http.post(this.GET_BUSINESS_PAGINATION_URL,JSON.stringify(request),this._httpHeaderOptions)
        .toPromise()
        .then(res=>res.json())
    }
    getPopularSearch(request:any){
        return this._http.post(this.GET_POPULAR_SEARCH_URL,JSON.stringify(request),this._httpHeaderOptions)
        .toPromise()
        .then(res=>res.json())
    }
    addUpdateBusiness(request:any){
        return this._http.post(this.ADD_BUSINESS_URL,JSON.stringify(request),this._httpHeaderOptions)
        .toPromise()
        .then(res=>res.json());
    }
    businessExists(business:string){
        return this._http.post(this.BUSINESS_EXISTS_URL,{"business":business},this._httpHeaderOptions)
        .toPromise()
        .then(res=>res.json());
    }
    updateApproval(request){
        return this._http.post(this.UPDATE_BUSINESS_APPROVAL,JSON.stringify(request),this._httpHeaderOptions)
        .toPromise()
        .then(res=>res.json());
    }
    setActive(request){
        return this._http.post(this.UPDATE_BUSINESS_ACTIVE,JSON.stringify(request),this._httpHeaderOptions)
        .toPromise()
        .then(res=>res.json());
    }
    claimedBusiness(request){
        return this._http.post(this.GET_CLAIMED_BUSINESS_URL,JSON.stringify(request),this._httpHeaderOptions)
        .toPromise()
        .then(res=>res.json());
    }
    getClaimedPagination(request){
        return this._http.post(this.GET_CLAIMED_BUSINESS_PAGINATION_URL,JSON.stringify(request),this._httpHeaderOptions)
        .toPromise()
        .then(res=>res.json());
    }

}