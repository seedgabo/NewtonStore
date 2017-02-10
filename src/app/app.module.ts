import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Home } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { ProductoPage } from '../pages/producto/producto';
import { PedidosPage } from '../pages/pedidos/pedidos';
import { PedidoPage } from '../pages/pedido/pedido';
import { PedidoGuiadoPage } from '../pages/pedido-guiado/pedido-guiado';
import { PedidoRestringidoPage } from '../pages/pedido-restringido/pedido-restringido';
import { LoginPage } from '../pages/login/login';
import { Api } from '../providers/Api';
import { Storage } from '@ionic/storage';
@NgModule({
  declarations: [
    MyApp,
    Home,
    Page2,
    ProductoPage,
    PedidosPage,
    PedidoPage,
    PedidoGuiadoPage,
    PedidoRestringidoPage,
    LoginPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Home,
    Page2,
    ProductoPage,
    PedidosPage,
    PedidoPage,
    PedidoGuiadoPage,
    PedidoRestringidoPage,
    LoginPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},Api,Storage]
})
export class AppModule {}
