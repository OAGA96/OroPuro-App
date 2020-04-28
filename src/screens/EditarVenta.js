import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  AsyncStorage,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Icon, ListItem, Input, Button } from "react-native-elements";
import HeaderOP from "../components/HeaderOP";
import { editEntregas } from '../functions/functions';
const EditarVenta = ({ navigation }) => {
  const ventaData = navigation.getParam("Venta");
  const [data, setData] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const _ = require("lodash");

  //EXTRAE LA ENTREGA QUE SE QUIERE MODIFICAR.
  useEffect(() => {
    (async () => {
      console.log(ventaData);
      await AsyncStorage.getItem("ListEntregas").then((items) => {
        let venta = _.remove(JSON.parse(items), function (i) {
          return i.Folio === parseInt(ventaData.Folio, 10);
        });
        // console.log(venta);
        setData(venta);
        setLoaded(true);
      });
    })();
  }, [ventaData]);

  //MODIFICA EL CAMPO DE CANTIDAD EN EL ARRAY
  const editQuantity = (item, value) => {
    const tempProd = [...data];
    tempProd.forEach((i) => {
      if (i.ItemCode === item) {
        if (value !== null && value !== undefined && parseInt(value) > 0) {
          i.Quantity = parseInt(value);
        }
      }
    });
    // console.log(tempProd);
    setData(tempProd);
  };

  return (
    <View style={{ backgroundColor: "#E5E6EA", flex: 1 }}>
      <HeaderOP title="Editar" onPress={() => navigation.toggleDrawer()} />
      <ScrollView>
        {loaded ? (
          data.map((l, i) => (
            <ListItem
              key={i}
              title={l.ItemName}
              rightTitle={
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ alignSelf: "center" }}>${l.PrecioU}</Text>
                  <Input
                    keyboardType="number-pad"
                    defaultValue={JSON.stringify(l.Quantity)}
                    containerStyle={{ width: 64 }}
                    onChangeText={(value) => editQuantity(l.ItemCode, value)}
                    placeholderTextColor="black"
                  />
                </View>
              }
              containerStyle={{ backgroundColor: "#E5E6EA" }}
              bottomDivider
            />
          ))
        ) : (
          <ActivityIndicator color="#ab000d" size={32} />
        )}
      </ScrollView>
      <View style={{ justifyContent: "center" }}>
        <Button
          title="GUARDAR"
          buttonStyle={styles.button}
          icon={<Icon name="save" type="entype" color="white" size={34} />}
          titleStyle={{fontSize: 20}}
          onPress={() => {editEntregas(data, ventaData), navigation.navigate("Inicio")}}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 15,
    elevation: 5,
    backgroundColor: "#2B99BF",
    height: 60,
    width: 240,
    marginBottom: 20,
    alignSelf: "center",
  },
});

export default EditarVenta;