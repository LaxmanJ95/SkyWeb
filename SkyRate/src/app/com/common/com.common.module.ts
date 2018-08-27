import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule}  from '@angular/forms';
import { HeaderComponent }   from './header/com.common.header';
import { FooterComponent }   from './footer/com.common.footer';
import { Menu }   from './menu/com.common.menu';
import { HomeMenu }   from './menu/com.common.homemenu';
import {UserHeader} from './userheader/com.usermgmt.userheader';
import {Alert} from './alert/com.common.alert';
import {APP_BASE_HREF} from '@angular/common';
import {Router ,Routes, RouterModule } from '@angular/router';
import {UserProfileService} from '../usermgmt/service/com.service.userprofile';
import {SessionStorageService} from '../common/service/com.common.sessionstorage';
import {LoggingService} from '../common/service/logging/com.common.service.logging';
//import {UserMgmtModule} from '../usermgmt/com.usermgmt.module'
import {ConfigService} from './service/config/com.common.service.config.configmanager';
import {ImageUploader} from './imageuploader/com.common.imageuploader';
import {FileUploadModule} from "ng2-file-upload";

import {APP_INITIALIZER} from '@angular/core'
import {Modal} from './modal/com.common.mymodal'
import { RestApiService } from './service/restapi/com.common.service.restapiservice';
import {SideMenu} from './sidemenu/com.common.sidemenu'
import {Logo} from './logo/com.common.logo'
import { TextMaskModule } from 'angular2-text-mask';
// import {NgxMaskModule} from 'ngx-mask'
import {PopoverModule} from "ngx-popover";
import {RegisterComponent} from './register/com.common.register'
import { LoginComponent }   from './../usermgmt/login/ui/com.usermgmt.login';
import { EqualValidator } from './register/model/com.validation.password';
// import {MainModule} from '../mainmodules/com.main.modules'

@NgModule({
  imports:      [ PopoverModule,TextMaskModule,BrowserModule,FormsModule,ReactiveFormsModule ,RouterModule,FileUploadModule],
 declarations: [ HeaderComponent,EqualValidator,RegisterComponent,LoginComponent,SideMenu,Logo, FooterComponent,UserHeader,Menu,HomeMenu,Alert,ImageUploader,Modal],
  exports:    [  HeaderComponent,RegisterComponent,LoginComponent,SideMenu,Logo,FooterComponent,UserHeader,Menu,HomeMenu,Alert,ImageUploader,Modal],
//   providers: [{provide: APP_BASE_HREF, useValue : '/' },
//   UserProfileService ,
//  SessionStorageService,
//  LoggingService]
/*providers: [

  ConfigService,
      {
      provide: APP_INITIALIZER,
      useFactory:AppUtil.initFactory,
     // useFactory: (config:ConfigService) => () => config.load(),
      deps: [ConfigService],
      multi: true
    }]*/

})
export class CommonModule { }