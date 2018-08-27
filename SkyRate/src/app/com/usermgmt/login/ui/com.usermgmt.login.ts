import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm,FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {Injector} from '@angular/core';
//-----
import {UserExt,User} from '../../model/com.usermgmt.user.model'
import { UserMgmtService } from '../../service/com.service.usermgmt'
import {SessionStorageService} from '../../../common/service/com.common.sessionstorage';
import {BaseComponent} from '../../../common/basic/com.common.basic.basecomponent';

import { CookieService } from 'ngx-cookie-service';
import { SessionDataService } from '../../../common/service/com.common.sessiondata';
declare var $:any;
@Component({
  moduleId:module.id,
  selector: 'login',
  templateUrl: 'com.usermgmt.newlogin.html',
  styleUrls: ['../styles/com.usermgmt.login.css'],
  providers: [UserMgmtService,SessionStorageService,SessionDataService ]

})
export class LoginComponent extends BaseComponent{
  loginFailed :boolean = false;
  userName:string='';
  email:string;
  password:string;
  user = new User();
  remember:boolean= false;
  loginForm : FormGroup;
  cookieValue:string="UNKNOWN";
  @Output()
  loginSuccess = new EventEmitter();

  constructor(private _router: Router,
    private cookieService: CookieService,
    private _userMgmtService: UserMgmtService,
    private fb: FormBuilder,
         injector:Injector) {
          super(injector); 
          //this.getLoggedUser();
          console.log('ngConstructor()')
          this.loginForm = this.fb.group({ 
              _email: ['', Validators.required],
             _password: ['', Validators.compose([
                                                   Validators.required,
                                                   Validators.minLength(3)])],
           });
  }

  onSubmit() {
  
    this._sessionStorageService.clear();
    var request = {
      email:this.email,
      password:this.password,
      rememberMe:this.remember
    }
    this._userMgmtService.login(request).then(res => this.cb_login(res))

  }

  cb_login(res) {
    if (res.isSuccess) {
      this.loginForm.reset();
      this.remember = false;
    //   alert(res.userProfile.userExt);
      // if(res.userProfile.userExt==null){
       
      //   var userExt = new UserExt();
      //   userExt.profileImageUrl='app/img/profile-avatar.png';
      //   res.userProfile.userExt = userExt;

      // }
      this.cookieService.set( 'Test', res.userActive );
      this.cookieValue = this.cookieService.get('Test');
       this._sessionStorageService.setObject("userActivity",res.userActive);
       var cookies = this._sessionStorageService.getObject("userActivity")
      this.user = res.userProfile;
      this._sessionStorageService.setObject("userProfile",res.userProfile);
      this.cookieService.set("Refresh",res.userRefresh);
      this._sessionStorageService.setObject("roleId",res.roleId)
      // alert(this.cookieService.get("Refresh"))
      this.getLoggedUser();
      this.loginSuccess.emit("Success");
      console.log(JSON.stringify(this._sessionStorageService.getObject("userProfile")))
     
      this._loggingService.logInfo(this.getName(),"User Profile:"+JSON.stringify(this._sessionStorageService.getObject("userProfile")))
     // alert(JSON.stringify(res.userProfile.address))
      // if(res.userProfile.address){
        // this._router.navigate(['search'])
      // }else{
      //   this._router.navigate(['dashboard/user-profile'])
      // }
    } else {
    //  this._router.navigate([''])
    // this.loginSuccess.emit("Failure");
      this.loginFailed = true;
    }

  }
  inputFocus(){
    this.loginFailed=false;
  }
  forgotPassword(){
    $('#loginModal').modal('toggle');
    this._router.navigate(['skyrate/forgot-password'])
  }
  mapRefreshResponse(){
    SessionDataService.getInstance().refresh(""+1)
  }
  getLoggedUser(){
        var userProfileObj = this._sessionStorageService.getObject("userProfile");
        var userName;
        var image = this.user.profileImageUrl
        this._sessionStorageService.setObject("image",image)
        if(userProfileObj){
          userName = this.user.firstName;
          var userId = this.user.id;
           
            this._sessionStorageService.setObject("userId",userId)
            this._sessionStorageService.setObject("userName",userName)
        }
        if(userName!=null){
            this.userName=userName;
        }
        this.mapRefreshResponse();
  }
  
/*
   ngOnInit() {
    // Properties are resolved and things like
    // this.mapWindow and this.mapControls
    // had a chance to resolve from the
    // two child components <map-window> and <map-controls>
    console.log('ngOnInit()')
  }
  ngOnDestroy() {
    // Speak now or forever hold your peace
    console.log('ngOnDestroy()')
  }
  ngDoCheck() {
    // Custom change detection
    console.log('ngDoCheck()')
  }
  ngOnChanges(changes) {
    // Called right after our bindings have been checked but only
    // if one of our bindings has changed.
    //
    // changes is an object of the format:
    // {
    //   'prop': PropertyUpdate
    // }
    console.log('ngOnChanges()')
  }
  ngAfterContentInit() {
    // Component content has been initialized
    console.log('ngAfterContentInit()')
  }
  ngAfterContentChecked() {
    // Component content has been Checked
    console.log('ngAfterContentChecked()')
     this.getLoggedUser();
  }
  ngAfterViewInit() {
    // Component views are initialized
    console.log('ngAfterViewInit()')
  }
  ngAfterViewChecked() {
    // Component views have been checked
     console.log('ngAfterViewChecked()')
  }*/
}