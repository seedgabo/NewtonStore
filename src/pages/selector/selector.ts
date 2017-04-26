import { Component } from '@angular/core';
import { AlertController, ViewController, NavController, NavParams } from 'ionic-angular';
import { Api } from '../../providers/Api';
// @IonicPage()
@Component({
	selector: 'page-selector',
	templateUrl: 'selector.html',
})
export class Selector {
	image: any;
	icon: any;
	description: any;
	append = "limit=50";
	attributes = ["query"];
	title = "Busqueda";
	text = "full_name";
	list: Array<any> = [];
	selected: any;
	uri = "clientes";
	query = "";
	load = false;
	constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public viewctrl: ViewController,
		public alert: AlertController) {
		if (this.navParams.get("uri") != undefined) {
			this.uri = this.navParams.get("uri");
		}
		if (this.navParams.get("query") != undefined) {
			this.query = this.navParams.get("query");
		}
		if (this.navParams.get("title") != undefined) {
			this.title = this.navParams.get("title");
		}
		if (this.navParams.get("list") != undefined) {
			this.list = this.navParams.get("list");
		}
		if (this.navParams.get("selected") != undefined) {
			this.selected = this.navParams.get("selected");
		}
		if (this.navParams.get("attributes") != undefined) {
			this.attributes = this.navParams.get("attributes");
		}
		if (this.navParams.get("text") != undefined) {
			this.text = this.navParams.get("text");
		}
		if (this.navParams.get("append") != undefined) {
			this.append = this.navParams.get("append");
		}
		this.icon = this.navParams.get("icon");
		this.image = this.navParams.get("image");
		this.description = this.navParams.get('description');
	}

	ionViewDidLoad() {
		this.search();
	}

	search() {
		this.load = true;
		var uri = this.uri + "?";
		this.attributes.forEach((attr) => {
			uri += `${attr}=` + this.query + '&';
		});
		uri += this.append;
		this.api.get(uri)
			.then((data: any) => {
				this.list = data;
				this.load = false;
			})
			.catch((err) => {
				this.alert.create({ buttons: ["OK"], title: "Error al buscar", message: err }).present();
				this.load = false;
			});

	}

	select(item) {
		this.selected = item;
		this.save();
	}
	save() {
		this.viewctrl.dismiss({ selected: this.selected });
	}

	close() {
		this.viewctrl.dismiss({ selected: undefined });
	}

}
