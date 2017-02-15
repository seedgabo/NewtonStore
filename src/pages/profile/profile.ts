import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Api} from '../../providers/Api';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public api:Api) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

}
