
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
export class MessageService extends BaseService{

    private GET_MESSAGE_LIST_URL = this._APIURL+"/message/getMessagesById";
    private ADD_MESSAGE_URL = this._APIURL+ "/message/addMessage";
    private INBOX_BY_ID_URL = this._APIURL+ "/message/getInboxById";
    private GET_CONVERSATION_BY_ID = this._APIURL+ "/message/getByConversationId";
    private GET_READ_COUNT_URL = this._APIURL+ "/message/getReadCount";
    private MAIL_TO_CLIENT = this._APIURL+ "/message/mailToClient";

    constructor(
        private _userProfileService: UserProfileService,
        injector:Injector) {

          super(injector);
          //this.initURL(this._configService);

          
    }
    addMessage(request:any){
        return this._http.post(this.ADD_MESSAGE_URL,JSON.stringify(request),this._httpHeaderOptions)
        .toPromise()
        .then(res=>res.json())
    }
    
    getMessagesById(request:any){
        return this._http.post(this.GET_MESSAGE_LIST_URL,JSON.stringify(request),this._httpHeaderOptions)
        .toPromise()
        .then(res=>res.json())
    }

    getInboxById(request:any){
        return this._http.post(this.INBOX_BY_ID_URL,JSON.stringify(request),this._httpHeaderOptions)
        .toPromise()
        .then(res=>res.json())
    }

    getConversationById(request:any){
        return this._http.post(this.GET_CONVERSATION_BY_ID,JSON.stringify(request),this._httpHeaderOptions)
        .toPromise()
        .then(res=>res.json())
    }

    getReadCount(request:any){
        return this._http.post(this.GET_READ_COUNT_URL,JSON.stringify(request),this._httpHeaderOptions)
        .toPromise()
        .then(res=>res.json())
    }

    mailToClient(request:any){
        return this._http.post(this.MAIL_TO_CLIENT,JSON.stringify(request),this._httpHeaderOptions)
        .toPromise()
        .then(res=>res.json())
    }
}