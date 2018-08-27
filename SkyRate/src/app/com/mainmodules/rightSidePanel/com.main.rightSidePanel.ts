import {Component, Injector} from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router'

import { BusinessService } from '../../service/com.service.business';
import { BaseComponent } from '../../common/basic/com.common.basic.basecomponent';
import { RestApiService } from '../../common/service/restapi/com.common.service.restapiservice';
import { SessionDataService } from '../../common/service/com.common.sessiondata';
declare var $:any;

@Component({
    selector:'right-side',
    templateUrl:'com.main.rightSidePanel.html',
    styleUrls:['com.main.rightSidePanel.css'],
    providers:[BusinessService,RestApiService,SessionDataService]
})
export class RightSideComponent extends BaseComponent{

    userId:number;
    favoriteList:any;
   
    constructor(injector:Injector,
        private _router : Router,
        private _restApiService:RestApiService,
        private _businessService : BusinessService,
        private _route : ActivatedRoute){
        super(injector);
        SessionDataService.getInstance().refresh$.subscribe(value =>{
            this.userId = this._sessionStorageService.getObject("userId")
            //  alert(this.userId)
            if(this.userId != 0)
            this.getFavorite();
        });
        SessionDataService.getInstance().favoriteRefresh$.subscribe(value => {
            this.getFavorite();
        });
       this.userId = this._sessionStorageService.getObject("userId")
       if(this.userId == null)
            this.userId = 0;
        if(this.userId != 0)
            this.getFavorite()
    }

  addBusiness(){
      if(this.userId != 0)
        this._router.navigate(['business/update_business']);
      else
         $('#loginModal').modal('toggle');
  }  
  getFavorite(){
    this._restApiService.getById("/business/getFavorite",this.userId).then(res => this.cb_getFavorite(res))
    }
    cb_getFavorite(res){
        
        this.favoriteList = res.bookmark;
        console.log("bookmar response : ",this.favoriteList)
    }
    reviewBusiness(id,name){
        this._router.navigate(['dashboard/review/'+id,name]);
    }
    moveToFavorite(){
        this.mapFavoriteRefresh();
        this._router.navigate(['dashboard/popular-searches/'],{ queryParams: { category: "Favorite" } });
    }
    mapFavoriteRefresh(){
        SessionDataService.getInstance().moveFavorites(""+"2")
    }
}