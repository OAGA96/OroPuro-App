import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';
import HeaderOP from '../../components/HeaderOP';
import OpenMap from 'react-native-open-maps';
import {getDMS} from '../../functions/functions';

//ESTE ES UN MODULO PARA PRUEBAS. AQUI SE PRUEBA UN MODULO ANTES DE INTEGRARLO.

const Other = ({navigation}) => {
  const abrirMapa = () => {
    try {
      const abarrotes = {latitude: 29.066932, longitude: -110.997043};
      const dms =
        getDMS(abarrotes.latitude, 'lat') +
        ',' +
        getDMS(abarrotes.longitude, 'long');
      // console.log(dms);
      OpenMap({
        navigate_mode: 'preview',
        zoom: 20,
        end: 'BLVD VILLA RESIDENCIAL  BONITA 44',
      });
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <View>
      <HeaderOP title="Other" onPress={() => navigation.toggleDrawer()} />
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Button type="clear" title="Abrir Mapa" onPress={() => abrirMapa()} />
      </View>
    </View>
  );
};

export default Other;
