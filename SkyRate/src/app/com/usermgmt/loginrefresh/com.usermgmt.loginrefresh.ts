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
  selector: 'login-refresh',
  templateUrl: 'com.usermgmt.loginrefresh.html',
  styleUrls:['../forgot/com.usermgmt.forgot.css'],
  providers: [SessionDataService,UserMgmtService],
})
export class LoginRefreshComponent {

    constructor(private _router: Router,
        private _userMgmtService: UserMgmtService,
        private fb: FormBuilder){
        
      }

    signIn(){
        $('#loginModal').modal('toggle');
      }
}