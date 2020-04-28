import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Alert,
  AsyncStorage,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import { Button, ListItem, Input } from "react-native-elements";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Dialog from "react-native-dialog";
import HeaderOP from "../components/HeaderOP";
import { ScrollView } from "react-native-gesture-handler";
import {
  TotalDeVenta,
  GuardarEntrega,
  TotalByStore,
  PricePerItem,
} from "../functions/functions";
import DialogVenta from "../components/DialogVenta";

const Venta = ({ navigation }) => {
  //RECIBE EL PARAMETRO CON LA INFORMACION DE LOS CLIENTES/FALLBACK 0
  const dataCliente = navigation.getParam("Cliente", 0);

  //VARIABLES DE ESTADO
  const [habilitado, setHabilitado] = useState(false);
  const [abarrey, setAbarrey] = useState(false);
  const [productos, setProductos] = useState([]);
  const [folio, setFolio] = useState("");
  const [newFolio, setNewFolio] = useState("");
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [showDialogComentario, setShowDialogComentario] = useState(false);
  const [showDialogFolio, setShowDialogFolio] = useState(false);

  //VERIFICA SI SE TIENE LA INFORMACION DEL CLIENTE O DEL FALLBACK.
  const checkData = () => {
    if (dataCliente === 0) {
      Alert.alert("Error", "No se logro obtener la informacion del cliente.");
    }
    if (
      dataCliente.Credito === "Credito" ||
      dataCliente.Credito === "credito" ||
      dataCliente.Credito === "30 dias"
    ) {
      setHabilitado(true);
    } else {
      setHabilitado(false);
    }
    if (dataCliente.CardCode === "C0017") {
      setAbarrey(true);
    } else {
      setAbarrey(false);
    }
  };

  //OBTIENE LOS PRODUCTOS Y SUS PRECIOS DE ACUERDO AL CLIENTE SELECCIONADO.
  const getData = async () => {
    setLoading(true);
    await AsyncStorage.getItem("folio").then((value) => {
      if (value === null || value === "" || value.length === 0) {
        setFolio(null);
      } else {
        setFolio(value);
      }
    });
    let productos = JSON.parse(await AsyncStorage.getItem("ListInv"));
    let precios = JSON.parse(await AsyncStorage.getItem("ListPrecio"));
    let tempProd = [];

    productos.forEach((item, indice) => {
      let precioU = precios.filter(
        (value) =>
          value.PriceList == dataCliente.PriceList &&
          value.ItemCode == item.ItemCode
      );
      tempProd.push({
        Indice: indice,
        ItemCode: item.ItemCode,
        ItemName: item.ItemName,
        Quantity: "",
        PrecioU: precioU[0].Price,
      });
    });

    //QUITA LOS PRODUCTOS QUE TIENEN PRECIO $0.0
    let prodFiltrados = [];

    prodFiltrados = tempProd.filter((value) => value.PrecioU > 0);
    // console.log(prodFiltrados);

    setProductos(prodFiltrados);
    setLoading(false);
  };

  //VERIFICA LA ENTREGA ANTES DE MANDARLO A LA FUNCION DE VENTA
  const verifySell = async (tipo) => {
    let listaEntrega = JSON.parse(await AsyncStorage.getItem("ListEntregas"));
    if (folio !== "" && folio !== null && !isNaN(folio)) {
      let exists = 0;

      if (listaEntrega !== null) {
        //FILTRA LOS DATOS EN ENTREGAS, SI DEVUELVE DIFERENTE DE 0 ENTONCES SI EXISTE.
        exists = listaEntrega.filter((x) => x.Folio === parseInt(folio)).length;
      } else {
        listaEntrega = [];
      }

      if (exists === 0) {
        GuardarEntrega(productos, folio, comment, tipo, dataCliente);
        if (tipo !== "VISITA" && tipo !== "CAMBIO") {
          TotalByStore(dataCliente, TotalDeVenta(productos), folio);
        }
        await AsyncStorage.setItem("folio", (parseInt(folio) + 1).toString());
        setComment("");
        navigation.navigate("Inicio");
      } else {
        Alert.alert("Folio existente", "Favor de colocar otro folio.");
      }
    } else {
      setShowDialogFolio(true);
    }
  };

  //INDICA EL QUE TIPO DE ACCION SEGUN EL COMPONENTE(folio, comentario)
  const handleButtonDialog = async (text, tipo) => {
    if (tipo === "COMENTARIO") {
      console.log(text);
      setComment(text);
      setShowDialogComentario(false);
    }
    if (tipo === "FOLIO") {
      await AsyncStorage.setItem("folio", text);
      setFolio(newFolio);
      setShowDialogFolio(false);
    }
  };

  //GUARDA NUEVO FOLIO EN ASYNCSTORAGE CUANDO SE TRATA DE HACER UNA VENTA SIN FOLIO.
  const handleDialog = async () => {
    await AsyncStorage.setItem("folio", newFolio);
    setFolio(newFolio);
  };

  //EDITA LA CANTIDAD DEL PRODUCTO Y ACTUALIZA LA LISTA DE LOS PRODUCTOS.
  const editQuantity = (indice, value) => {
    let numero = value.replace(/[^(\d*\.)?\d+$]/g, "");
    const tempProd = [...productos];
    if (parseFloat(numero) < 0) {
      numero = 0;
    }
    tempProd.forEach((item) => {
      if (item.Indice == indice) {
        item.Quantity = numero.toString();
      }
    });

    setProductos(tempProd);
  };

  //LLAMA A LA FUNCION 'checkData' CADA QUE CAMBIA LA INFORMACION DE 'dataCliente'
  useEffect(() => {
    checkData();
    getData();
  }, [dataCliente]);

  return (
    <View style={{ flex: 1 }}>
      <HeaderOP
        title="Venta"
        onPress={() => navigation.toggleDrawer()}
        folio={folio}
      />
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#E5E6EA" }}
        behavior="padding"
        enabled
      >
        <DialogVenta
          tipo="COMENTARIO"
          estado={showDialogComentario}
          handleButton={handleButtonDialog}
        />
        <DialogVenta
          tipo="FOLIO"
          estado={showDialogFolio}
          handleButton={handleButtonDialog}
        />
        <View style={styles.cardContainer}>
          <View>
            <Text style={[styles.texto, { marginTop: 4 }]}>Abarrotes: </Text>
            <Text style={styles.texto}>Codigo: </Text>
            <Text style={styles.texto}>Direccion: </Text>
          </View>
          <View style={{}}>
            {abarrey ? (
              <Text style={[styles.texto, { marginTop: 4 }]}>Abarrey</Text>
            ) : (
              <Text style={[styles.texto, { marginTop: 4 }]}>
                {" "}
                {dataCliente.CardName}
              </Text>
            )}
            <Text style={styles.texto}> {dataCliente.CardCode} </Text>
            {abarrey ? (
              <Text allowFontScaling={true} style={styles.texto}>
                {" "}
                {dataCliente.ShipToCode}{" "}
              </Text>
            ) : (
              <Text style={styles.texto}> {dataCliente.Address} </Text>
            )}
          </View>
        </View>
        <View style={{ flex: 0.69 }}>
          <ScrollView>
            {loading ? (
              <ActivityIndicator color="#ab000d" size={32} />
            ) : (
              productos.map((l, i) => (
                <ListItem
                  key={i}
                  // title={l.ItemName}
                  title={
                    <View style={{ flexDirection: "row", paddingRight: 5 }}>
                      <Input
                        returnKeyType="next"
                        keyboardType="number-pad"
                        onChangeText={(value) => editQuantity(l.Indice, value)}
                        containerStyle={{ width: 64 }}
                      />
                      <Text style={{ alignSelf: "center", fontSize: 15 }}>
                        {l.ItemName}
                      </Text>
                    </View>
                  }
                  rightTitle={
                    <View style={{ flexDirection: "row" }}>
                      <Text style={{ alignSelf: "center" }}>${l.PrecioU}</Text>
                      <Text
                        style={{
                          alignSelf: "center",
                          color: "#ab000d",
                          marginLeft: 18,
                        }}
                      >
                        ${PricePerItem(l.PrecioU, l.Quantity)}
                      </Text>
                    </View>
                  }
                  bottomDivider
                  topDivider
                  containerStyle={{ backgroundColor: "#E5E6EA" }}
                />
              ))
            )}
          </ScrollView>
        </View>
        <View style={styles.botonesContainer}>
          <View style={{ flexDirection: "row" }}>
            {/* <Text style={{ flex: 1 }}>Folio: #{folio} </Text> */}
            <Text
              style={{
                flex: 1,
                color: "#ab000d",
                fontWeight: "bold",
                fontSize: 22,
                textAlign: "center",
                letterSpacing: 1.2,
              }}
            >
              Total: $
              {isNaN(TotalDeVenta(productos)) ? 0 : TotalDeVenta(productos)}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Button
              title="Visita"
              onPress={() => verifySell("VISITA")}
              containerStyle={[styles.botonContainer, { marginLeft: 7 }]}
              buttonStyle={[{ backgroundColor: "#FF6400" }, styles.button]}
            />
            <Button
              title="Contado"
              onPress={() => verifySell("CONTADO")}
              containerStyle={[
                styles.botonContainer,
                { marginLeft: 7, marginRight: 7 },
              ]}
              buttonStyle={[styles.button, { backgroundColor: "#0012AB" }]}
            />
            <Button
              title="Cerrado"
              onPress={() =>
                navigation.navigate("CamaraPicture", { Cliente: dataCliente })
              }
              containerStyle={[
                styles.botonContainer,
                { marginLeft: 7, marginRight: 7 },
              ]}
              buttonStyle={[styles.button, { backgroundColor: "red" }]}
            />
            {habilitado ? (
              <Button
                title="Credito"
                onPress={() => verifySell("CREDITO")}
                containerStyle={[styles.botonContainer, { marginRight: 7 }]}
                buttonStyle={[styles.button, { backgroundColor: "#2B99BF" }]}
              />
            ) : null}
          </View>
          <View
            style={{
              flexDirection: "row",
              marginTop: 10,
              justifyContent: "space-evenly",
            }}
          >
            <Button
              title="Cambio"
              onPress={() => verifySell("CAMBIO")}
              containerStyle={[
                styles.botonContainer,
                { marginRight: 7, marginLeft: 7 },
              ]}
              buttonStyle={[styles.button, { backgroundColor: "#2B99BF" }]}
            />
            <Button
              title="Comentario"
              containerStyle={[styles.botonContainer, { marginRight: 7 }]}
              buttonStyle={[styles.button, { backgroundColor: "#545555" }]}
              onPress={() => setShowDialogComentario(true)}
            />
          </View>
          {/* <Input
            placeholder="Comentario"
            onChangeText={(text) => setComment(text)}
            value={comment}
          /> */}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  botonesContainer: {
    backgroundColor: "#E5E6EA",
    flex: 0.23,
    alignItems: "center",
  },
  botonContainer: {
    marginTop: 5,
    flex: 1,
  },
  botonStyle: {
    //   height
  },
  cardContainer: {
    flex: 0.13,
    backgroundColor: "#E5E6EA",
    width: wp("80%"),
    alignSelf: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: 20,
    marginTop: 12,
  },
  texto: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ab000d",
  },
  button: {
    elevation: 6,
  },
});

export default Venta;
