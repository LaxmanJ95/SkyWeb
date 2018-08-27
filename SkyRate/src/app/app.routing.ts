import {Router , RouterModule, PreloadAllModules } from '@angular/router';


import { HomeMainComponent }   from './com/home/main/com.home.main';
import { BeforeSearchComponent } from './com/mainmodules/homepage/beforeSearch/com.beforeSearch';

export const routing = RouterModule.forRoot([
 //   {path: 'login', component: HomeMainComponent},
    {path: 'home', component: BeforeSearchComponent},
    {path: 'login', component:BeforeSearchComponent},
    {path: '', component:BeforeSearchComponent},
    {path:'dashboard', component:BeforeSearchComponent}
], { useHash: true , preloadingStrategy:PreloadAllModules});
