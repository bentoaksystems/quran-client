import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SingleSafhaComponent } from './single-safha';

@NgModule({
  declarations: [
    SingleSafhaComponent,
  ],
  imports: [
    IonicPageModule.forChild(SingleSafhaComponent),
  ],
  exports: [
    SingleSafhaComponent
  ]
})
export class SingleSafhaComponentModule {}
