import React from 'react';
import {ActivityIndicator, TouchableHighlight} from 'react-native';
import {Image} from 'react-native-elements';
import styles from './styles.image';

const ImageComponent = ({data, onPress}) => {
  return (
    <TouchableHighlight onPress={onPress}>
      <Image
        source={{uri: data[1].uri}}
        style={styles.imageStyle}
        PlaceholderContent={<ActivityIndicator />}
      />
    </TouchableHighlight>
  );
};

export default ImageComponent;
