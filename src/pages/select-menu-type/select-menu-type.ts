import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Api } from "../../providers/Api";
@IonicPage()
@Component({
  selector: "page-select-menu-type",
  templateUrl: "select-menu-type.html"
})
export class SelectMenuTypePage {
  menus = [
    {
      title: "Saludable"
    },
    {
      title: "Liviano"
    },
    {
      title: "Tradicional"
    }
  ];
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api) {}

  ionViewDidLoad() {}

  select(menu) {
    this.api.pedido_comedor.tipo = menu;
  }
}
