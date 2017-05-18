import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Api } from '../../providers/Api';
import { HomePage } from "../home/home";
import { Terms } from "../terms/terms";
@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {
    register = false;
    password = "";
    confirm_password = "";
    nombre = "";
    username = "";
    cedula;
    terms = false;
    constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public alert: AlertController, public loading: LoadingController) { }

    ionViewDidLoad() {

    }

    doLogin() {
        var loading = this.loading.create({ content: "Iniciando Sesión" });
        loading.present();
        this.api.doLogin().then((response: any) => {
            loading.dismiss();
            if (response.cliente == null) {
                this.alert.create({ title: "Error", message: "El uso de esta aplicación esta restringido a clientes", buttons: ["Ok"] }).present();
                return
            }
            console.log("last pedido:", response.last_pedido);


            this.api.saveUser(response);
            this.api.saveData()
            this.api.user = response;
            this.navCtrl.setRoot(HomePage);

        }).catch(() => {
            loading.dismiss();
            this.alert.create({ title: "Error", message: "Error al iniciar sesión", buttons: ["Ok"] }).present();
        });
    }

    registrarse() {
        this.register = !this.register;
    }

    canRegister() {
        return (this.password == this.confirm_password && this.password.length > 5 && this.username.length > 5 && this.terms && this.nombre.length > 5 && this.cedula > 1000);
    }

    doRegister() {
        // TODO: register;
    }
    verTerms() {
        this.navCtrl.push(Terms);
    }

    forgotPassword() {
        this.alert.create({
            title: "Olvide mi contraseña",
            inputs: [
                {
                    label: 'email',
                    type: 'email',
                    name: 'email',
                    placeholder: 'Correo'
                }
            ],
            buttons: [
                {
                    text: 'Recuperar',
                    handler: (data) => {
                        var email = data.email;
                        this.api.get('forgot-password?email=' + email)
                            .then((data) => {
                                this.alert.create({
                                    title: "correo enviado",
                                    subTitle: "Revise su bandeja de entrada",
                                    buttons: ["OK"]
                                }).present();
                            })
                            .catch((err) => {
                                this.alert.create({
                                    title: "no se pudo enviar el correo de recuperación",
                                    buttons: ["OK"]
                                }).present();
                            });
                    }
                }
            ]
        }).present();
    }

}
