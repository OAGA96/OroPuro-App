// import { AsyncStorage } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import OroPuro from '../API/OroPuro';
const _ = require('lodash');

//REGRESA EL TOTAL DE LA VENTA.
export const TotalDeVenta = arreglo => {
  let total = 0;
  arreglo.forEach(producto => {
    if (producto.Quantity === '') {
      total = total + producto.PrecioU * 0;
    } else {
      total = total + producto.PrecioU * parseFloat(producto.Quantity);
    }
  });
  return total.toFixed(2);
};

//GUARDA LA INFORMACION DE LA VENTA, CAMBIO, VISITA EN UN ARRAY
export const GuardarEntrega = async (
  productos,
  folio,
  comentario,
  tipo,
  cliente,
) => {
  ClientesVisitados(cliente);
  let listaEntregas = JSON.parse(await AsyncStorage.getItem('ListEntregas'));
  if (listaEntregas === null) {
    listaEntregas = [];
  }
  let fecha = new Date();

  //FILTRA SI FUE VISITA O VENTA Y LO AGREGA A LA LLAVE ListEntrega
  try {
    //FILTRO PARA VENTAS
    if (tipo === 'CONTADO' || tipo === 'CREDITO' || tipo === 'CAMBIO') {
      productos.forEach(item => {
        if (parseFloat(item.Quantity) > 0 && item.Quantity != '') {
          listaEntregas.push({
            Folio: parseInt(folio, 10),
            CardCode: cliente.CardCode,
            CardName: cliente.CardName,
            ShipToCode: cliente.ShipToCode,
            ItemCode: item.ItemCode,
            ItemName: item.ItemName,
            Quantity: parseFloat(item.Quantity),
            PrecioU: item.PrecioU,
            MetodoPago: tipo,
            Tipo: tipo,
            DocDate:
              fecha.getFullYear() +
              '-' +
              (fecha.getMonth() + 1) +
              '-' +
              fecha.getDate() +
              ' ' +
              fecha.getHours() +
              ':' +
              fecha.getMinutes(),
            Status: tipo === 'CAMBIO' ? 17 : 10,
            Comment: comentario.toString(),
            PorQR: cliente.PorQR,
          });
        }
      });

      //UPDATE A VISITAS
      await AsyncStorage.getItem('Visitas').then(value => {
        let visita;
        if (value === null) {
          visita = '1';
        } else {
          visita = (parseInt(value) + 1).toString();
        }
        AsyncStorage.setItem('Visitas', visita);
      });

      //UPDATE A ENTREGAS
      if (tipo !== 'CAMBIO') {
        await AsyncStorage.getItem('Entregas').then(value => {
          let entregas;
          if (value === null) {
            entregas = '1';
          } else {
            entregas = (parseInt(value) + 1).toString();
          }
          AsyncStorage.setItem('Entregas', entregas);
        });
      }
    }

    //FILTRO PARA VISITAS
    if (tipo === 'VISITA') {
      listaEntregas.push({
        Folio: parseInt(folio, 10),
        CardCode: cliente.CardCode,
        CardName: cliente.CardName,
        ShipToCode: cliente.ShipToCode,
        ItemCode: '',
        ItemName: null,
        Quantity: null,
        PrecioU: null,
        MetodoPago: null,
        Tipo: tipo,
        DocDate:
          fecha.getFullYear() +
          '-' +
          (fecha.getMonth() + 1) +
          '-' +
          fecha.getDate() +
          ' ' +
          fecha.getHours() +
          ':' +
          fecha.getMinutes(),
        Status: 15,
        Comment: comentario,
        PorQR: cliente.PorQR,
      });
      await AsyncStorage.getItem('Visitas').then(value => {
        let visita;
        if (value === null) {
          visita = '1';
        } else {
          visita = (parseInt(value) + 1).toString();
        }
        AsyncStorage.setItem('Visitas', visita);
      });
    }
  } catch (error) {
    // console.log(error);
  }

  // console.log(listaEntregas);
  await AsyncStorage.setItem('ListEntregas', JSON.stringify(listaEntregas));
  // .then(() => console.log(listaEntregas));
};

