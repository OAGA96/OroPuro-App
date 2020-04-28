import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  AsyncStorage
} from "react-native";
import { Button, ListItem, SearchBar, Icon } from "react-native-elements";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { ScrollView } from "react-native-gesture-handler";
import HeaderOP from "../components/HeaderOP";

const Clientes = ({ navigation }) => {
  //VARIABLES DE ESTADO.
  const [clientes, setClientes] = useState("");
  const [dataHolder, setDataHolder] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  //FUNCION TEMPORAL PARA VISUALIZAR LOS DATOS DE LOS CLIENTES EN CONSOLA.
  const seeInfo = () => {
    console.log(JSON.stringify(dataHolder));
  };

  //OBTIENE LOS DATOS DE LOS CLIENTES CON LA LLAVE 'ListRuta' Y LOS INSERTA EN LAS VARIABLES 'Clientes' Y 'DataHolder'.
  //CAMBIO DE ESTADO =>(Loading = false)
  useEffect(() => {
    (async () => {
      await AsyncStorage.getItem("ListRuta").then(value => {
        setClientes(JSON.parse(value));
        setDataHolder(JSON.parse(value));
      });
      setLoading(false);
    })();
  }, []);

  //FUNCION PARA EL FILTRADO DE CLIENTES. SE LLAMA CADA QUE CAMBIA EL TEXTO DEL INPUT.
  const filterClientes = text => {
    if (dataHolder === undefined) {
      Alert.alert("Cargando.", "Espere un momento.");
    } else {
      const newData = dataHolder.filter(item => {
        const itemData = item.CardName.toUpperCase();
        const textData = text.toUpperCase();

        return itemData.indexOf(textData) > -1;
      });

      setText(text);
      setClientes(newData);
    }
  };

  //MANDA PARAMETROS PARA VENTA
  const sendVenta = Data => {
    // console.log(Data);
    const Cliente = {
      CardCode: Data.CardCode,
      CardName: Data.CardName,
      ShipToCode: Data.ShipTo,
      Credito: Data.Credito,
      PriceList: Data.PriceList,
      PorQR: 0
    };

    navigation.navigate("Venta", { Cliente: Cliente });
  };

  return (
    <View style={styles.Container}>
      <HeaderOP title="Clientes" onPress={() => navigation.toggleDrawer()} />
      <SearchBar
        lightTheme
        value={text}
        onChangeText={text => filterClientes(text)}
      />
      {loading ? <ActivityIndicator color="#ab000d" size={32} /> : null}
      <ScrollView showsVerticalScrollIndicator={false}>
        {loading
          ? null
          : clientes.map((l, i) => (
              <ListItem
                key={i}
                title={l.CardCode === 'C0017' ? l.ShipTo : l.CardName}
                subtitle={l.Address}
                onPress={() => sendVenta(l)}
                topDivider
                bottomDivider
                chevron
                containerStyle={{ backgroundColor: "#E5E6EA" }}
              />
            ))}
      </ScrollView>
      {/* <Button title='info' onPress={() => seeInfo()} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    // height: hp('100%'),
    backgroundColor: "#E5E6EA"
  }
});

export default Clientes;
