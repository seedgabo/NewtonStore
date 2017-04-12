import {Component} from '@angular/core';
import {Api} from '../../providers/Api';
import { NavController, AlertController,ToastController,NavParams } from 'ionic-angular';
import { ProductoPage } from '../producto/producto';
@Component({
    selector: 'page-page1',
    templateUrl: 'page1.html'
})
export class Home{
    productos:any=[];
    query="";
    loading=false;
    categoria:any = undefined;
    categorias:any = [];
    constructor(public navCtrl:NavController,public api:Api,public alert:AlertController, public toast:ToastController, public params:NavParams) {
        this.categoria = params.get("categoria");
    }

    ionViewDidLoad(){
        this.api.storage.get("user").then((data)=>{

            if(this.categoria == undefined){

                this.api.get("productos?with[]=image&limit=30&scope[]=active").then((data)=>{
                    this.productos = data;
                    console.log(data);
                }).catch((err)=>{console.log(err);});

                this.api.get("categorias-productos?where[parent_id]=0&with[]=image&with[]=banner&limit=30").then((data)=>{
                    this.categorias = data;
                    console.log(data);
                });

            }



            else
            {

                this.api.get(`productos?where[categoria_id]=${this.categoria.id}&with[]=image&limit=30&scope[]=active`).then((data)=>{
                    this.productos = data;
                    console.log(data);
                }).catch((err)=>{console.log(err);});

                this.api.get(`categorias-productos?where[parent_id]=${this.categoria.id}&with[]=image&with[]=banner&limit=30`).then((data)=>{
                    this.categorias = data;
                    console.log(data);
                }).catch((err)=> {console.log(err);});

            }
        });
    }

    agregarAlCarrito(producto){
        var alert = this.alert.create({title:"Agregar Al Carrito",inputs:
            [
                {type:"number",name:"cantidad",label:"Cantidad", value:"1",placeholder:"Ingrese la cantidad"}
            ],
            buttons:
            [
                {
                    text:"Agregar",
                    handler: (data)=>{
                        if (producto.es_vendible_sin_stock || producto.stock >= data.cantidad) {
                            producto.cantidad_pedidos = data.cantidad;
                            this.api.addToCart(producto);
                            this.toast.create({message:"Agregado al Carrito",duration:1000,position:"bottom"}).present();
                        }else{
                            this.alert.create({title:"Sin Stock Suficiente", buttons: ["Ok"]}).present();
                        }
                    }
                },
                {
                    text:"Cancelar",
                    handler:()=>{

                    }
                }
            ]
        });
        alert.present();
    }

    verProducto(producto){
        this.navCtrl.push(ProductoPage, {producto:producto});
    }

    verCategoria(categoria){
        this.navCtrl.push(Home,{categoria: categoria});
    }

    buscar(searchbar){
         this.loading =true;
        this.api.get("productos?with[]=image&limit=30&orWhereLike[name]="+this.query+"&orWhereLike[description]="+this.query+"&scope[]=active").then((data)=>{
            this.productos = data;
            this.loading=false;
            console.log(data);
        }).catch((Err)=>{
            this.loading=false;
            console.log(Err);
        });
    }

    changeView(){
        if(this.api.vista == 'grid'){
            this.api.vista = 'list';
        }else{
            this.api.vista = 'grid';
        }
    }
}