//AL VISITAR UN CLIENTE SE ELIMINA DE LA LISTA DE
//CLIENTES POR VISITAR Y SE INSERTA EN CLIENTES
//VISITADOS
const ClientesVisitados = async cliente => {
  let arrVisitados = [];
  let fecha = new Date();

  let clientes = JSON.parse(await AsyncStorage.getItem('NoVisitados'));
  let visitados = JSON.parse(await AsyncStorage.getItem('Visitados'));
  let visitado = clientes.filter(item => item.CardCode === cliente.CardCode);
  let newNoVisitados = clientes.filter(
    item => item.CardCode !== cliente.CardCode,
  );
  await AsyncStorage.setItem('NoVisitados', JSON.stringify(newNoVisitados));

  if (visitados !== null) {
    arrVisitados = [...visitados];
    visitado.forEach(item => {
      arrVisitados.push({
        CardCode: item.CardCode,
        CardName: item.CardName,
        Hour: fecha.getHours() + ':' + fecha.getMinutes(),
      });
    });
    await AsyncStorage.setItem('Visitados', JSON.stringify(arrVisitados));
  } else {
    visitado.forEach(item => {
      arrVisitados.push({
        CardCode: item.CardCode,
        CardName: item.CardName,
        Hour: fecha.getHours() + ':' + fecha.getMinutes(),
      });
    });
    await AsyncStorage.setItem('Visitados', JSON.stringify(arrVisitados));
  }
};

//CUENTA EL NUMBERO DE OBJETOS EN UN ARRAY.
export const contarObjetos = lista => {
  let count = 0;
  lista.forEach(item => count++);

  return count;
};

//AL TOMAR FOTO DE UN ABARROTE CERRADO
//SE GUARDAN LOS DATOS DEL ABARROTE
export const saveIntoEvidencia = async Cliente => {
  let arrClientes = [];
  let Fecha = new Date();
  let Clientes = JSON.parse(await AsyncStorage.getItem('Evidencia'));
  if (Clientes === undefined || Clientes === null) {
    arrClientes.push({
      CardCode: Cliente.CardCode,
      CardName: Cliente.CardName,
      Fecha: Fecha.getHours() + ':' + Fecha.getMinutes(),
    });
    await AsyncStorage.setItem('Evidencia', JSON.stringify(arrClientes));
  } else {
    arrClientes = [...Clientes];
    arrClientes.push({
      CardCode: Cliente.CardCode,
      CardName: Cliente.CardName,
      Fecha: Fecha.getHours() + ':' + Fecha.getMinutes(),
    });
    await AsyncStorage.setItem('Evidencia', JSON.stringify(arrClientes));
  }
  // console.log(arrClientes);
};

//CREA UN SOLO ARRAY DE FOTOS Y ABARROTES.
//EJEMPLO: [[ABARROTE1, IDFOTO1], [ABARROTE2, IDFOTO2]]
export const photoArray = (fotos, abarrotes) => {
  let array = _.zip(abarrotes, fotos);
  return array;
};

//NO SE UTULIZA, SE PUEDE BORRAR.
const truncate = number => {
  return number > 0 ? Math.floor(number) : Math.ceil(number);
};

//NO SE UTILIZA, SE PUEDE BORRRAR.
//CONVIERTE COORDENADAS EN GRADOS, MINUTOS Y SEGUNDOS.
export const getDMS = (coord, type) => {
  let hemisphere = /^[WE]|(?:lon)/i.test(type)
    ? coord > 0
      ? 'W'
      : 'E'
    : coord < 0
    ? 'S'
    : 'N';

  const absolute = Math.abs(coord);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = Math.floor((minutesNotTruncated - minutes) * 60);

  return `${degrees}°${minutes}'${seconds}" ${hemisphere}`;
};

//CALCULA LA VENTA TOTAL POR TIENDA Y LO GUARDA PARA MOSTRAR EN HISTORIAL
export const TotalByStore = async (cliente, total, folio, tipo) => {
  let totales = [];
  tipo === 'CAMBIO' ? (tipo = 'CAMBIO') : (tipo = 'VENTA');
  await AsyncStorage.getItem('Totales').then(value => {
    if (value !== null && value !== undefined) {
      totales = [...JSON.parse(value)];
      if (cliente.CardCode === 'C0017') {
        totales.push({
          CardName: cliente.ShipToCode,
          CardCode: cliente.CardCode,
          Total: total,
          Folio: folio,
          Tipo: tipo,
        });
      } else {
        totales.push({
          CardName: cliente.CardName,
          CardCode: cliente.CardCode,
          Total: total,
          Folio: folio,
          Tipo: tipo,
        });
      }
    } else {
      if (cliente.CardCode === 'C0017') {
        totales.push({
          CardName: cliente.ShipToCode,
          CardCode: cliente.CardCode,
          Total: total,
          Folio: folio,
          Tipo: tipo,
        });
      } else {
        totales.push({
          CardName: cliente.CardName,
          CardCode: cliente.CardCode,
          Total: total,
          Folio: folio,
          Tipo: tipo,
        });
      }
    }
  });
  // console.log(totales);
  AsyncStorage.setItem('Totales', JSON.stringify(totales));
};

