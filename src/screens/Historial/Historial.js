import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  RefreshControl,
  Alert,
  Modal,
  TouchableOpacity,
  TouchableNativeFeedback,
  SafeAreaView,
  ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {ListItem, Button, Icon, SearchBar} from 'react-native-elements';
import {SwipeListView} from 'react-native-swipe-list-view';
import HeaderOP from '../../components/HeaderOP';
import {withNavigationFocus} from 'react-navigation';
import {getInfoForTicket} from '../../functions/functions';
import BluetoothSerial from 'react-native-bluetooth-serial-next';
import styles from './styles.historial';

const Historial = ({navigation}) => {
  //VARIABLES DE ESTADO
  const [historial, setHistorial] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [dataHolder, setDataHolder] = useState([]);
  const [textSearchBar, setTextSearchBar] = useState('');
  const isfocused = navigation.isFocused();
  const _ = require('lodash');

  //OBITENE LOS TOTALES DE LOS CLIENTES.
  useEffect(() => {
    (async () => {
      await AsyncStorage.getItem('Totales').then(value => {
        if (JSON.parse(value) !== null && JSON.parse(value).length > 0) {
          setHistorial(JSON.parse(value));
          setDataHolder(JSON.parse(value));
          // console.log(JSON.parse(value));
          setLoaded(true);
        }
      });
    })();
  }, [isfocused]);

  //ELIMINA TODAS LAS VENTAS CON ESE FOLIO.
  const DeleteVenta = async folio => {
    let ventaFiltrada = [];
    await AsyncStorage.getItem('ListEntregas').then(data => {
      ventaFiltrada = _.remove(JSON.parse(data), function(n) {
        return n.Folio !== parseInt(folio, 10);
      });
    });

    let HistorialF = [];
    await AsyncStorage.getItem('Totales').then(data => {
      HistorialF = _.remove(JSON.parse(data), function(n) {
        return n.Folio !== folio;
      });
    });

    if (HistorialF.length === 0) {
      setLoaded(false);
      // console.log('paso');
    }
    AsyncStorage.setItem('ListEntregas', JSON.stringify(ventaFiltrada));
    AsyncStorage.setItem('Totales', JSON.stringify(HistorialF));

    await AsyncStorage.getItem('Entregas').then(value => {
      AsyncStorage.setItem('Entregas', JSON.stringify(parseInt(value) - 1));
    });

    setHistorial(HistorialF);
  };

  //PREGUNTA AL USUARIO SI DESEA IMPRIMIR EL TICKET
  const handleReprint = async item => {
    Alert.alert(
      'Impresion',
      `¿Esta seguro que desea imprimir el ticket de ${item.CardName}?`,
      [
        {
          text: 'SI',
          onPress: async () => {
            ToastAndroid.showWithGravityAndOffset(
              'IMPRIMIENDO...',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
              25,
              50,
            );
            BluetoothSerial.isConnected('98:07:2D:37:D1:DA').then(async res => {
              if (!res) {
                await BluetoothSerial.connect('98:07:2D:37:D1:DA').then(
                  async res => {
                    await BluetoothSerial.write(await getInfoForTicket(item));
                  },
                );
              } else {
                await BluetoothSerial.write(
                  await getInfoForTicket(item),
                  '98:07:2D:37:D1:DA',
                );
              }
            });
            // console.log(await getInfoForTicket(item));
          },
        },
        {
          text: 'NO',
          onPress: () => null,
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  };

  //CONFIRMACION DE ELIMINAR.
  const OptionDelete = folio => {
    Alert.alert(
      'Advertencia',
      '¿Esta seguro de que quiere eliminar esta venta?',
      [
        {
          text: 'Si',
          onPress: () => DeleteVenta(folio),
        },
        {
          text: 'Cancelar',
          onPress: () => console.log('OK'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };

  const handleSearchBar = text => {
    if (dataHolder === undefined) {
      Alert.alert('Espere un momento.');
    } else {
      const newData = dataHolder.filter(item => {
        const itemData = item.CardName.toUpperCase();
        const textData = text.toUpperCase();

        return itemData.indexOf(textData) > -1;
      });
      setTextSearchBar(text);
      setHistorial(newData);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#E5E6EA'}}>
      <View>
        <HeaderOP title="Historial" onPress={() => navigation.toggleDrawer()} />
      </View>
      <SearchBar
        lightTheme
        value={textSearchBar}
        onChangeText={text => handleSearchBar(text)}
      />
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={{backgroundColor: 'rgba(239,230,234, .7)', flex: 1}}>
          <View style={{flex: 0.2}} />
          <View style={{flex: 0.7}} />
          <View style={{flex: 0.1}}>
            <Button title="Cerrar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
      <SafeAreaView style={{flex: 1}}>
        {/* <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}> */}
        {loaded && (
          <SwipeListView
            data={historial}
            key={historial.Folio}
            keyExtractor={item => item.Folio}
            renderItem={({item}) => (
              <TouchableNativeFeedback onPress={() => handleReprint(item)}>
                <View
                  style={{
                    flexDirection: 'row',
                    height: 60,
                    backgroundColor: '#E5E6EA',
                    borderColor: 'black',
                    borderBottomWidth: 0.8,
                  }}>
                  <Text
                    style={{
                      flex: 0.6,
                      alignSelf: 'center',
                      fontSize: 18,
                      marginLeft: 12,
                    }}>
                    {item.CardName}
                  </Text>
                  <Text
                    style={{
                      flex: 0.5,
                      alignSelf: 'center',
                      textAlign: 'right',
                      fontSize: 18,
                      marginRight: 12,
                      color: '#6A6A6A',
                    }}>
                    ({item.Tipo}) ${item.Total}
                  </Text>
                </View>
              </TouchableNativeFeedback>
            )}
            renderHiddenItem={({item}) => (
              <View style={{flexDirection: 'row', height: 66}}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    alignItems: 'flex-start',
                    backgroundColor: '#000A85',
                    justifyContent: 'center',
                  }}
                  onPress={() =>
                    navigation.navigate('EditarVenta', {Venta: item})
                  }>
                  <Icon
                    name="edit"
                    type="antdesign"
                    color="white"
                    size={30}
                    iconStyle={{marginLeft: 20}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    alignItems: 'flex-end',
                    backgroundColor: '#850000',
                    justifyContent: 'center',
                  }}
                  onPress={() => OptionDelete(item.Folio)}>
                  <Icon
                    name="trash"
                    type="entypo"
                    color="white"
                    size={30}
                    iconStyle={{marginRight: 20}}
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

export default withNavigationFocus(Historial);
