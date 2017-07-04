import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommitmentPage } from './commitment';

@NgModule({
  declarations: [
    CommitmentPage,
  ],
  imports: [
    IonicPageModule.forChild(CommitmentPage),
  ],
  exports: [
    CommitmentPage
  ]
})
export class CommitmentPageModule {}
