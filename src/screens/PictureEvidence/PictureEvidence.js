import React, {useState, useEffect, useRef} from 'react';
import {View, ScrollView, FlatList, RefreshControl} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {withNavigationFocus} from 'react-navigation';
import * as MediaLibrary from 'expo-media-library';
import HeaderOP from '../../components/HeaderOP';
import ImageComponent from '../../components/Image Component/image.component';
import {photoArray} from '../../functions/functions';
import styles from './styles.pictureevidence';
import Imager from '../../components/Imager';

const PictureEvidence = ({navigation}) => {
  const [data, setData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [imageSelected, setImageSelected] = useState(null);
  const isfocused = navigation.isFocused();

  const getData = async () => {
    let albumId = await MediaLibrary.getAlbumAsync('No Visitados');
    let assets = await MediaLibrary.getAssetsAsync({album: albumId});
    let abarrotes = JSON.parse(await AsyncStorage.getItem('Evidencia'));
    if (
      assets.assets !== undefined &&
      assets.assets !== null &&
      abarrotes !== undefined &&
      abarrotes !== null
    ) {
      setData(photoArray(assets.assets, abarrotes));
      let data = photoArray(assets.assets, abarrotes);
      setImageSelected(data[0]);
      // console.log(data[0][1]);
      // console.log(photoArray(assets.assets, abarrotes));
      setLoaded(true);
    }
  };

  useEffect(() => {
    if (isfocused) {
      getData();
    }
  }, [isfocused]);

  return (
    <View style={styles.container}>
      <HeaderOP title="Evidencia" onPress={() => navigation.toggleDrawer()} />
      <View style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          {imageSelected === null ? null : <Imager data={imageSelected} />}
          <View style={styles.thickLine} />
        </View>
        <View style={styles.albumContainer}>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={getData} />
            }
            scrollEnabled={false}>
            {loaded && (
              <FlatList
                data={data}
                keyExtractor={data => data[1].uri}
                renderItem={({item}) => (
                  <ImageComponent
                    data={item}
                    onPress={() => setImageSelected(item)}
                  />
                )}
                initialNumToRender={3}
                horizontal
                // pagingEnabled={true}
              />
            )}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default withNavigationFocus(PictureEvidence);
