import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import  {FormControl, Validators,FormGroup,FormBuilder}  from '@angular/forms'; 
import {HashLocationStrategy, Location, LocationStrategy} from '@angular/common';

import {SessionDataService} from '../../common/service/com.common.sessiondata'
import { UserMgmtService } from '../service/com.service.usermgmt'
import {UsernameValidators} from '../signup/validators/com.usermgmt.username.validator'
import {UniqueUsernameValidators} from '../signup/validators/com.usermgmt.uniqueuser.validator'
declare var $ :any;
@Component({
  moduleId: module.id,
  selector: 'forgot-password',
  templateUrl: 'com.usermgmt.forgotpassword.html',
  styleUrls:['com.usermgmt.forgot.css'],
  providers: [SessionDataService,UserMgmtService],
})
export class ForgotPassword {
 username : string;
 isSuccess :boolean;
basicForm : FormGroup;
loginFailed:boolean = false;
isSpin:boolean=false;
 constructor(private _router: Router,
    private _userMgmtService: UserMgmtService,
    private fb: FormBuilder){
      this.basicForm = this.fb.group({ 
        //  _username: ['',Validators.required]
        _username: ['', Validators.compose([
                                              Validators.required,
                                              Validators.minLength(3),
                                              UsernameValidators.cannotContainSpace])   ]       
      });

  }
   onSubmit(f: NgForm) {
   this.isSpin = true;
    this._userMgmtService.forgotPassword({"username":this.username}).then(res => this.cb_forgotPassword(res))
  
  }
  cb_forgotPassword(res){
    this.isSpin = false;
    if(res.isSuccess){
      SessionDataService.getInstance().forgotPassword(''+1);
      this.isSuccess =res.isSuccess;
      this.loginFailed = false;
    }else{
      this.isSuccess =false;
      this.loginFailed= true;
    }
  }
  signIn(){
   
    $('#loginModal').modal('toggle');
  }

 }

  

