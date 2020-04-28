import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  AsyncStorage,
  ActivityIndicator,
  Switch
} from "react-native";
import { Icon, Button, ListItem, Slider } from "react-native-elements";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import HeaderOP from "../components/HeaderOP";
import { ScrollView } from "react-native-gesture-handler";

//ESTE MODULO NO ESTA EN USO POR EL MOMENTO.
const Inventario = ({ navigation }) => {
  //VARIABLES DE ESTADO
  const [inventario, setInventario] = useState([]);
  const [loading, setLoading] = useState(true);
  const [switchEstado, setSwitch] = useState(false);

  //TRAE EL INVENTARIO Y CAMBIA DE ESTADO loading.
  // const getData = async () => {
  //   await AsyncStorage.getItem("ListInv").then(value => {
  //     setInventario(JSON.parse(value));
  //     setLoading(false);
  //   });
  // };

  const switcher = () => {
    if (switchEstado) {
      setSwitch(false);
    } else {
      setSwitch(true);
    }
  };

  useEffect(() => {
    (async () => {
      await AsyncStorage.getItem("ListInv").then(value => {
        setInventario(JSON.parse(value));
        setLoading(false);
      });
    })();
  }, []);

  // useEffect(() => {
  //   getData();
  // }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <HeaderOP
          title="Inventario"
          onPress={() => navigation.toggleDrawer()}
        />
      </View>
      <View style={styles.switchContainer}>
        <View style={styles.contentSwitchContainer}>
          <Text style={styles.textSwitch}>Merma</Text>
          <Switch
            value={switchEstado}
            onValueChange={() => switcher()}
            style={styles.switch}
          />
        </View>
      </View>
      <View style={styles.listContainer}>
        {loading ? <ActivityIndicator color="#ab000d" size={32} /> : null}
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {loading
            ? null
            : inventario.map((l, i) => (
                <ListItem
                  key={i}
                  title={l.ItemName}
                  rightTitle={l.OnHand.toString()}
                  rightTitleStyle={styles.rightTitle}
                  bottomDivider
                  topDivider
                  containerStyle={styles.listContainerStyle}
                />
              ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5E6EA"
  },
  headerContainer: {
    backgroundColor: "#E5E6EA",
    flex: 1.1
  },
  switchContainer: {
    flex: 0.7,
    justifyContent: "center",
    alignItems: "flex-start"
  },
  contentSwitchContainer: {
    flexDirection: "row"
  },
  listContainer: {
    flex: 8.2
  },
  textSwitch: {
    alignSelf: "flex-start",
    fontSize: 24,
    fontWeight: "bold",
    color: "#ab000d",
    marginLeft: 14
  },
  switch: {
    transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
    marginLeft: 10
  },
  listContainerStyle: {
    backgroundColor: "#E5E6EA"
  },
  rightTitle: {
    fontWeight: "bold"
  }
});

export default Inventario;
