import type { Product } from '../types';
export const initialProducts: Product[] = [
{Codigo:'GA001',Categoria:'Guitarras Acústicas',Nombre:'Guitarra Acústica Folk',Marca:'Yamaha',Modelo:'F310',Stock:8,Precio:129990,Imagen:'public/img/Guitarra Acústica Folk.webp'},
{Codigo:'GA002',Categoria:'Guitarras Acústicas',Nombre:'Guitarra Acústica Dreadnought',Marca:'Fender',Modelo:'CD-60S',Stock:5,Precio:189990,Imagen:'public/img/Guitarra Acústica Dreadnought.jpg'},
{Codigo:'GE001',Categoria:'Guitarras Eléctricas',Nombre:'Guitarra Eléctrica Stratocaster',Marca:'Squier',Modelo:'Affinity Strat',Stock:6,Precio:249990,Imagen:'public/img/Guitarra Eléctrica Stratocaster.webp'},
{Codigo:'BE001',Categoria:'Bajos Eléctricos',Nombre:'Bajo Eléctrico 4 Cuerdas',Marca:'Ibanez',Modelo:'GSR200',Stock:7,Precio:219990,Imagen:'public/img/Bajo Eléctrico 4 Cuerdas.webp'},
{Codigo:'TC001',Categoria:'Teclados y Pianos',Nombre:'Piano Digital 88 Teclas',Marca:'Casio',Modelo:'CDP-S110',Stock:3,Precio:389990,Imagen:'public/img/Piano Digital 88 Teclas.jpeg'},
{Codigo:'BT001',Categoria:'Baterías',Nombre:'Batería Acústica 5 Cuerpos',Marca:'Pearl',Modelo:'Roadshow',Stock:2,Precio:529990,Imagen:'public/img/Batería Acústica 5 Cuerpos.webp'},
{Codigo:'AM001',Categoria:'Amplificadores',Nombre:'Amplificador Guitarra 15W',Marca:'Marshall',Modelo:'MG15G',Stock:9,Precio:119990,Imagen:'public/img/Amplificador Guitarra 15W.webp'},
{Codigo:'PD001',Categoria:'Pedales de Efectos',Nombre:'Pedal Overdrive Classic',Marca:'Boss',Modelo:'SD-1',Stock:12,Precio:69990,Imagen:'public/img/Pedal Overdrive Classic.webp'}
];
export const categories = ['Guitarras Acústicas','Guitarras Eléctricas','Bajos Eléctricos','Teclados y Pianos','Baterías','Amplificadores','Pedales de Efectos','Micrófonos','Estudio y Grabación','Accesorios'];