import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ToastAndroid,
  Image,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Button, Text, Card, Icon, Divider} from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import * as Animatable from 'react-native-animatable';
import OroPuro from '../../API/OroPuro';
import HeaderOP from '../../components/HeaderOP';
import {TotalDeVenta, sendMail} from '../../functions/functions';
import {withNavigationFocus} from 'react-navigation';
import BluetoothSerial from 'react-native-bluetooth-serial-next';
import styles from './styles.inicio';

const Inicio = ({navigation}) => {
  //VARIABLES DE ESTADO.
  const [user, setUser] = useState('');
  const [entregas, setEntregas] = useState('0');
  const [visitas, setVisitas] = useState('0');
  const [contado, setContado] = useState(0);
  const [credito, setCredito] = useState(0);
  const [count, setCount] = useState(0);
  const [btColor, setBTColor] = useState('grey');
  const isfocused = navigation.isFocused();

  const info = async () => {
    await AsyncStorage.getItem('userSignedIn').then(value =>
      console.log(value),
    );
    await AsyncStorage.getItem('ListEntregas').then(value =>
      console.log(value),
    );
  };

  //CHECA SI YA EXISTE INFORMACION EN LA LLAVE PARA NO REINICIAR LA LISTA DE NO VISITADOS.
  const checkNoVisitados = async lista => {
    let novisitados = await AsyncStorage.getItem('NoVisitados');
    // console.log(novisitados);
    if (novisitados === null || novisitados === undefined) {
      await AsyncStorage.setItem('NoVisitados', JSON.stringify(lista));
    }
  };

  //FUNCION QUE INSERTA LOS DATOS OBTENIDOS DE LA API EN ITEMS DE AsyncStorage.
  const getData = async () => {
    const user = JSON.parse(await AsyncStorage.getItem('userSignedIn'));
    const lista = await AsyncStorage.getItem('ListRuta');
    if (lista === undefined || lista === null) {
      await OroPuro.get(
        `/GetData?slpName=${user.SlpName}&rutCode=${user.RutCode}`,
      )
        .then(result => {
          AsyncStorage.setItem(
            'ListRuta',
            JSON.stringify(result.data.Clientes),
          );
          AsyncStorage.setItem(
            'NoVisitados',
            JSON.stringify(result.data.Clientes),
          );
          // checkNoVisitados(result.data.ListRuta);
          AsyncStorage.setItem(
            'ListInv',
            JSON.stringify(result.data.Productos),
          );
          // console.log(result.data.Productos);
          AsyncStorage.setItem(
            'ListPrecio',
            JSON.stringify(result.data.Precios),
          );
          AsyncStorage.setItem('folio', JSON.stringify(user.Folio));
          ToastAndroid.showWithGravityAndOffset(
            'CLIENTES CARGADOS CON EXITO.',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
        })
        .catch(err => {
          alert(err);
        });
    } else {
      ToastAndroid.showWithGravityAndOffset(
        'CLIENTES CARGADOS',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    }

    //CHECA LAS VISITAS Y CAMBIA EL ESTADO DE VISITAS
    await AsyncStorage.getItem('Visitas').then(value => {
      if (value === null) {
        setVisitas(0);
      } else {
        setVisitas(parseFloat(value));
      }
    });
  };

  //TOMA LOS DATOS DE LA LLAVE 'userSignedIn' Y CAMBIA EL ESTADO DE LA VARIABLE 'user'
  const getUser = async () => {
    await AsyncStorage.getItem('userSignedIn').then(value => {
      setUser(JSON.parse(value));
      // console.log(value);
    });
    getData();
  };

  //FUNCION QUE TRAE LA INFORMACION SOBRE EL NUMERO DE VISITAS, VENTAS.
  //TOTAL DE VENTA DE CREDITO Y CONTADO.
  useEffect(() => {
    (async () => {
      await AsyncStorage.getItem('Visitas').then(value => {
        if (value !== null) {
          setVisitas(value);
        }
      });
      await AsyncStorage.getItem('Entregas').then(value => {
        if (value !== null) {
          setEntregas(value);
        }
      });
      let entregas = JSON.parse(await AsyncStorage.getItem('ListEntregas'));
      // console.log(entregas);
      if (entregas !== null) {
        let contado = entregas.filter(value => value.Tipo === 'CONTADO');
        // console.log(contado);
        let credito = entregas.filter(value => value.Tipo === 'CREDITO');
        setContado(TotalDeVenta(contado));
        setCredito(TotalDeVenta(credito));
      }
    })();
  }, [isfocused]);

  //NO SE UTILIZA SE PUEDE BORRAR.
  const deleteFolio = async () => {
    await AsyncStorage.removeItem('folio');
    alert('removed');
  };

  const connectPrinter = async () => {
    try {
      BluetoothSerial.isConnected('98:07:2D:37:D1:DA')
        .then(async res => {
          if (!res) {
            setBTColor('grey');
            await BluetoothSerial.connect('98:07:2D:37:D1:DA').then(res => {
              AsyncStorage.setItem('Bluetooth', 'true');
              // BluetoothS erial.device(res.id)
              //   .write('Conectado...\r\n\r\n\r\n')
              //   .catch(err => null);
              setBTColor('blue');
            });
          } else {
            setBTColor('blue');
            AsyncStorage.setItem('Bluetooth', 'true');
          }
        })
        .catch(err => {
          Alert.alert('UPS', err.toString());
          AsyncStorage.setItem('Bluetooth', 'false');
        });
    } catch (err) {
      Alert.alert('UPS', err.toString());
      AsyncStorage.setItem('Bluetooth', 'false');
    }
  };

  useEffect(() => {
    (async () => {
      await BluetoothSerial.isConnected('98:07:2D:37:D1:DA').then(res => {
        if (res) {
          setBTColor('blue');
          AsyncStorage.setItem('Bluetooth', 'true');
        } else {
          setBTColor('grey');
          AsyncStorage.setItem('Bluetooth', 'false');
        }
      });
    })();
  }, [isfocused]);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       BluetoothSerial.isConnected('98:07:2D:37:D1:DA').then(async res => {
  //         if (!res) {
  //           setBTColor('grey');
  //           await BluetoothSerial.connect('98:07:2D:37:D1:DA').then(res => {
  //             AsyncStorage.setItem('Bluetooth', 'true');
  //             // BluetoothSerial.device(res.id)
  //             //   .write('Conectado...\r\n\r\n\r\n')
  //             //   .catch(err => null);
  //             setBTColor('blue');
  //           });
  //         } else {
  //           AsyncStorage.setItem('Bluetooth', 'true');
  //           setBTColor('blue');
  //         }
  //       });
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   })();
  // }, [isfocused]);

  //[NO SE UTILIZA, SE PUEDE BORRAR.]
  //FUNCION QUE CORRE CADA 2 SEGUNDOS. ESTA CHECA SI HUBO CAMBIOS EN EL NUMERO DE VENTAS Y VISITAS.
  // useEffect(() => {
  //   const id = setInterval(() => {
  //     setCount(c => c + 1);
  //     getMyKeys();
  //   }, 2000);

  //   return () => clearInterval(id);
  // }, []);

  //CORRE LA FUNCION 'getUser' AL CARGAR LA PANTALLA
  useEffect(() => {
    getUser();
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#ab000d'}}>
      <ScrollView style={styles.container}>
        <HeaderOP
          title="Inicio"
          onPress={() => navigation.toggleDrawer()}
          bluetooth={btColor}
          type={1}
          onPressBT={connectPrinter}
        />
        <Animatable.View animation="bounceInUp">
          <View style={styles.contentContainer}>
            <Card containerStyle={styles.cardContainer1}>
              <View style={styles.titleContainer}>
                <Text style={styles.titulos}> {user.SlpName} </Text>
              </View>
            </Card>
            <Card containerStyle={styles.cardContainer2}>
              <View style={styles.viewTitles}>
                <View>
                  <Text style={styles.subtitulo}>Entregas:</Text>
                  <Text style={styles.subtitulo}>Visitas:</Text>
                  <Text style={styles.subtitulo}>Contado:</Text>
                  <Text style={styles.subtitulo}>Credito:</Text>
                </View>
                <View>
                  <Text style={styles.subtitulo}> {entregas} </Text>
                  <Text style={styles.subtitulo}> {visitas} </Text>
                  <Text style={styles.subtitulo}> ${contado} </Text>
                  <Text style={styles.subtitulo}> ${credito} </Text>
                </View>
                <View>
                  <Image
                    source={require('../../images/logoOroPuro2.png')}
                    style={{
                      height: wp('26%'),
                      width: wp('30%'),
                      marginLeft: 12,
                    }}
                  />
                </View>
              </View>
            </Card>
            <Card containerStyle={styles.cardContainer3}>
              <Button
                title="CAMARA"
                icon={
                  <Icon
                    name="qrcode-scan"
                    type="material-community"
                    size={40}
                    color="white"
                  />
                }
                titleStyle={styles.buttonTitle}
                buttonStyle={[styles.button, {backgroundColor: '#0012AB'}]}
                onPress={() => navigation.navigate('CameraQR')}
              />
              <Divider style={styles.divider} />
              <Button
                title="CLIENTES"
                containerStyle={{marginTop: 12}}
                icon={
                  <Icon
                    name="ios-people"
                    type="ionicon"
                    size={40}
                    color="white"
                  />
                }
                buttonStyle={[styles.button, {backgroundColor: '#FF6400'}]}
                titleStyle={styles.buttonTitle}
                onPress={() => navigation.navigate('Clientes')}
              />
              <Divider style={styles.divider} />

              <Button
                title="HISTORIAL"
                containerStyle={{marginTop: 12}}
                icon={
                  <Icon
                    name="book-open-page-variant"
                    type="material-community"
                    color="white"
                    size={40}
                  />
                }
                buttonStyle={[styles.button, {backgroundColor: '#2B99BF'}]}
                titleStyle={styles.buttonTitle}
                onPress={() => navigation.navigate('Historial')}
                // onPress={() => sendMail('Prueba', 'Del Celular')}
              />
            </Card>
          </View>
        </Animatable.View>
        {/* <Button title='Back' type='clear' onPress={() => signOut()} /> */}
        {/* <Button title='More' type='solid' onPress={() => info()} /> */}
      </ScrollView>
    </View>
  );
};

export default withNavigationFocus(Inicio);
