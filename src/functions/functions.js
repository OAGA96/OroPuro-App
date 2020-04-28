import { AsyncStorage } from "react-native";
import OroPuro from "../API/OroPuro";
const _ = require("lodash");

//REGRESA EL TOTAL DE LA VENTA.
export const TotalDeVenta = (arreglo) => {
  let total = 0;
  arreglo.forEach((producto) => {
    if (producto.Quantity === "") {
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
  cliente
) => {
  ClientesVisitados(cliente);
  let listaEntregas = JSON.parse(await AsyncStorage.getItem("ListEntregas"));
  if (listaEntregas === null) {
    listaEntregas = [];
  }
  let fecha = new Date();

  //FILTRA SI FUE VISITA O VENTA Y LO AGREGA A LA LLAVE ListEntrega
  try {
    //FILTRO PARA VENTAS
    if (tipo === "CONTADO" || tipo === "CREDITO" || tipo === "CAMBIO") {
      productos.forEach((item) => {
        if (parseFloat(item.Quantity) > 0 && item.Quantity != "") {
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
              "-" +
              (fecha.getMonth() + 1) +
              "-" +
              fecha.getDate() +
              " " +
              fecha.getHours() +
              ":" +
              fecha.getMinutes(),
            Status: tipo === "CAMBIO" ? 7 : 0,
            Comment: comentario.toString(),
            PorQR: cliente.PorQR,
          });
        }
      });

      //UPDATE A VISITAS
      await AsyncStorage.getItem("Visitas").then((value) => {
        let visita;
        if (value === null) {
          visita = "1";
        } else {
          visita = (parseInt(value) + 1).toString();
        }
        AsyncStorage.setItem("Visitas", visita);
      });

      //UPDATE A ENTREGAS
      if (tipo !== "CAMBIO") {
        await AsyncStorage.getItem("Entregas").then((value) => {
          let entregas;
          if (value === null) {
            entregas = "1";
          } else {
            entregas = (parseInt(value) + 1).toString();
          }
          AsyncStorage.setItem("Entregas", entregas);
        });
      }
    }

    //FILTRO PARA VISITAS
    if (tipo === "VISITA") {
      listaEntregas.push({
        Folio: parseInt(folio, 10),
        CardCode: cliente.CardCode,
        CardName: cliente.CardName,
        ShipToCode: cliente.ShipToCode,
        ItemCode: "",
        ItemName: null,
        Quantity: null,
        PrecioU: null,
        MetodoPago: null,
        Tipo: tipo,
        DocDate:
          fecha.getFullYear() +
          "-" +
          (fecha.getMonth() + 1) +
          "-" +
          fecha.getDate() +
          " " +
          fecha.getHours() +
          ":" +
          fecha.getMinutes(),
        Status: 5,
        Comment: comentario,
        PorQR: cliente.PorQR,
      });
      await AsyncStorage.getItem("Visitas").then((value) => {
        let visita;
        if (value === null) {
          visita = "1";
        } else {
          visita = (parseInt(value) + 1).toString();
        }
        AsyncStorage.setItem("Visitas", visita);
      });
    }
  } catch (error) {
    console.log(error);
  }

  // console.log(listaEntregas);
  await AsyncStorage.setItem(
    "ListEntregas",
    JSON.stringify(listaEntregas)
  ).then(() => console.log(listaEntregas));
};

//AL VISITAR UN CLIENTE SE ELIMINA DE LA LISTA DE 
//CLIENTES POR VISITAR Y SE INSERTA EN CLIENTES
//VISITADOS
const ClientesVisitados = async (cliente) => {
  let arrVisitados = [];
  let fecha = new Date();

  let clientes = JSON.parse(await AsyncStorage.getItem("NoVisitados"));
  let visitados = JSON.parse(await AsyncStorage.getItem("Visitados"));
  let visitado = clientes.filter((item) => item.CardCode === cliente.CardCode);
  let newNoVisitados = clientes.filter(
    (item) => item.CardCode !== cliente.CardCode
  );
  await AsyncStorage.setItem("NoVisitados", JSON.stringify(newNoVisitados));

  if (visitados !== null) {
    arrVisitados = [...visitados];
    visitado.forEach((item) => {
      arrVisitados.push({
        CardCode: item.CardCode,
        CardName: item.CardName,
        Hour: fecha.getHours() + ":" + fecha.getMinutes(),
      });
    });
    await AsyncStorage.setItem("Visitados", JSON.stringify(arrVisitados));
  } else {
    visitado.forEach((item) => {
      arrVisitados.push({
        CardCode: item.CardCode,
        CardName: item.CardName,
        Hour: fecha.getHours() + ":" + fecha.getMinutes(),
      });
    });
    await AsyncStorage.setItem("Visitados", JSON.stringify(arrVisitados));
  }
};

//CUENTA EL NUMBERO DE OBJETOS EN UN ARRAY.
export const contarObjetos = (lista) => {
  let count = 0;
  lista.forEach((item) => count++);

  return count;
};

//AL TOMAR FOTO DE UN ABARROTE CERRADO
//SE GUARDAN LOS DATOS DEL ABARROTE
export const saveIntoEvidencia = async (Cliente) => {
  let arrClientes = [];
  let Fecha = new Date();
  let Clientes = JSON.parse(await AsyncStorage.getItem("Evidencia"));
  if (Clientes === undefined || Clientes === null) {
    arrClientes.push({
      CardCode: Cliente.CardCode,
      CardName: Cliente.CardName,
      Fecha: Fecha.getHours() + ":" + Fecha.getMinutes(),
    });
    await AsyncStorage.setItem("Evidencia", JSON.stringify(arrClientes));
  } else {
    arrClientes = [...Clientes];
    arrClientes.push({
      CardCode: Cliente.CardCode,
      CardName: Cliente.CardName,
      Fecha: Fecha.getHours() + ":" + Fecha.getMinutes(),
    });
    await AsyncStorage.setItem("Evidencia", JSON.stringify(arrClientes));
  }
  console.log(arrClientes);
};

//CREA UN SOLO ARRAY DE FOTOS Y ABARROTES.
//EJEMPLO: [[ABARROTE1, IDFOTO1], [ABARROTE2, IDFOTO2]]
export const photoArray = (fotos, abarrotes) => {
  let array = _.zip(abarrotes, fotos);
  return array;
};

//NO SE UTULIZA, SE PUEDE BORRAR.
const truncate = (number) => {
  return number > 0 ? Math.floor(number) : Math.ceil(number);
};

//NO SE UTILIZA, SE PUEDE BORRRAR.
//CONVIERTE COORDENADAS EN GRADOS, MINUTOS Y SEGUNDOS.
export const getDMS = (coord, type) => {
  let hemisphere = /^[WE]|(?:lon)/i.test(type)
    ? coord > 0
      ? "W"
      : "E"
    : coord < 0
    ? "S"
    : "N";

  const absolute = Math.abs(coord);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = Math.floor((minutesNotTruncated - minutes) * 60);

  return `${degrees}°${minutes}'${seconds}" ${hemisphere}`;
};

//CALCULA LA VENTA TOTAL POR TIENDA Y LO GUARDA PARA MOSTRAR EN HISTORIAL
export const TotalByStore = async (cliente, total, folio) => {
  let totales = [];
  await AsyncStorage.getItem("Totales").then((value) => {
    if (value !== null && value !== undefined) {
      totales = [...JSON.parse(value)];
      if (cliente.CardCode === "C0017") {
        totales.push({
          CardName: cliente.ShipToCode,
          Total: total,
          Folio: folio,
        });
      } else {
        totales.push({
          CardName: cliente.CardName,
          Total: total,
          Folio: folio,
        });
      }
    } else {
      if (cliente.CardCode === "C0017") {
        totales.push({
          CardName: cliente.ShipToCode,
          Total: total,
          Folio: folio,
        });
      } else {
        totales.push({
          CardName: cliente.CardName,
          Total: total,
          Folio: folio,
        });
      }
    }
  });

  AsyncStorage.setItem("Totales", JSON.stringify(totales));
  // console.log(totales);
};

//MODIFICA LA LISTA DE ENTREGAS Y LA LISTA DE TOTALES
export const editEntregas = async (entregas, data) => {
  let listaEntregas = [];
  await AsyncStorage.getItem("ListEntregas").then((items) => {
    listaEntregas = _.remove(JSON.parse(items), function (i) {
      return i.Folio !== parseInt(data.Folio, 10);
    });
  });
  let newList = [...listaEntregas, ...entregas];
  console.log(newList);
  AsyncStorage.setItem("ListEntregas", JSON.stringify(newList));

  let totales = [];
  await AsyncStorage.getItem("Totales").then((items) => {
    totales = _.remove(JSON.parse(items), function (i) {
      return i.Folio !== data.Folio;
    });
  });
  totales.push({
    CardName: data.CardName,
    Folio: data.Folio,
    Total: TotalDeVenta(entregas),
  });
  console.log(totales);
  AsyncStorage.setItem("Totales", JSON.stringify(totales));
};

//CALCULA EL TOTAL POR PRODUCTO.
export const PricePerItem = (price, quantity) => {
  if (quantity === null || quantity === undefined || quantity.length < 0) {
    quantity = 0;
  }
  let total = parseInt(price) * parseInt(quantity);
  return isNaN(total) ? "0" : total;
};

//MANDA CORREO CON EL ERROR Y LA RUTA.
export const sendMail = async (titulo, contenido) => {
  OroPuro.post(`/**?Titulo=${titulo}&Contenido=${contenido}`);
};
