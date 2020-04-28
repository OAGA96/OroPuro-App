import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  AsyncStorage,
  ScrollView,
  RefreshControl,
  Alert,
  Modal,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { ListItem, Button, Icon } from "react-native-elements";
import { SwipeListView } from "react-native-swipe-list-view";
import HeaderOP from "../components/HeaderOP";
import { withNavigationFocus } from "react-navigation";

const Historial = ({ navigation }) => {
  //VARIABLES DE ESTADO
  const [historial, setHistorial] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const isfocused = navigation.isFocused();
  const _ = require("lodash");

  //OBITENE LOS TOTALES DE LOS CLIENTES.
  useEffect(() => {
    (async () => {
      await AsyncStorage.getItem("Totales").then((value) => {
        if (JSON.parse(value) !== null && JSON.parse(value).length > 0) {
          setHistorial(JSON.parse(value));
          // console.log(JSON.parse(value));
          setLoaded(true);
        }
      });
    })();
  }, [isfocused]);

  //ELIMINA TODAS LAS VENTAS CON ESE FOLIO.
  const DeleteVenta = async (folio) => {
    let ventaFiltrada = [];
    await AsyncStorage.getItem("ListEntregas").then((data) => {
      ventaFiltrada = _.remove(JSON.parse(data), function (n) {
        return n.Folio !== parseInt(folio, 10);
      });
    });

    let HistorialF = [];
    await AsyncStorage.getItem("Totales").then((data) => {
      HistorialF = _.remove(JSON.parse(data), function (n) {
        return n.Folio !== folio;
      });
    });

    if (HistorialF.length ===0) {
      setLoaded(false);
      console.log('paso');
    }
    AsyncStorage.setItem("ListEntregas", JSON.stringify(ventaFiltrada));
    AsyncStorage.setItem("Totales", JSON.stringify(HistorialF));

    await AsyncStorage.getItem("Entregas").then((value) => {
      AsyncStorage.setItem("Entregas", JSON.stringify(parseInt(value) - 1));
    });

    setHistorial(HistorialF);
  };

  //CONFIRMACION DE ELIMINAR.
  const OptionDelete = (folio) => {
    Alert.alert(
      "Advertencia",
      "¿Esta seguro de que quiere eliminar esta venta?",
      [
        {
          text: "Si",
          onPress: () => DeleteVenta(folio),
        },
        {
          text: "Cancelar",
          onPress: () => console.log("OK"),
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#E5E6EA" }}>
      <View>
        <HeaderOP title="Historial" onPress={() => navigation.toggleDrawer()} />
      </View>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={{ backgroundColor: "rgba(239,230,234, .7)", flex: 1 }}>
          <View style={{ flex: 0.2 }} />
          <View style={{ flex: 0.7 }} />
          <View style={{ flex: 0.1 }}>
            <Button title="Cerrar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
      <SafeAreaView style={{ flex: 1 }}>
        {/* <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}> */}
        {
          loaded && (
            <SwipeListView
              data={historial}
              key={historial.Folio}
              keyExtractor={(item) => item.Folio}
              renderItem={({ item }) => (
                <View
                  style={{
                    flexDirection: "row",
                    height: 60,
                    backgroundColor: "#E5E6EA",
                    borderColor: "black",
                    borderBottomWidth: 0.8,
                  }}
                >
                  <Text
                    style={{
                      flex: 0.8,
                      alignSelf: "center",
                      fontSize: 18,
                      marginLeft: 12,
                    }}
                  >
                    {item.CardName}
                  </Text>
                  <Text
                    style={{
                      flex: 0.2,
                      alignSelf: "center",
                      textAlign: "right",
                      fontSize: 18,
                      marginRight: 12,
                      color: "#6A6A6A",
                    }}
                  >
                    ${item.Total}
                  </Text>
                </View>
              )}
              renderHiddenItem={({ item }) => (
                <View style={{ flexDirection: "row", height: 66 }}>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      alignItems: "flex-start",
                      backgroundColor: "#000A85",
                      justifyContent: "center",
                    }}
                    onPress={() => navigation.navigate('EditarVenta', {Venta: item})}
                  >
                    <Icon
                      name="edit"
                      type="antdesign"
                      color="white"
                      size={30}
                      iconStyle={{ marginLeft: 20 }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      alignItems: "flex-end",
                      backgroundColor: "#850000",
                      justifyContent: "center",
                    }}
                    onPress={() => OptionDelete(item.Folio)}
                  >
                    <Icon
                      name="trash"
                      type="entypo"
                      color="white"
                      size={30}
                      iconStyle={{ marginRight: 20 }}
                    />
                  </TouchableOpacity>
                </View>
              )}
              leftOpenValue={75}
              rightOpenValue={-75}
              previewRowKey={historial[0].Folio}
              previewRepeat={true}
              previewRepeatDelay={3500}
            />
          )
          // historial.map((l, i) => (
          //   <ListItem
          //     key={i}
          //     title={l.CardName}
          //     rightTitle={"$" + l.Total}
          //     containerStyle={styles.listContainerStyle}
          //     bottomDivider
          //     topDivider
          //     onPress={() => OptionDelete(l.Folio)}
          //   />
          // ))
        }
        {/* </ScrollView> */}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  listContainerStyle: {
    backgroundColor: "#E5E6EA",
  },
});

export default withNavigationFocus(Historial);
