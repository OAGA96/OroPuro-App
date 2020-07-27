import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ActivityIndicator, Switch} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Icon, Button, ListItem, Slider} from 'react-native-elements';
import HeaderOP from '../../components/HeaderOP';
import {ScrollView} from 'react-native-gesture-handler';
import styles from './styles.inventario';

//ESTE MODULO NO ESTA EN USO POR EL MOMENTO.
const Inventario = ({navigation}) => {
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
      await AsyncStorage.getItem('ListInv').then(value => {
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
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
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

export default Inventario;
