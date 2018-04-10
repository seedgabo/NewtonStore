import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Api } from "../../providers/Api";
@IonicPage()
@Component({
  selector: "page-pick-comedor",
  templateUrl: "pick-comedor.html"
})
export class PickComedorPage {
  comedores: Array<any> = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api) {}

  ionViewDidLoad() {
    this.getComedores();
  }

  getComedores() {
    this.api
      .get("entidades")
      .then((data: any) => {
        console.log(data);
        this.comedores = data;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  select(comedor) {
    this.api.pedido_comedor.entidad = comedor;
    this.navCtrl.push("SelectMenuTypePage");
  }
}
