import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { withNavigationFocus } from "react-navigation";
import { Camera } from "expo-camera";
import HeaderOP from "../components/HeaderOP";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Icon } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Animatable from "react-native-animatable";

const CameraQR = ({ navigation }) => {
  //VARIABLES DE ESTADO.
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [scanned, setScanned] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flashType, setFlashType] = useState("off");
  const isCamFocused = navigation.isFocused();
  const _ = require("lodash");

  //VERIFICA PERMISSOS PARA LA CAMARA.
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  //OBTIENE LA INFORMACION DEL QR Y LA MANDA A EL MODULO Venta.js
  const handleQRScanned = async ({ type, data }) => {
    setScanned(true);
    let incluye = data.includes("|");
    if (incluye) {
      try {
        let array = _.split(data, "|");
        const Cliente = {
          CardCode: array[0],
          CardName: array[1],
          ShipToCode: array[2],
          Credito: array[4],
          PriceList: array[5],
          PorQR: 1
        };
        setScanned(false);
        setFlashType('off');
        navigation.navigate("Venta", { Cliente: Cliente });
      } catch (err) {
        Alert.alert("Error", "No se ha podido reconocer el QR.");
      }
    } else {
      Alert.alert("Error", "No se ha podido reconocer el QR");
    }
  };

  //PRENDE Y APAGA EL FLASH DE LA CAMARA.
  const handleFlash = () => {
    switch (flashType) {
      case "off":
        setFlashType("torch");
        break;
      case "torch":
        setFlashType("off");
        break;
      default:
        break;
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return (
      <View>
        <HeaderOP title="Camara" onPress={() => navigation.toggleDrawer()} />
        <Text>Sin acceso a la camara.</Text>
      </View>
    );
  }

  return (
    <View style={styles.contentContainer}>
      <HeaderOP title="Camara" onPress={() => navigation.toggleDrawer()} />
      {isCamFocused && (
        <Camera
          style={{ flex: 1 }}
          type={type}
          ref={ref => {
            setCameraRef(ref);
          }}
          barCodeScannerSettings={{
            barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr]
          }}
          onBarCodeScanned={scanned ? undefined : handleQRScanned}
          flashMode={flashType}
        >
          <View style={styles.camContent}>
            <View style={styles.container1} />
            <View style={styles.viewRowsCont}>
              <View style={styles.viewRow} />
              <View style={styles.recuadro}>
                <Animatable.View
                  style={{
                    flex: 1,
                    borderBottomWidth: 1,
                    borderColor: "white"
                  }}
                  animation="slideInDown"
                  iterationCount="infinite"
                  direction="alternate"
                />
              </View>
              <View style={styles.viewRow} />
            </View>
            <View style={styles.buttonsCont}>
              <View style={styles.viewButtons}>
                <View style={{flex:1}} >
                  <TouchableOpacity onPress={() => handleFlash()}>
                    <Icon
                      name="md-flashlight"
                      type="ionicon"
                      size={100}
                      color="#E5E6EA"
                    />
                  </TouchableOpacity>
                </View>
                <View style={{flex:1}} >
                  {scanned && (
                    <TouchableOpacity
                      onPress={() => setScanned(false)}
                      style={{ marginLeft: 50 }}
                    >
                      <Icon
                        name="refresh"
                        type="fontawesome"
                        size={100}
                        color="#E5E6EA"
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </View>
        </Camera>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1
  },
  camContent: {
    flex: 1
  },
  container1: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,.5)"
  },
  viewRowsCont: {
    flex: 1.8,
    flexDirection: "row"
  },
  viewRow: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,.5)"
  },
  recuadro: {
    flex: 5,
    borderColor: "white",
    borderWidth: 3,
    borderRadius: 8
  },
  buttonsCont: {
    flex: 1.5,
    backgroundColor: "rgba(0,0,0,.5)",
    justifyContent: 'flex-end'
  },
  viewButtons: {
    flex: 0.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20
  }
});

export default withNavigationFocus(CameraQR);
