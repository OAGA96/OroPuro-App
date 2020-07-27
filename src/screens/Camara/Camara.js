import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, Alert, StatusBar} from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner';
import {Button} from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import styles from './styles.camara';

//YA NO SE USA ESTE MODULO. SE CAMBIO POR CamaraQR.js
const CamaraQR = ({navigation}) => {
  //VARIABLES DE ESTADO.
  const [permission, setPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  const _ = require('lodash');

  //VALIDA QUE LA APLICACION TENGA PERMISOS DE CAMARA.
  useEffect(() => {
    (async () => {
      const {status} = await BarCodeScanner.requestPermissionsAsync();
      setPermission(status === 'granted');
    })();
  }, []);

  //LEE Y VALIDA LA INFORMACION DEL QR Y MANDA LOS PARAMETROS A VENTA.JS
  const handleQRScanned = async ({type, data}) => {
    setScanned(true);
    let incluye = data.includes('|');
    if (incluye) {
      try {
        let array = _.split(data, '|');
        const Cliente = {
          CardCode: array[0],
          CardName: array[1],
          ShipToCode: array[2],
          Credito: array[4],
          PriceList: array[5],
          Tipo: 'QR',
        };
        setScanned(false);
        navigation.navigate('Venta', {Cliente: Cliente});
      } catch (err) {
        Alert.alert('Error', 'No se ha podido reconocer el QR.');
      }
    } else {
      Alert.alert('Error', 'No se ha podido reconocer el QR');
    }
  };

  if (permission === null) {
    return <Text>Otorgue permisos a la camara.</Text>;
  }
  if (permission === false) {
    return <Text>La camara no tiene permiso</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        style={StyleSheet.absoluteFillObject}
        onBarCodeScanned={scanned ? undefined : handleQRScanned}>
        <View style={styles.recuadroContainer}>
          <View style={styles.recuadro}>
            <Animatable.View
              style={{flex: 1, borderBottomWidth: 1, borderColor: 'white'}}
              animation="slideInDown"
              iterationCount="infinite"
              direction="alternate"
            />
          </View>
        </View>
        <View style={styles.botonesContainer}>
          <Button
            type="clear"
            onPress={() => navigation.goBack()}
            title="Volver"
            buttonStyle={styles.botonStyle}
            titleStyle={styles.botonTitulo}
          />
          {scanned && (
            <Button
              type="clear"
              onPress={() => setScanned(false)}
              title="Escanear de nuevo"
              titleStyle={styles.botonTitulo}
              buttonStyle={styles.botonStyle}
            />
          )}
        </View>
      </BarCodeScanner>
    </View>
  );
};

export default CamaraQR;
