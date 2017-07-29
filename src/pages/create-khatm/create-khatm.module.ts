import {NgModule} from '@angular/core';
import {CreateKhatmPage} from "./create-khatm";
import {IonicPageModule} from "ionic-angular";

@NgModule({
  declarations: [
    CreateKhatmPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateKhatmPage),
  ],
  exports: [
    CreateKhatmPage
  ]
})
export class CreateKhatmPageModule {
}
