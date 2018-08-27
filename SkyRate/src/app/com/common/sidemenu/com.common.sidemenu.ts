import { Component,ViewChild,ElementRef } from '@angular/core';
import {FormComponent} from '../../common/basic/com.common.basic.formcomponent';
import {Injector} from '@angular/core';
import {UserProfileService} from '../../usermgmt/service/com.service.userprofile';
import { RestApiService } from '../service/restapi/com.common.service.restapiservice';
import {PopoverModule} from "ngx-popover";
import { SessionStorageService } from '../service/com.common.sessionstorage';
import { SessionDataService } from '../service/com.common.sessiondata';
import { CookieService } from 'ngx-cookie-service';

declare var $ :any;
@Component({
  moduleId:module.id,
  selector: 'side-menu',
  styleUrls:['com.common.sidemenu.css'],
  templateUrl: 'com.common.sidemenu.html',
  providers:[RestApiService,SessionDataService,CookieService]
})
export class SideMenu extends FormComponent{
    roleId:number = 4;
    userId: number = 0;
    tabId:number = 0;
    categories:any;
    userName:string=""
    isUser:boolean = false;
    forgotRefresh:number =0;
    user:any;
    refresh:any;
    id:number;
    subCategories:any;
    profileImg:string='boy.png';
    // isCollapsed = true;
  
    
     constructor(injector:Injector, private _userProfileService: UserProfileService,
      private _cookieService:CookieService,
      protected _sessionStorageService : SessionStorageService,
    private _restService:RestApiService) {
       
          super(injector);
          
        
        this.userName = this._sessionStorageService.getObject("userName")
        this.profileImg = this._sessionStorageService.getObject("image")
        if(this.profileImg == null)
          this.profileImg = 'boy.png';
      if(this.userName != "" && this.userName != null){
        this.isUser = true;
       
      }
      
       
     }
     ngOnInit(){
      // this.openLogin();
     console.log(window.location.href)
     this.roleId = this._sessionStorageService.getObject("roleId")
     if(this.roleId == null)
      this.roleId = 4;
     this.userName = this._sessionStorageService.getObject("userName")
     SessionDataService.getInstance().updateSearch$.subscribe(value=> {
       this.id = value
     if(this.id != 0){
      this.userName = this._sessionStorageService.getObject("userName")
      this.roleId = this._sessionStorageService.getObject("roleId")
      this.isUser = true;
     }
    });
    SessionDataService.getInstance().forgotPass$.subscribe(value => {
      var valueOf = value;
      this.forgotRefresh = +valueOf;
    });
    SessionDataService.getInstance().refresh$.subscribe(value => {
      this.refresh = value;
      this.profileImg = this._sessionStorageService.getObject("image")
      if(this.profileImg == null)
        this.profileImg = 'assets/img/boy.png';
      this.roleId = this._sessionStorageService.getObject("roleId")
      if(this.roleId == null)
      this.roleId = 4;
      if(value == "0")
        this.logOut()
    })
  
    }
    openLoginModal(){
    
        $('#loginModal').modal('toggle');
   
    }
     openLogin(){
       $('.signUpTab').hide();
       $('#signUp').removeClass('new-tab')
      //  $('#login').addClass('new-tab')
       $('.loginTab').show();
       this.tabId = 0;
     }
     openSignUp(){
       $('.loginTab').hide();
       $('#login').removeClass('new-tab')
       $('#signUp').addClass('new-tab')
       $('.signUpTab').show();
       this.tabId = 1;
     }
    
    getLogin(){
      if(this.tabId == 0){
        var styles = {
          'color':'#1b7ce2',
          'border-bottom':'3px solid #1b7ce2'
        }
        return styles;
      }
    }
    loginResult(value){
      $('#loginModal').modal('toggle');
      // this._router.navigate(['search']);
      if(value == "Success"){
        this.userName = this._sessionStorageService.getObject("userName");
        this.isUser = true; 
      }
      if(this.forgotRefresh == 1){
        SessionDataService.getInstance().forgotPassword(''+0);
        this._router.navigate([''])
      }
      
    }
    registerResult(value){
    
      // $(function () {
        $('#loginModal').modal('toggle');
        // this._router.navigate(['search']);
    // }); 
    if(value == "Success"){
      this.userName = this._sessionStorageService.getObject("userName")
      this.roleId = this._sessionStorageService.getObject("roleId")
      if(this.roleId == null)
       this.roleId = 4;
      this.isUser = true;
    }
    else{
      this.isUser = false;
      $(function () {
        $('#registerModal').modal('toggle');
    });
    }
    }

    profileUpdate(){
      this._router.navigate(['skyrate/profile-update']);
    }
    admin(){
      this._router.navigate(['admin/report'])
    }
    inbox(){
      this._router.navigate(['business/message'])
    }
    claimBusiness(){
      this._router.navigate(['business/business-claimed'])
    }
    favorite(){
      this._router.navigate(['dashboard/popular-searches/'],{ queryParams: { category: "Favorite" } });
    }
    logOut(){
      this._sessionStorageService.clear();
      this._cookieService.deleteAll()
      if(this.refresh != "0")
      this._router.navigate([''])
      this.isUser = false;
    }
    forgotPassword(){
      $('#loginModal').modal('toggle');      
    }
    getQuery(){
     
    }
 }
