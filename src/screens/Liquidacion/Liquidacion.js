import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ToastAndroid,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {ListItem, Button} from 'react-native-elements';
import HeaderOP from '../../components/HeaderOP';
import {
  TotalDeVenta,
  sendMail,
  createTicketLiquidacion,
} from '../../functions/functions';
import OroPuro from '../../API/OroPuro';
import * as MediaLibrary from 'expo-media-library';
import {withNavigationFocus} from 'react-navigation';
import BluetoothSerial from 'react-native-bluetooth-serial-next';
import styles from './styles.liquidacion';

const Liquidacion = ({navigation}) => {
  //VARIABLES DE ESTADO.
  const [ventas, setVentas] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [contado, setContado] = useState(0);
  const [credito, setCredito] = useState(0);
  const [buttonDis, setButtonDis] = useState(false);
  const isfocused = navigation.isFocused();

  //FUNCION QUE LIMPIA TODAS LAS LLAVES, HACE UN LLAMADO A LA API PARA LIQUIDAR
  //Y CIERRRA SESION.
  const liquidarVenta = async () => {
    const keys = [
      'userSignedIn',
      'ListRuta',
      'ListInv',
      'ListPrecio',
      'ListEntregas',
      'Entregas',
      'Visitas',
      'NoVisitados',
      'Visitados',
      'Evidencia',
      'Totales',
      'Bluetooth',
    ];
    setButtonDis(true);
    const Usuario = JSON.parse(
      await AsyncStorage.getItem('userSignedIn', null),
    );
    const ListEntregas = JSON.parse(
      await AsyncStorage.getItem('ListEntregas', null),
    );
    // const ListEntregas = null;
    // const ListEntregasText = JSON.stringify(ListEntregas);
    try {
      if (ListEntregas === null || ListEntregas.length === 0) {
        // await handlePrint();
        await AsyncStorage.multiRemove(keys);
        deletePhotos();
        await MediaLibrary.deleteAlbumsAsync('No Visitados', true);
        navigation.navigate('Auth');
        ToastAndroid.showWithGravityAndOffset(
          'NO HUBO VENTAS',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
          25,
          50,
        );
      } else {
        await OroPuro.post(
          `/PostEntrega?rutCode=${Usuario.RutCode}&slpName=${Usuario.SlpName}`,
          ListEntregas,
          {headers: {'content-type': 'application/json'}},
        )
          .then(async res => {
            // console.log('1');
            // console.log(res);
            // console.log(res.data);
            if (res.data === 'Exito') {
              await handlePrint();
              await AsyncStorage.multiRemove(keys);
              deletePhotos();
              await MediaLibrary.deleteAlbumsAsync('No Visitados', true);
            } else {
              await AsyncStorage.setItem('Error', JSON.stringify(res));
              Alert.alert(
                `Error 1`,
                'Contacte con el administrador de la aplicacion.',
              );
              setButtonDis(false);
            }
          })
          .then(() => {
            navigation.navigate('Auth');
            ToastAndroid.showWithGravityAndOffset(
              'VENTAS REGISTRADAS CON EXITO',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
            setButtonDis(false);
          })
          .catch(async e => {
            setButtonDis(false);
            console.log(e);
            sendMail(`ERROR ${Usuario.SlpName}`, e);
            Alert.alert(
              'Error 2',
              'Contacte con el administrador de la aplicacion.',
            );
          });
      }
    } catch (e) {
      setButtonDis(false);
      console.log(e);
      sendMail(`ERROR ${Usuario.SlpName}`, e);
      Alert.alert('Error 3', 'Contacte con el administrador de la aplicacion.');
    }
  };

  //ELIMINA LAS FOTOS DEL ALBUM "No Visitados"
  const deletePhotos = async () => {
    let albumId = await MediaLibrary.getAlbumAsync('No Visitados');
    let assets = await MediaLibrary.getAssetsAsync({album: albumId});
    await MediaLibrary.deleteAssetsAsync(assets.assets);
  };

  //OBTIENE TODA LA INFORMACION Y HACE UN FILTRADO DE CREDITO Y CONTADO.
  useEffect(() => {
    (async () => {
      if (isfocused) {
        try {
          await AsyncStorage.getItem('ListEntregas').then(value => {
            let lista = JSON.parse(value);
            if (lista !== null) {
              // let xLista = lista.filter(value => value.Tipo !== "VISITA");
              // setVentas(xLista);
              // setLoaded(true);
              // console.log(JSON.parse(value));

              let contado = lista.filter(value => value.Tipo === 'CONTADO');
              setContado(TotalDeVenta(contado));

              let credito = lista.filter(value => value.Tipo === 'CREDITO');
              setCredito(TotalDeVenta(credito));
            }
          });
          await AsyncStorage.getItem('Totales').then(value => {
            if (JSON.parse(value) !== null) {
              setVentas(JSON.parse(value));
              setLoaded(true);
            }
          });
        } catch (err) {
          // console.log(err);
          // Alert.alert("Error", err.message);
        }
      }
    })();
  }, [isfocused]);

  const handlePrint = async () => {
    await BluetoothSerial.write(
      await createTicketLiquidacion(contado, credito),
      '98:07:2D:37:D1:DA',
    );
  };

  return (
    <View style={styles.container}>
      <View>
        <HeaderOP
          title="Liquidacion"
          onPress={() => navigation.toggleDrawer()}
        />
      </View>
      <View style={styles.contenido}>
        <View style={styles.card}>
          <View style={styles.cardStyle}>
            <View style={styles.cardTitulos}>
              <View>
                <Text style={styles.tituloStyle}>Contado: </Text>
                <Text style={styles.tituloStyle}>Credito: </Text>
              </View>
              <View>
                <Text style={styles.tituloStyle}>${contado}</Text>
                <Text style={styles.tituloStyle}>${credito}</Text>
              </View>
            </View>
            <Button
              title="TERMINAR RUTA"
              type="clear"
              titleStyle={styles.botonStyle}
              buttonStyle={styles.botonContainer}
              onPress={liquidarVenta}
              disabled={buttonDis}
            />
            {/* <Button
              title="CALE"
              type="clear"
              titleStyle={styles.botonStyle}
              buttonStyle={styles.botonContainer}
              onPress={async () => await createTicketLiquidacion()}
              disabled={buttonDis}
            /> */}
          </View>
        </View>
        <View style={styles.lista}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {loaded &&
              ventas.map((l, i) => (
                <ListItem
                  key={i}
                  title={l.CardName}
                  rightTitle={'$' + l.Total}
                  subtitle={l.Tipo}
                  containerStyle={styles.listContainer}
                  bottomDivider
                />
              ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default withNavigationFocus(Liquidacion);
