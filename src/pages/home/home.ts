import { LoginPage } from '../login/login';
import { PedidoGuiadoPage } from '../pedido-guiado/pedido-guiado';
import { VerPedidoPage } from "../ver-pedido/ver-pedido";
import { Api } from '../../providers/Api';
import { Component } from '@angular/core';
import { ModalController, AlertController, NavController, NavParams, ToastController } from 'ionic-angular';
import * as moment from 'moment';
import { TutorialPage } from "../tutorial/tutorial";
import { Selector } from '../selector/selector';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Clipboard } from "@ionic-native/clipboard";
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  in_horario: boolean = true;
  loading: boolean = false;
  progamacion = {
    almuerzo: undefined,
    comida: undefined,
    cena: undefined,
  }
  status = {
    almuerzo: undefined,
    comida: undefined,
    cena: undefined,
  }
  entidades = [];
  entidad_id;
  sub_entidad_id;
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public alert: AlertController, public modal: ModalController, public noti: LocalNotifications, public clipboard: Clipboard, public toast: ToastController) { }

  ionViewDidLoad() {
    this.api.index = 0;
    this.api.storage.ready()
      .then(() => {
        this.api.storage.get("user").then((user: any) => {
          if (user != undefined) {
            this.loading = true;
            this.api.user = JSON.parse(user);
            this.getProgramaciones();
            this.getEntidades();
            this.getUser();
            this.verifyNotifications();
          }
          else {
            this.navCtrl.setRoot(LoginPage);
          }
        })

        this.api.storage.get("tutorial").then((dat) => {
          console.log(dat);
          if (dat == undefined) {
            this.api.storage.set("tutorial", "true");
            this.navCtrl.push(TutorialPage);
          }
        })
      });

  }

  getUser() {
    this.api.doLogin().then(
      (response: any) => {
        this.api.user = response;
        if (moment(response.last_login.date).hour() >= 22) {
          this.in_horario = false;
        }
        this.api.saveUser(response);
        this.api.saveData();
        this.getPedidos();
        this.getPedidosAyer();
      }
    )
      .catch((err) => {
        if (err.error == 401) {
          this.alert.create({ title: "Error", message: "Email o contraseña invalidos", buttons: ["Ok"] }).present();
        } else {
          this.alert.create({ title: "Error", message: "Error al descargar datos", buttons: ["Ok"] }).present();
        }
      })
  }

  getProgramaciones() {
    this.api
      .get(`programacion-pedidos?whereDate[fecha]=${'tomorrow'}&where[cliente_id]=${this.api.user.cliente_id}&afterEach[setProductos]=&afterEach[setCategorias]=`)
      .then((data: any) => {
        console.log(data);
        data.forEach(element => {
          if (element.tipo == "almuerzo")
            this.progamacion.almuerzo = element;
          if (element.tipo == "comida")
            this.progamacion.comida = element;
          if (element.tipo == "cena")
            this.progamacion.cena = element;
        });
      })
      .catch((err) => {
        console.error(err);
        if (err.error == 401) {
          this.alert.create({ title: "Error", message: "Email o contraseña invalidos", buttons: ["Ok"] }).present();
        } else {
          this.alert.create({ title: "Error", message: "Error al descargar datos", buttons: ["Ok"] }).present();
        }
      });
  }

  ordenar(tipo) {
    console.log(tipo);
    console.log(this.status[tipo]);
    if (!this.entidad_id) {
      this.toast.create({ duration: 3000, message: "Elija un lugar de entrega primero", position: 'top' }).present();
      return;
    }
    if (this.filterEntidad(this.entidad_id).length > 0 && this.sub_entidad_id == null) {
      this.toast.create({ duration: 3000, message: "Elija un ubicacion de entrega primero", position: 'top' }).present();
      return;
    }
    if (this.entidad_id == 18 && tipo != 'cena') {
      this.toast.create({ duration: 3000, message: "Esta planta solo puede pedir cena", position: 'top' }).present();
      return;
    }

    if (!this.canOrder(tipo) || !this.in_horario) {
      return;
    }
    this.api.setProgramacion(this.progamacion[tipo]);
    this.api.tipo = tipo;
    this.navCtrl.push(PedidoGuiadoPage, { categoria: this.api.categorias[0] });
  }

  getPedidos() {
    if (this.api.user_selected) {
      var user = this.api.user_selected;
    } else {
      var user = this.api.user;
    }
    this.api.get("pedidos?with[]=items&&whereDateBetween[created_at]=today,tomorrow&where[user_id]=" + user.id).then(
      (data: Array<any>) => {
        console.log("pedidos", data);
        user.pedidos = data;
        this.status = {
          almuerzo: false,
          comida: false,
          cena: false
        };
        data.forEach((pedido) => {
          if (pedido.tipo == "almuerzo") {
            this.status.almuerzo = true;
          }
          if (pedido.tipo == "comida") {
            this.status.comida = true;
          }
          if (pedido.tipo == "cena") {
            this.status.cena = true;
          }
        });
      }
    ).catch(
      (err) => {
        console.warn(err);
        if (err.error == 401) {
          this.alert.create({ title: "Error", message: "Email o contraseña invalidos", buttons: ["Ok"] }).present();
        } else {
          this.alert.create({ title: "Error", message: "Error al descargar datos", buttons: ["Ok"] }).present();
        }
      }
      )

  }

  getPedidosAyer() {
    if (this.api.user_selected) {
      var user = this.api.user_selected;
    } else {
      var user = this.api.user;
    }
    this.api.get("pedidos?with[]=items&&whereDateBetween[created_at]=yesterday,today&where[user_id]=" + user.id)
      .then(
      (data: Array<any>) => {
        console.log("pedidos de ayer", data);
        data.forEach(pedido => {
          if (pedido.tipo == 'almuerzo')
            this.api.pedidos_ayer.almuerzo = pedido;
          if (pedido.tipo == 'comida')
            this.api.pedidos_ayer.comida = pedido;
          if (pedido.tipo == 'cena')
            this.api.pedidos_ayer.cena = pedido;
        });
      })
      .catch(
      (err) => {
        console.warn(err);
      })

  }

  getEntidades() {
    this.api.get("entidades").then((data: Array<any>) => {
      this.entidades = data;
      var array = [];
      this.entidades.forEach((ent) => {
        if (ent.codigo && ent.codigo.indexOf('*') > -1)
          array.push(ent.id);
      });
      this.api.entidad_ids = array;
      console.log('entidades sin perfiericos:', this.api.entidad_ids);
    }).catch(() => {
      this.alert.create({ message: "Error al cargar las direcciones", buttons: ["Ok"] }).present();
    })
  }

  filterEntidad(entidad_id = null) {
    return this.entidades.filter((ent) => {
      if (entidad_id == null) {
        return ent.parent_id == null || ent.parent_id == 0;
      } else {
        return ent.parent_id == entidad_id
      }
    });
  }

  changeEntidad(entidad) {
    this.api.user.entidad_id = entidad;
    console.log(entidad);
  }

  canOrder(tipo = null) {
    if ((this.api.cupon && this.status[tipo] == false) || (this.status.comida === false && this.status.cena === false && this.status.almuerzo === false))
      return true;
    return false;
  }

  verPedido(ev, tipo) {
    ev.stopPropagation();
    if (this.api.user_selected) {
      var user = this.api.user_selected;
    } else {
      var user = this.api.user;
    }
    var pedido = user.pedidos.find((ped) => {
      return ped.tipo == tipo;
    });
    if (pedido) {
      this.navCtrl.push(VerPedidoPage, { pedido: pedido });
    }
  }

  deletePedido(ev, tipo) {
    ev.stopPropagation();
    this.alert.create({
      message: "¿Esta seguro de eliminar el pedido?",
      buttons: [
        {
          text: "SI",
          handler: () => {
            this._deletePedido(tipo);
          }
        },
        {
          text: "Cancelar",
          handler: () => {
            console.log("cancelo");
          }
        }

      ]
    }).present();
  }

  _deletePedido(tipo) {
    console.log("eliminar pedido", tipo);
    var index;
    if (this.api.user_selected) {
      var user = this.api.user_selected;
    } else {
      var user = this.api.user;
    }
    var pedido = user.pedidos.find((ped, i) => {
      if (ped.tipo == tipo) {
        index = i;
        return true;
      }
    })
    this.api.delete("pedidos/" + pedido.id)
      .then((data) => {
        user.pedidos.splice(index, 1);
        this.status[tipo] = false;
      })
      .catch((err) => {
        this.alert.create({ buttons: ["OK"], message: "Ocurrió un error al eliminar el pedido" }).present();
      });
  }

  verifyNotifications() {
    this.noti.registerPermission().then(() => {
      this.noti.getAll().then((notifications) => {
        if (notifications.length > 0) {
          return;
        }
        this.noti.schedule({
          title: "Haz tu pedido ya!",
          text: 'ya es el momento de realizar el pedido, si aun no lo has hecho',
          at: moment().add(1, "day").hour(17).minute(0).toDate(),
          every: 'day',
          led: 'FF0000',
        });
      })
        .catch((err) => {
          console.error(err);
        });
    })
      .catch(console.warn);
  }

  selectClientes() {
    var modal = this.modal.create(Selector, {
      uri: "users", append: "limit=50&where[cliente_id]=" + this.api.user.cliente_id,
      attributes: ["whereLike[nombre]"],
      image: 'imagen'
    });
    modal.present();
    modal.onWillDismiss((data) => {
      this.status = {
        almuerzo: undefined,
        comida: undefined,
        cena: undefined,
      }
      this.api.user_selected = data.selected;
      this.api.index = 0;
      this.loading = true;
      this.getPedidos();
      this.getPedidosAyer();
    });
  }

  askCupon() {
    this.alert.create({
      inputs: [
        {
          label: "# Cupon",
          placeholder: "0000",
          name: "cupon"
        }
      ],
      title: "Ingresa tu Cupon",
      buttons: [
        {
          text: "Enviar",
          handler: (data) => {
            console.log(data.cupon);
            this.verCupon(data.cupon);
          }
        }
      ]
    }).present();
  }

  verCupon(numero) {
    this.api.get("cupones?where[code]=" + numero + "&scope[valido]")
      .then((data: Array<any>) => {
        console.log(data);
        if (data.length != 0) {
          this.api.cupon = data[0];
        } else {
          this.alert.create({ buttons: ["Ok"], message: "cupon invalido" }).present();
        }
      })
      .catch((err) => {
        this.alert.create({ buttons: ["Ok"], message: "Error al aplicar el cupon" }).present();
      });
  }

  generateCupon() {
    this.api.post("cupones", { code: null, valido_hasta: moment().startOf('day').add(1, "day").toISOString().substring(0, 10) })
      .then((cupon: any) => {
        this.clipboard.copy(cupon.code);
        this.alert.create({ message: "Codigo Cupon", title: cupon.code, subTitle: "Copiado en el  portapapeles", buttons: ["OK"] }).present();
      })
      .catch((err) => {
        this.alert.create({ title: "No se pudo generar el cupon", buttons: ["OK"] }).present();
      });
  }
}