//MODIFICA LA LISTA DE ENTREGAS Y LA LISTA DE TOTALES
export const editEntregas = async (entregas, data) => {
  let listaEntregas = [];
  await AsyncStorage.getItem('ListEntregas').then(items => {
    listaEntregas = _.remove(JSON.parse(items), function(i) {
      return i.Folio !== parseInt(data.Folio, 10);
    });
  });
  let newList = [...listaEntregas, ...entregas];
  // console.log(newList);
  AsyncStorage.setItem('ListEntregas', JSON.stringify(newList));

  let totales = [];
  await AsyncStorage.getItem('Totales').then(items => {
    totales = _.remove(JSON.parse(items), function(i) {
      return i.Folio !== data.Folio;
    });
  });
  totales.push({
    CardName: data.CardName,
    Folio: data.Folio,
    Total: TotalDeVenta(entregas),
  });
  // console.log(totales);
  AsyncStorage.setItem('Totales', JSON.stringify(totales));
};

//CALCULA EL TOTAL POR PRODUCTO.
export const PricePerItem = (price, quantity) => {
  if (quantity === null || quantity === undefined || quantity.length < 0) {
    quantity = 0;
  }
  let total = parseFloat(price) * parseFloat(quantity);
  // console.log(total);
  return isNaN(total) ? '0' : total.toPrecision(5);
};

//MANDA CORREO CON EL ERROR Y LA RUTA.
export const sendMail = async (titulo, contenido) => {
  OroPuro.post(`/SendMail?Titulo=${titulo}&Contenido=${contenido}`);
};

export const createTicket = (items, folio, cliente, pubGeneral) => {
  // console.log(cliente);
  let filterItems = items.filter(value => value.Quantity > 0);
  let ticket = '\r\n\r\n   PRODUCTOS LACTEOS ORO PURO\r\n';
  ticket += '       S DE R.L. DE C.V.\r\n\r\n';
  ticket += '       TELEFONO:  2362127\r\n';
  ticket += '      LOPEZ PORTILLO  # 75\r\n';
  ticket += '       COL. SIERRA  VISTA\r\n';
  ticket += '       HERMOSILLO, SONORA\r\n';
  ticket += '--------------------------------\r\n';
  ticket +=
    cliente.CardCode === 'C0017'
      ? cliente.ShipToCode.length > 32
        ? cliente.ShipToCode.slice(0, 32) + '\r\n'
        : cliente.ShipToCode + '\r\n'
      : cliente.CardName.length > 32
      ? cliente.CardName.slice(0, 32) + '\r\n'
      : cliente.CardName + '\r\n';
  ticket += 'FOLIO: ' + folio + '\r\n';
  ticket += 'FECHA: ' + getFecha() + '\r\n';
  ticket += '--------------------------------\r\n\r\n';
  ticket += 'PRODUCTO       |CANT| PRE\r\n\r\n';
  filterItems.map(item => {
    let nombre =
      item.ItemName.length > 15
        ? trimString(item.ItemName.slice(0, 15))
        : trimString(item.ItemName);
    let cantidad =
      item.Quantity.length > 2 ? item.Quantity.slice(0, 2) : item.Quantity;
    let precio =
      item.PrecioU.length > 7 ? item.PrecioU.slice(0, 7) : item.PrecioU;
    ticket += nombre + '|  ' + cantidad + '  | $' + precio + '\r\n';
    if (cliente.CardCode === 'C0017') {
      QARCode.map(qar => {
        item.ItemCode === qar.ItemCode
          ? (ticket += 'QAR: ' + qar.Qar + '\r\n')
          : null;
      });
    }
  });
  ticket += '--------------------------------\r\n\r\n';
  ticket += '       TOTAL: $' + TotalDeVenta(items) + '\r\n';
  cliente.CardCode == 'C0017'
    ? (ticket +=
        'TOTAL ORO PURO: $' + TotalDeVenta(removeDanone(pubGeneral)) + '\r\n')
    : null;
  ticket += '\r\n';
  ticket += '-----GRACIAS POR SU COMPRA----\r\n\r\n\r\n';
  ticket +=
    cliente.CardCode === 'C0017'
      ? '\r\n\r\n\r\n\r\n\r\n--------------------------------\r\n             Firma\r\n\r\n'
      : '';
  return ticket;
};

