import {Component, Injector} from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router'

import { BusinessService } from '../../service/com.service.business';
import { BaseComponent } from '../../common/basic/com.common.basic.basecomponent';
import { SessionDataService } from '../../common/service/com.common.sessiondata';


@Component({
    selector:'trending-business',
    templateUrl:'com.main.trendingbusiness.html',
    styleUrls:['com.main.trendingbusiness.css'],
    providers: [BusinessService,SessionDataService]
})
export class TrendingBusinessComponent extends BaseComponent{

    userId:number;
    trendingBusiness:any;

    constructor(injector:Injector,
        private _router : Router,
        private _businessService : BusinessService,
        private _route : ActivatedRoute,
       ) {
        super(injector); 
       
       this.userId = this._sessionStorageService.getObject("userId")
       if(this.userId == null)
            this.userId = 0;

        this.getTrendingBusiness()
    }

    getTrendingBusiness(){
        var request = {
            category:"",
            enablePopular:0
        }
        this._businessService.getPopularSearch(request).then(res => this.cb_getTrendingBusiness(res))
    }
    cb_getTrendingBusiness(res){

        console.log("Mark to response : ",res)
        this.trendingBusiness = res.popularSearch
    }
    getBusiness(id,name){
        // alert(name)
        this._router.navigate(['dashboard/review/'+id,name]);
    }
}