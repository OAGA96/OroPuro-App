import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(171, 0, 13, .85)',
  },
  inputContainer: {
    width: wp('85%'),
    height: hp('28%'),
    backgroundColor: '#C4BEBF',
    marginTop: 20,
    alignSelf: 'center',
    borderRadius: 18,
    justifyContent: 'center',
  },
  inputContainerStyle: {
    marginBottom: 20,
    marginTop: 20,
  },
  iconStyle: {
    color: '#ab000d',
  },
  inputLabel: {
    color: '#ab000d',
  },
  buttonTitle: {
    color: '#ab000d',
  },
});

export default styles;
