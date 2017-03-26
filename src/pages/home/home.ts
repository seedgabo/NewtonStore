import {Api} from '../../providers/Api';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public api:Api) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

}
