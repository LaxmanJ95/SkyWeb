import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {routing} from './app.routing';
import {APP_BASE_HREF} from '@angular/common';
import {HttpClientModule} from '@angular/common/http'
import {APP_INITIALIZER} from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms';
// import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { AppComponent } from './app.component';
import {PopoverModule} from "ngx-popover";

// import { NgSelectModule , NgOption} from '@ng-select/ng-select';
let localStorageServiceConfig = {
  prefix: 'my-app',
  storageType: 'sessionStorage'
};

import { UserMgmtModule } from './com/usermgmt/com.usermgmt.module';
import {UsermgmtRouting} from './com/usermgmt/com.usermgmt.routing';
import { HomeModule } from './com/home/com.home.module';
import { CommonModule } from './com/common/com.common.module';
import {ConfigService} from './com/common/service/config/com.common.service.config.configmanager';
import {AppUtil} from './app.util';
import {MainModule} from './com/mainmodules/com.main.modules'
import {MainModuleRouting} from './com/mainmodules/com.main.routing'
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    // NgMultiSelectDropDownModule.forRoot(),
    // NgSelectModule,
    HomeModule, 
    MainModule,
    UserMgmtModule,
    UsermgmtRouting,
    MainModuleRouting,
    routing
  ],
  bootstrap:    [ AppComponent ],
  providers: [{provide: APP_BASE_HREF, useValue : '/' }, 
  CookieService,
  ConfigService,
      {
      provide: APP_INITIALIZER,
      useFactory:AppUtil.initFactory,
     // useFactory: (config:ConfigService) => () => config.load(),
      deps: [ConfigService],
      multi: true
    }


  ]
  
})

export class AppModule { }
