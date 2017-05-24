import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RightMenuComponent } from './right-menu';

@NgModule({
  declarations: [
    RightMenuComponent,
  ],
  imports: [
    IonicPageModule.forChild(RightMenuComponent),
  ],
  exports: [
    RightMenuComponent
  ]
})
export class RightMenuComponentModule {}
