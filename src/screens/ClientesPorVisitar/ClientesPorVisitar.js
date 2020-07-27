import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {ListItem, Icon, SearchBar} from 'react-native-elements';
import HeaderOP from '../../components/HeaderOP';
import {contarObjetos} from '../../functions/functions';
import OpenMap from 'react-native-open-maps';
import {withNavigationFocus} from 'react-navigation';
import styles from './styles.clientesporvisitar';

const ClientesPorVisitar = ({navigation}) => {
  //VARIABLES DE ESTADO
  const [tipo, setTipo] = useState('NO VISITADOS');
  const [switchChanger, setSwitchChanger] = useState(true);
  const [clientes, setClientes] = useState([]);
  const [dataHolder, setDataHolder] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const isfocused = navigation.isFocused();

  //CAMBIA DE ESTADO PARA ACTIVAR LA FUNCION getData
  const switcher = () => {
    switchChanger ? setSwitchChanger(false) : setSwitchChanger(true);
    switchChanger ? setTipo('VISITADOS') : setTipo('NO VISITADOS');
  };

  //CAMBIA LA INFORMACION DE LA LISTA DEPENDIENDO DEL ESTADO DE tipo.
  useEffect(() => {
    (async () => {
      setLoading(true);
      switch (tipo) {
        case 'NO VISITADOS':
          await AsyncStorage.getItem('Visitados').then(value => {
            if (value === null) {
              setClientes([]);
              setLoading(false);
            } else {
              setClientes(JSON.parse(value));
              setLoading(false);
            }
          });
          break;

        case 'VISITADOS':
          await AsyncStorage.getItem('NoVisitados').then(value => {
            setClientes(JSON.parse(value));
            setDataHolder(JSON.parse(value));
            setLoading(false);
          });
          break;

        default:
          break;
      }
    })();
  }, [switchChanger, isfocused]);

  //MUESTRA LA DIRECCION AL HACER LONGPRESS.
  const showAddress = data => {
    if (data !== null && data !== undefined) {
      Alert.alert('Direccion', data);
    }
  };

  //TOMA LA DIRECCION DEL ELEMENTO DE LA LISTA Y ABRE EL MAPA PARA NAVEGAR.
  const goToMaps = address => {
    if (address !== undefined && address !== null && address.length > 0) {
      OpenMap({
        navigate_mode: 'navigate',
        end: address,
      });
    } else {
      Alert.alert(
        '¡Ups!',
        'Parece que este cliente no cuenta con direccion registrada.',
      );
    }
  };

  //FILTRA LA LISTA DE CLIENTES SOLO EN NO VISITADOS.
  const filterData = text => {
    if (dataHolder === undefined) {
      Alert.alert('Cargando', 'Espere un momento.');
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

  return (
    <View style={styles.Container}>
      <HeaderOP title="Por Visitar" onPress={() => navigation.toggleDrawer()} />
      <View style={styles.SwitchContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>CAMBIAR A {tipo} </Text>
        </View>
        <View style={styles.switcherContainer}>
          <Switch
            style={styles.switch}
            value={switchChanger}
            onValueChange={() => switcher()}
          />
        </View>
      </View>
      <View style={styles.listContainer}>
        <ScrollView>
          {switchChanger ? null : (
            <SearchBar
              lightTheme
              value={text}
              onChangeText={text => filterData(text)}
            />
          )}
          {loading ? (
            <ActivityIndicator color="#ab000d" size={32} />
          ) : (
            clientes.map((l, i) => (
              <ListItem
                key={i}
                title={l.CardName}
                rightTitle={l.Hour}
                bottomDivider
                containerStyle={styles.listStyle}
                // rightElement={
                //   switchChanger ? null : (
                //     <Icon
                //       name="map-marker-radius"
                //       type="material-community"
                //       color="#ab000d"
                //       onPress={() => goToMaps(l.Address)}
                //     />
                //   )
                // }
              />
            ))
          )}
        </ScrollView>
      </View>
      <View style={styles.totalContainer}>
        {switchChanger ? (
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.titleFooter}>Visitados: </Text>
            <Text style={styles.numeroFooter}>{contarObjetos(clientes)}</Text>
          </View>
        ) : (
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.titleFooter}>Faltan Por Visitar: </Text>
            <Text style={styles.numeroFooter}>{contarObjetos(dataHolder)}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default withNavigationFocus(ClientesPorVisitar);
