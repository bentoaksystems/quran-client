import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Registration } from './registration';

@NgModule({
  declarations: [
    Registration,
  ],
  imports: [
    IonicPageModule.forChild(Registration),
  ],
  exports: [
    Registration
  ]
})
export class RegistrationModule {}
