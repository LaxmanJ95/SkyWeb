import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
     moduleId: module.id,
    selector: 'business-dash',
    templateUrl: 'com.mainmodules.businessdash.html'
})
export class BusinessDashboardComponent {
constructor(private _router: Router) {
  //d this._router.navigate(['search-drug2']);
   // this._router.navigate([{ outlets: { dashboard: ['pharmacy-searchdrugs'] }}]);
  }
 }