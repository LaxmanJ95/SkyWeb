import { Component,Output,EventEmitter,HostListener  } from '@angular/core';
import { SessionStorageService } from './com/common/service/com.common.sessionstorage';
import { UserMgmtService } from './com/usermgmt/service/com.service.usermgmt';
import {User} from './com/usermgmt/model/com.usermgmt.user.model'
import { CookieService } from 'ngx-cookie-service';
import { SessionDataService } from './com/common/service/com.common.sessiondata';
import $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './myapp.template.html',
  styleUrls: ['./app.component.css'],
  providers: [SessionStorageService,UserMgmtService,SessionDataService]
})
export class AppComponent {
  title = 'app';
  userName:any;
  user = new User();
  id:string;
  @Output()
  loginSuccess = new EventEmitter();
  constructor(private cookieService: CookieService,private _session : SessionStorageService,
    private _userMgmtService : UserMgmtService){
  
    console.log(this._session.getObject("userActivity"))
   
  }
  ngOnInit(){
    this.getCookies();
    this.getRefresh();
  }
 
  getCookies(){
    var cookies = this.cookieService.get('Test')
      // alert(cookies)
    if(cookies != null){
      var request = {
        value:cookies
      }
      this._userMgmtService.userActive(request).then(res => this.cb_getCookies(res))
    }
  }

  cb_getCookies(res){
    console.log("checking response : "+JSON.stringify(res))
    this.user = res.userProfile;
    // alert(res.roleId)
    this._session.setObject("roleId",res.roleId)
    this._session.setObject("userProfile",res.userProfile);
    // this._session.setObject("roleId",res.userProfile.roleId)
  
     this.getLoggedUser(res.roleId)
    this.loginSuccess.emit("Success")
  }
  getRefresh(){
    var refresh = this.cookieService.get("Refresh");
    if(refresh != null){
      var request = {
        value:null,
        refreshToken:refresh
      }
      this._userMgmtService.userActive(request).then(res => this.cb_getCookies(res))
    }
  }
  getLoggedUser(roleId){
    // alert(JSON.stringify(this.user))
    var userName;
    // var image = userProfileObj["profileImageUrl"]
    // this._session.setObject("image",image)
    if(this.user){
        userName = this.user.firstName;
        var userId = this.user.id;
       
        this._session.setObject("userId",userId)
        this._session.setObject("userName",userName)
        this.mapUserResponse(userId)
    }
    if(userName!=null){
        this.userName=userName;
    }
  }
  mapUserResponse(id){
    this.id = id
    SessionDataService.getInstance().updateSearch(""+this.id)
  }
}
