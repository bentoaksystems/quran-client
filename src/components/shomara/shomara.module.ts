import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Shomara } from './shomara';

@NgModule({
  declarations: [
    Shomara,
  ],
  imports: [
    IonicPageModule.forChild(Shomara),
  ],
  exports: [
    Shomara
  ]
})
export class ShomaraModule {}