const trimString = text => {
  return text.replace(/\s+/g, ' ');
};

export const createTicketLiquidacion = async (contado, credito) => {
  let ticket = '\r\n\r\n   PRODUCTOS LACTEOS ORO PURO\r\n';
  ticket += '       S DE R.L. DE C.V.\r\n\r\n';
  ticket += '       TELEFONO:  2362127\r\n';
  ticket += '      LOPEZ PORTILLO  # 75\r\n';
  ticket += '       COL. SIERRA  VISTA\r\n';
  ticket += '       HERMOSILLO, SONORA\r\n';
  ticket += '--------------------------------\r\n';
  ticket += '           LIQUIDACION\r\n';
  ticket += '            ' + getFecha() + '\r\n';
  ticket += '--------------------------------\r\n';
  ticket += 'CODIGO    |  VENTA  | IMPORTE\r\n\r\n';
  let productos = await getInfoForLiquidacion();
  productos.map(item => {
    let itemCode = item.ItemCode;
    let quantity = item.Quantity;
    let importe = item.PrecioU;
    ticket +=
      itemCode + '     ' + '|   ' + quantity + '    | $' + importe + '\r\n\r\n';
  });
  ticket += '--------------------------------\r\n';
  ticket +=
    '      TOTAL ORO PURO: $' + TotalDeVenta(removeDanone(productos)) + '\r\n';
  ticket += '             CONTADO: $' + contado + '\r\n';
  ticket += '             CREDITO: $' + credito + '\r\n';
  let visitas = await AsyncStorage.getItem('Visitas');
  ticket += '           VISITADOS: ' + visitas + '\r\n';
  let noVisitados = contarObjetos(
    JSON.parse(await AsyncStorage.getItem('NoVisitados')),
  );
  ticket += '        NO VISITADOS: ' + noVisitados + '\r\n\r\n';
  console.log(ticket);
  // console.log(removeDanone(productos));
  return ticket;
};

//EXTRAE LA INFORMACION NECESARIO PARA REIMPRIMIR UN TICKET
export const getInfoForTicket = async item => {
  let listaEntregas = [];
  await AsyncStorage.getItem('ListEntregas').then(value => {
    listaEntregas = _.remove(JSON.parse(value), function(i) {
      return i.Folio === parseInt(item.Folio, 10);
    });
  });

  let productos = [];

  listaEntregas.forEach((item, indice) => {
    productos.push({
      Indice: indice,
      ItemCode: item.ItemCode,
      ItemName: item.ItemName,
      Quantity: item.Quantity,
      PrecioU: item.PrecioU,
    });
  });

  let cliente = {
    CardCode: item.CardCode,
    CardName: item.CardName,
    ShipToCode: item.CardName,
  };

  let folio = item.Folio;

  return createTicket(
    productos,
    folio,
    cliente,
    await totPubGeneral(productos),
  );

  // console.log(
  //   createTicket(productos, folio, cliente, await totPubGeneral(productos)),
  // );
};

const getInfoForLiquidacion = async () => {
  //PRODUCTOS
  let productos = [];
  //SUMA DE PRODUCTOS IGUALES
  let joinProductos = [];
  //ENTREGAS
  let ventas = JSON.parse(await AsyncStorage.getItem('ListEntregas'));
  //ENTREGAS FILTRADAS
  let ventasFiltradas = ventas.filter(i => i.Tipo !== 'VISITA');
  //LISTA DE PRECIOS
  let precios = JSON.parse(await AsyncStorage.getItem('ListPrecio'));

  //INSERTA LOS PRODUCTOS CON EL PRECIO DE PUBLICO EN GENERAL
  ventasFiltradas.forEach((item, indice) => {
    let precioU = precios.filter(
      value => value.PriceList == 1 && value.ItemCode == item.ItemCode,
    );

    productos.push({
      Indice: indice,
      ItemCode: item.ItemCode,
      ItemName: item.ItemName,
      Quantity: item.Quantity,
      PrecioU: precioU[0].Price,
    });
  });

  //INSERTA LOS PRODUCTOS UNICOS Y LA CANTIDAD SUMADA
  productos.forEach((item, indice) => {
    let itemFilter = productos.filter(x => x.ItemCode === item.ItemCode);
    let suma = itemFilter.reduce((sum, currentValue) => {
      return sum + currentValue.Quantity;
    }, 0);
    let xProd = joinProductos.filter(x => x.ItemCode === item.ItemCode);

    if (!xProd.length > 0) {
      joinProductos.push({
        Indice: indice,
        ItemCode: item.ItemCode,
        ItemName: item.ItemName,
        Quantity: suma,
        PrecioU: item.PrecioU,
      });
    }
  });

  return joinProductos;
};

