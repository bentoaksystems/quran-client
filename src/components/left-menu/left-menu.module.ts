import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeftMenuComponent } from './left-menu';

@NgModule({
  declarations: [
    LeftMenuComponent,
  ],
  imports: [
    IonicPageModule.forChild(LeftMenuComponent),
  ],
  exports: [
    LeftMenuComponent
  ]
})
export class LeftMenuComponentModule {}
