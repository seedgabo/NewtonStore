import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Api } from '../../providers/Api';
import { PedidoRestringidoPage } from '../pedido-restringido/pedido-restringido';
import { PedidoPage } from '../pedido/pedido';
declare var window: any;
@Component({
  selector: 'page-pedido-guiado',
  templateUrl: 'pedido-guiado.html'
})
export class PedidoGuiadoPage {

  categoria: any = { nombre: "Cargando...", id: 44 };
  productos: any = [];
  producto_selected = undefined;
  servicio;
  loader = false;
  restringido = false;
  constructor(public navCtrl: NavController, public params: NavParams, public api: Api, public loading: LoadingController, public alert: AlertController) {
    this.servicio = this.api.tipo;
  }

  ionViewDidLoad() {
    this.categoria = this.params.get('categoria');

    if (this.api.restricted_categorias.indexOf(this.categoria.id) > -1) {
      this.restringido = true;
      if (this.api.entidad_ids.indexOf(this.api.user.entidad_id) > -1) {
        this.restringido = false;
      }
    }

    this.productos = this.api.productos.filter((prod) => {
      if (prod != null)
        return prod.categoria_id == this.categoria.id;
      else
        return false;
    });
  }

  selectproducto(producto) {
    if (this.api.index === 0) {
      window.categorias_originales = JSON.parse(JSON.stringify(this.api.categorias));
      if (producto == 'none') {
        this.producto_selected = undefined;
        this.api.categorias = this.api.categorias.filter((cat: any) => {
          return cat.id != 72;
        })
      }
      else {
        this.producto_selected = producto;
        if (producto.name && producto.name.indexOf('Ensalada de Fruta') > -1) {
          console.log(this.api.categorias);
          this.api.categorias = this.api.categorias.filter((cat: any) => {
            return [63, 50, 45, 61].indexOf(cat.id) > -1;
          })
          console.log('condicion ensalada de frutas')
        }
        else if (producto.description && producto.description.indexOf('Menu Liviano (2)') > -1) {
          this.api.categorias = this.api.categorias.filter((cat: any) => {
            return [63, 72, 50, 45, 61].indexOf(cat.id) > -1;
          })

          console.log('condicion Menu Liviano (2)', this.api.categorias)

        }
        else if (producto.description && producto.description.indexOf('Menu Liviano') > -1) {
          this.api.categorias = this.api.categorias.filter((cat: any) => {
            return [63, 47, 50, 45, 61].indexOf(cat.id) > -1;
          })
          console.log('condicion Menu Liviano')

        }
        else {
          this.api.categorias = this.api.categorias.filter((cat: any) => {
            return cat.id != 72;
          })
          console.log('condicion Ninguna')
        }
      }
    }
    else {
      if (producto == 'none') {
        this.producto_selected = undefined;
      }
      else {
        this.producto_selected = producto;
      }
    }

    if (this.cangoNext())
      this.siguiente();
    else
      this.terminar();
  }

  siguiente() {
    if (this.producto_selected != undefined) {
      this.producto_selected = JSON.parse(JSON.stringify(this.producto_selected));
      this.producto_selected.cantidad_pedidos = 1;
      this.api.addToCart(this.producto_selected);
    } else {
      this.api.addToCart({ name: "", image_url: "", cantidad_pedidos: 1, id: 0, categoria_id: 0 });
    }
    console.log(this.api.carrito);
    this.navCtrl.push(PedidoGuiadoPage, { categoria: this.api.categorias[++this.api.index] }, { animation: "ios-transition", duration: 100 });
  }

  atras() {
    if (this.navCtrl.canGoBack()) {
      if (this.api.index > 0)
        this.api.index--;

      if (this.api.index == 0 && window.categorias_originales) {
        console.log('recuperando categorias', window.categorias_originales)
        this.api.categorias = JSON.parse(JSON.stringify(window.categorias_originales));
        window.categorias_originales = null
      }

      console.log(this.api.removeFromCart(this.api.carrito[this.api.carrito.length - 1]));
    }
    this.navCtrl.pop();
  }

  terminar() {
    if (this.producto_selected != undefined) {
      this.producto_selected.cantidad_pedidos = 1;
      this.api.addToCart(this.producto_selected);
    } else {
      this.api.addToCart({ name: "", image_url: "", cantidad_pedidos: 0, id: 0, categoria_id: 0 });
    }
    if (this.api.entidad_ids.indexOf(this.api.user.entidad_id) > -1) {
      return this.navCtrl.push(PedidoPage, {}, { animation: "ios-transition" });
    }
    this.navCtrl.push(PedidoRestringidoPage, {}, { animation: "ios-transition" });
  }

  cangoNext() {
    return this.api.categorias.length > this.api.index + 1;
  }

  cangoBack() {
    return this.navCtrl.canGoBack();
  }


}
