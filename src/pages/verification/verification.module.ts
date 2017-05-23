import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Verification } from './verification';

@NgModule({
  declarations: [
    Verification,
  ],
  imports: [
    IonicPageModule.forChild(Verification),
  ],
  exports: [
    Verification
  ]
})
export class VerificationModule {}
