import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PickComedorPage } from './pick-comedor';

@NgModule({
  declarations: [
    PickComedorPage,
  ],
  imports: [
    IonicPageModule.forChild(PickComedorPage),
  ],
})
export class PickComedorPageModule {}
