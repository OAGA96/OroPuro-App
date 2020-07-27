import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  ScrollView,
  FlatList,
  TouchableHighlight,
  RefreshControl,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {withNavigationFocus} from 'react-navigation';
import * as MediaLibrary from 'expo-media-library';
import HeaderOP from '../../components/HeaderOP';
import ImageComponent from '../../components/Image Component/image.component';
import {photoArray} from '../../functions/functions';
import styles from './styles.testscreen';
import Imager from '../../components/Imager';

const TestScreen = ({navigation}) => {
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
      console.log(photoArray(assets.assets, abarrotes));
      setLoaded(true);
    }
  };

  useEffect(() => {
    if (isfocused) {
      getData();
    }
  }, [isfocused]);

  return (
    <View style={{flex: 1}}>
      <HeaderOP title="Test Screen" onPress={() => navigation.toggleDrawer()} />
      <View style={{flex: 1}}>
        <View style={{flex: 0.85, backgroundColor: 'black'}}>
          {imageSelected === null ? null : <Imager data={imageSelected} />}
          <View style={{flex: 0.01, backgroundColor: '#E5E6EA'}} />
        </View>
        <View style={{flex: 0.15, backgroundColor: 'blue'}}>
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

export default withNavigationFocus(TestScreen);
