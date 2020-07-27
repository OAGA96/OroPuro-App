import {StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  imageStyle: {
    width: wp('33.33%'),
    height: hp('33.33%'),
  },
});

export default styles;
