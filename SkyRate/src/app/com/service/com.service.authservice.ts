import { Injectable,OnInit,Injector } from '@angular/core';
import { CanActivate, CanActivateChild,Router} from '@angular/router';
import { SessionStorageService } from '../common/service/com.common.sessionstorage';
import { SessionDataService } from '../common/service/com.common.sessiondata';


class Permissions {
  canActivate(role): boolean {
   if(role < 3)
      return true;
   else
      return false;
  }
}
@Injectable()
export class AuthGuard implements OnInit,CanActivate, CanActivateChild {

  userId:number = 0;
  roleId:number;
  moreOption:number = 0;
constructor(
private _sessionStorageService : SessionStorageService,
private _router: Router,injector:Injector,){
  
    }
  ngOnInit(){
  
  }

  canActivate() {
    console.log('checking  route access');
    this.userId = this._sessionStorageService.getObject("userId");
    this.roleId = this._sessionStorageService.getObject("roleId");
    var actAdmin = this._sessionStorageService.getObject("moreOption")
    
    if(this.roleId <= 2 || this.userId == actAdmin){
            return true;        
    }
    else{
        return false;
    }
    
  }

  canActivateChild() {
    
    console.log('checking child route access');
    this.roleId = this._sessionStorageService.getObject("roleId");
    alert(this.roleId)
    if(this.roleId == 1)
      return true;
    else
      return false;
        
  }

  

}