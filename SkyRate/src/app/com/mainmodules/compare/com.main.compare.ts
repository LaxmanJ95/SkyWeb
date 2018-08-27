import {Component, Injector} from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router'

import { BusinessService } from '../../service/com.service.business';
import { BaseComponent } from '../../common/basic/com.common.basic.basecomponent';
import { RestApiService } from '../../common/service/restapi/com.common.service.restapiservice';


@Component({
    selector:'compare',
    templateUrl:'com.main.compare.html',
    styleUrls:['com.main.compare.css'],
    providers:[BusinessService,RestApiService]
})
export class CompareBusinessComponent extends BaseComponent{

    userId:number;
    compareList:any;
    comparableValue = [];
    compareId:any;
    columnSeperation:number = 4;
    constructor(injector:Injector,
        private _router : Router,
        private _restApiService:RestApiService,
        private _businessService : BusinessService,
        private _route : ActivatedRoute){
        super(injector);
        this.userId = this._sessionStorageService.getObject("userId")
        this.getFavorite()
    }


    getFavorite(){
        this._restApiService.getById("/business/getFavorite",this.userId).then(res => this.cb_getFavorite(res))
    }
    cb_getFavorite(res){
        this.compareList = res.bookmark
        console.log("favorite response:  "+JSON.stringify(this.compareList))
        this.compareId = this._sessionStorageService.getObject("compareValue")
        for(let x of this.compareId){
            for(let y of this.compareList){
                if(x == y.businessId){
                    this.comparableValue.push(y)
                }
            }
        }
       console.log("comare res",JSON.stringify(this.comparableValue))
       this.getColumnSeperation()
    }
    getColumnSeperation(){
        if(this.comparableValue.length == 4){
            this.columnSeperation = 3
        }
        if(this.comparableValue.length == 2){
         this.columnSeperation = 5
         }
    }

    headerStyle(){
        var styles;
        if(this.columnSeperation == 3){
            styles = {
                'height': '200px'
            }
        }
        else{
            styles = {
                'height' : '150px'
            }
        }
        return styles
    }

    deleteBusiness(value){
        this.comparableValue.splice(value, 1); 
        this.getColumnSeperation()
    }
}