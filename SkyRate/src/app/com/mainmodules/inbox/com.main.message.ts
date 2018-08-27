import {Component, Injector, AfterViewChecked, ElementRef, ViewChild,} from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router'

import { BusinessService } from '../../service/com.service.business';
import { BaseComponent } from '../../common/basic/com.common.basic.basecomponent';
import {Messenger} from '../model/com.model.message'
import { RestApiService } from '../../common/service/restapi/com.common.service.restapiservice';
import { SessionDataService } from '../../common/service/com.common.sessiondata';
import { MessageService } from '../../service/com.service.message';
import { UserMgmtService } from '../../usermgmt/service/com.service.usermgmt';
import { User } from '../../usermgmt/model/com.usermgmt.user.model';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';


declare var $:any;

@Component({
    selector:'message',
    templateUrl:'com.main.message.html',
    styleUrls:['com.main.message.css'],
    providers:[MessageService,UserMgmtService,RestApiService,SessionDataService]
})
export class MessageComponent extends BaseComponent{
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;
    user = new User();
    message: string;
    messages:any;
    readCount:any;
    inboxes:any;
    userId :any;
    toId:number;
    toName:string="";
    messenger = new Messenger();
    private serverUrl = 'http://localhost:8080/socket'
    private title = 'WebSockets chat';
    private stompClient;
    constructor(injector:Injector,
        private _router : Router,
        private _restApiService:RestApiService,
        private _userMgmtService: UserMgmtService,
        private _messageService : MessageService,
        private _route : ActivatedRoute){
        super(injector);
        
        this.userId = this._sessionStorageService.getObject('userId')
       
    }
    ngOnInit(){
        this.toId = this._sessionStorageService.getObject('toId');
        SessionDataService.getInstance().toId$.subscribe(value=> {
            var id = value;
            this.toId = +id; 
        });    
        // $('#div1').scrollTop($('#div1')[0].scrollHeight);  
        this.getToUser();  
        this.getInbox();
        this.getReadCount();
        this.getMessageList();
        this.scrollToBottom();  
        // this.initializeWebSocketConnection();      
    }
    ngAfterViewChecked() {        
        this.scrollToBottom();        
    } 
    getToUser(){
        var request = {
            id:this.toId
        }
        if(this.toId)
        this._userMgmtService.getUserById(request).then(res => this.cb_getUserById(res))
    }
    cb_getUserById(res){
        this.user = res.user;
        this.toName = this.user.firstName
    }
    getInbox(){
        var request = {
            id:this.userId
        }
        this._messageService.getInboxById(request).then(res => this.cb_getInbox(res));
    }
    cb_getInbox(res){
        this.inboxes = res.messages;
        console.log(JSON.stringify(this.inboxes))
    }
    getReadCount(){
        var request = {
            id:this.userId
        }
        this._messageService.getReadCount(request).then(res => this.cb_getReadCount(res));
    }
    cb_getReadCount(res){
        this.readCount = res.readCount;
    }
    getMessageList(){
        var request = {
            fromId:this.userId,
            toId:this.toId
        }
        this._messageService.getMessagesById(request).then(res => this.cb_getMessageList(res))
    }
    cb_getMessageList(res){
        this.messages = res.messages;
    }
    getByConversation(id,to,from, fromName,toName){
        if(to != this.userId){
            this.toName = toName;
            this.toId = to;
        }
        else{
            this.toId = from;
            this.toName = fromName;
        }
        var request = {
            id:id,
            toId:to
        }
        this._messageService.getConversationById(request).then(res => this.cb_getByConversation(res))
    }
    cb_getByConversation(res){
        this.messages = res.messages;
        this.getInbox();
    }
    sendMessage(){
        var request = {
            from: this.userId,
            to:this.toId,
            message:this.message
        }
        this._messageService.addMessage(request).then(res => this.cb_addMessage(res))
    }
    cb_addMessage(res){
        if(res.isSuccess){
            this.message = "";
            this.getMessageList();
            this.getInbox();
        }
    }
   
    getStyles(x){
        if(x == this.userId){
            var styles = {
                'float':'right'
            }
            return styles;
        }
    }
    getTextStyles(x){
        if(x == this.userId){
            var styles = {
                'background-color': 'rgb(148, 181, 183)',
                'color': 'black'
            }
            return styles;
        }
    }
    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch(err) { }                 
    }
    // initializeWebSocketConnection(){
    //     let ws = new SockJS(this.serverUrl);
    //     this.stompClient = Stomp.over(ws);
    //     let that = this;
    //     this.stompClient.connect({}, function(frame) {
    //       that.stompClient.subscribe("/topic", (message) => {
    //         if(message.body) {
    //           $(".chat").append("<div class='message'>"+message.body+"</div>")
    //           console.log(message.body);
    //         }
    //       });
    //     });
    //   }
    
    //   sendMessage(message){
    //     this.stompClient.send("/app/send/message" , {}, message);
    //     $('#input').val('');
    //   }
    
}