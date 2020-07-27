import React, {useEffect, useState, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import {Camera} from 'expo-camera';
import {withNavigationFocus} from 'react-navigation';
import {Button} from 'react-native-elements';
import {saveIntoEvidencia} from '../../functions/functions';
import styles from './styles.camarapicture';

const CamaraPicture = ({navigation}) => {
  //VARIABLES DE ESTADO.
  const [hasPermission, setHasPermission] = useState(null);
  const [hasPermissionRoll, setHasPermissionRoll] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const isCamFocused = navigation.isFocused();

  //RECIBE LA INFORMACION DEL CLIENTE DESDE EL MODULO DE Venta.js
  const Cliente = navigation.getParam('Cliente', 0);

  //VERIFICA PERMISOS DE LA CAMARA.
  useEffect(() => {
    (async () => {
      const {status} = await Camera.getPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  //VERIFICA PERMISOS PARA GUARDAR Y BORRAR FOTOS.
  useEffect(() => {
    (async () => {
      const {status} = await MediaLibrary.getPermissionsAsync();
      setHasPermissionRoll(status === 'granted');
    })();
  }, []);

  //TOMA LA FOTO Y GUARDA LA FOTO EN UN ALBUM QUE SE CREA.
  const takePicture = async () => {
    if (cameraRef) {
      let photo = await cameraRef.takePictureAsync();
      let asset = await MediaLibrary.createAssetAsync(photo.uri);
      MediaLibrary.createAlbumAsync('No Visitados', asset, false);
      saveIntoEvidencia(Cliente);
      Alert.alert('Exito', 'Se ha guardado la evidencia con exito.');
      navigation.navigate('Inicio');
    }
  };

  //OBTIENE EL ALBUM Y LAS FOTOS DE ESE ALBUM. NO SE UTILIZA.
  const getPhotos = async () => {
    if (cameraRef) {
      let albumID = await MediaLibrary.getAlbumAsync('No Visitados');
      let assets = await MediaLibrary.getAssetsAsync({album: albumID});
      // console.log(albumID, assets);
    }
  };

  //OBTIENE TODAS LAS FOTOS DE UN ALBUM Y LAS BORRA. NO SE UTILIZA.
  const deletePhoto = async () => {
    let albumID = await MediaLibrary.getAlbumAsync('No Visitados');
    let assets = await MediaLibrary.getAssetsAsync({album: albumID});
    await MediaLibrary.deleteAssetsAsync(assets.assets);
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>Sin Acceso a la camara</Text>;
  }
  return (
    <View style={{flex: 1}}>
      {isCamFocused && (
        <Camera
          style={{flex: 1}}
          type={type}
          ref={ref => {
            setCameraRef(ref);
          }}
          ratio="4:3">
          <View style={styles.camContent}>
            <View style={styles.buttonCont}>
              <TouchableOpacity onPress={() => takePicture()}>
                <View style={styles.circuloG}>
                  <View style={styles.circuloP} />
                </View>
              </TouchableOpacity>
              {/* <TouchableOpacity onPress={() => getPhotos()}>
                <View
                  style={{ backgroundColor: "red", height: 80, width: 80 }}
                />
              </TouchableOpacity>
              <Button title="Hola" onPress={() => deletePhoto()} /> */}
            </View>
          </View>
        </Camera>
      )}
    </View>
  );
};

export default withNavigationFocus(CamaraPicture);
