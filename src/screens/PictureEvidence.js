import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  AsyncStorage,
  ScrollView,
  RefreshControl,
  Alert
} from "react-native";
import { ListItem } from "react-native-elements";
import * as MediaLibrary from "expo-media-library";
import Imager from "../components/Imager";
import HeaderOP from "../components/HeaderOP";
import { photoArray } from "../functions/functions";
import { withNavigationFocus } from "react-navigation";

const PictureEvidence = ({ navigation }) => {
  //VARIABLES DE ESTADO.
  const [data, setData] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const isfocused = navigation.isFocused();

  //OBTIENE LAS FOTOS DEL ALBUM CREADO. OBTIENE LOS CLIENTES A LOS QUE SE LES
  //MARCO COMO NO VISITADOS. SE HACE UN ZIP AL ARRAY PARA QUE QUEDE ASI:
  // {OBJECT{OBJECT{FOTO1},OBJECT{CLIENTE1}},OBJECT{OBJECT{FOTO2},OBJECT{CLIENTE2}}}
  const getData = async () => {
    let albumId = await MediaLibrary.getAlbumAsync("No Visitados");
    let assets = await MediaLibrary.getAssetsAsync({ album: albumId });
    let abarrotes = JSON.parse(await AsyncStorage.getItem("Evidencia"));
    if (
      assets.assets !== undefined &&
      assets.assets !== null &&
      abarrotes !== undefined &&
      abarrotes !== null
    ) {
      setData(photoArray(assets.assets, abarrotes));
      // console.log(photoArray(assets.assets, abarrotes));
      setLoaded(true);
    }
  };

  // useEffect(() => {
  //   async () => {
  //     try {
  //       let albumId = await MediaLibrary.getAlbumAsync("No Visitados");
  //       let assets = await MediaLibrary.getAssetsAsync({ album: albumId });
  //       let abarrotes = JSON.parse(await AsyncStorage.getItem("Evidencia"));
  //       if (
  //         assets.assets !== undefined &&
  //         assets.assets !== null &&
  //         abarrotes !== undefined &&
  //         abarrotes !== null
  //       ) {
  //         setData(photoArray(assets.assets, abarrotes));
  //         setLoaded(true);
  //       }
  //     } catch (err) {
  //       Alert.alert("Ups", err);
  //     }
  //   };
  // }, [isfocused]);

  useEffect(() => {
    getData();
  }, []);

  if (data === null) {
    return (
      <View style={{ backgroundColor: "#E5E6EA", flex: 1 }}>
        <HeaderOP title="Evidencia" onPress={() => navigation.toggleDrawer()} />
        <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={getData} />
        }
        >
          <Text style={styles.title}>
            Parece que no se ha capturado abarrote cerrado.
          </Text>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#E5E6EA" }}>
      <HeaderOP title="Evidencia" onPress={() => navigation.toggleDrawer()} />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={getData} />
        }
        scrollEnabled={false}
      >
        {loaded && (
          <FlatList
            data={data}
            keyExtractor={data => data[1].uri}
            renderItem={({ item }) => <Imager data={item} />}
            horizontal
            pagingEnabled={true}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    color: "#ab000d",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 5,
    marginRight: 5
  }
});

export default PictureEvidence;
