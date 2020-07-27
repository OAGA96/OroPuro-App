import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Button, Input, Icon} from 'react-native-elements';
import {withNavigationFocus} from 'react-navigation';
import HeaderOP from '../../components/HeaderOP';
import styles from './styles.configuracion';

const Configuracion = ({navigation}) => {
  //VARIABLES DE ESTADO
  const [folio, setFolio] = useState('');
  const [holder, setHolder] = useState('');
  //TRAE EL ITEM 'folio' Y CHECA SU CONTENIDO. SI CONTIENE UN NUMERO CAMBIA EL ESTADO DE 'holder'.
  const getFolio = async () => {
    const folio = await AsyncStorage.getItem('folio');
    if (folio === undefined || folio === null || folio.length === 0) {
      setFolio('');
    } else {
      setFolio(folio);
    }
  };

  //GUARDA FOLIO, ES ACTIVADO CUANDO NO SE TIENE UN FOLIO EN LA VISTA DE CONFIGURACION.
  const saveFolio = async () => {
    if (folio.length === 0) {
      Alert.alert('Error.', 'Ingrese un folio correcto.');
    } else {
      await AsyncStorage.setItem('folio', folio);
      Alert.alert('Exito.', 'El folio ha sido guardado con exito.', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    }
  };

  // useEffect(() => {
  //   (async () => {
  //     const folio = await AsyncStorage.getItem("folio");
  //     if (folio === undefined || folio === null || folio.length === 0) {
  //       setFolio("");
  //     } else {
  //       setFolio(folio);
  //     }
  //   })();
  // }, [withNavigationFocus]);

  // EJECUTA LA FUNCION 'getFolio' SOLO UNA VEZ.
  useEffect(() => {
    getFolio();
  }, []);

  return (
    <View style={styles.container}>
      <HeaderOP
        title="Configuracion"
        onPress={() => navigation.toggleDrawer()}
      />
      <View style={styles.inputContainer}>
        <Input
          label="Folio"
          labelStyle={styles.inputLabel}
          // placeholder={holder}
          value={folio}
          containerStyle={styles.inputContainerStyle}
          placeholderTextColor="black"
          leftIcon={
            <Icon
              type="antdesign"
              name="tool"
              size={26}
              iconStyle={styles.iconStyle}
            />
          }
          keyboardType="decimal-pad"
          onChangeText={text => setFolio(text)}
        />
        <Button
          title="Guardar"
          type="clear"
          titleStyle={styles.buttonTitle}
          onPress={() => saveFolio()}
        />
      </View>
      {/* <Button title='Volver' onPress={() => navigation.goBack()} /> */}
    </View>
  );
};

export default Configuracion;