const totPubGeneral = async productos => {
  let xProductos = JSON.parse(await AsyncStorage.getItem('ListInv'));
  let xPrecios = JSON.parse(await AsyncStorage.getItem('ListPrecio'));
  let productosPubGen = [];

  xProductos.forEach((item, indice) => {
    let precioU = xPrecios.filter(
      value => value.PriceList == 1 && value.ItemCode == item.ItemCode,
    );

    productosPubGen.push({
      Indice: indice,
      ItemCode: item.ItemCode,
      ItemName: item.ItemName,
      Quantity: '',
      PrecioU: precioU[0].Price,
    });
  });

  let productosEnVenta = productos.filter(item => item.Quantity > 0);

  productosPubGen.forEach(item => {
    productosEnVenta.forEach(prod => {
      if (item.ItemCode == prod.ItemCode) {
        item.Quantity = prod.Quantity;
      }
    });
  });

  return TotalDeVenta(productosPubGen);
};

const removeDanone = productos => {
  const filterProductos = productos.filter(
    item => item.ItemCode.startsWith('3') === false,
  );
  return filterProductos;
  // console.log(filterProductos);
};

const getContadoCredito = async () => {
  let contado = 0;
  let credito = 0;
  await AsyncStorage.getItem('ListEntregas').then(value => {
    let lista = JSON.parse(value);
    if (lista !== null) {
      let xContado = lista.filter(value => value.Tipo === 'CONTADO');
      contado = TotalDeVenta(xContado);

      let xCredito = lista.filter(value => value.Tipo === 'CREDITO');
      credito = TotalDeVenta(xCredito);
    }
  });
  return [contado, credito];
};

const getFecha = () => {
  let newDate = new Date();
  let fecha =
    newDate.getFullYear() +
    '-' +
    (newDate.getMonth() + 1) +
    '-' +
    newDate.getDate();
  return fecha;
};

export const sleep = ms => {
  return new Promise(res => setTimeout(res, ms));
};

const QARCode = [
  {
    id: 1,
    ItemCode: '1101P',
    Qar: '15683',
  },
  {
    id: 2,
    ItemCode: '1102P',
    Qar: '15682',
  },
  {
    id: 3,
    ItemCode: '1103P',
    Qar: '18246',
  },
  {
    id: 4,
    ItemCode: '1104P',
    Qar: '15684',
  },
  {
    id: 5,
    ItemCode: '1105P',
    Qar: '00000',
  },
  {
    id: 6,
    ItemCode: '1106P',
    Qar: '17727',
  },
  {
    id: 7,
    ItemCode: '1302P',
    Qar: '16802',
  },
  {
    id: 8,
    ItemCode: '3001',
    Qar: '13197',
  },
  {
    id: 9,
    ItemCode: '3002',
    Qar: '12310',
  },
  {
    id: 10,
    ItemCode: '3003',
    Qar: '10259',
  },
  {
    id: 11,
    ItemCode: '3004',
    Qar: '16105',
  },
  {
    id: 12,
    ItemCode: '3005',
    Qar: '10258',
  },
  {
    id: 13,
    ItemCode: '3006',
    Qar: '10260',
  },
  {
    id: 14,
    ItemCode: '3008',
    Qar: '10265',
  },
  {
    id: 15,
    ItemCode: '3009',
    Qar: '11874',
  },
  {
    id: 16,
    ItemCode: '3010',
    Qar: '10129',
  },
  {
    id: 17,
    ItemCode: '3007',
    Qar: '10262',
  },
];
