import {NgModule} from '@angular/core';
import {CommitmentPage} from "./commitment";
import {IonicPageModule} from "ionic-angular";

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
export class CommitmentPageModule {
}
