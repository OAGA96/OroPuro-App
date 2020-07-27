import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  contentContainer: {
    ...StyleSheet.absoluteFill,
    flex: 1,
    backgroundColor: '#ab000d',
  },
  cardContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E5E6EA',
    top: hp('5%'),
    bottom: hp('35%'),
    right: wp('5%'),
    left: wp('5%'),
    flex: 1,
    borderRadius: 10,
  },
  imageContainer: {
    flex: 0.35,
    justifyContent: 'center',
  },
  imageStyle: {
    alignSelf: 'center',
  },
  inputsContainer: {
    flex: 0.4,
  },
  buttonContainer: {
    flex: 0.25,
    justifyContent: 'center',
  },
  inputLabelStyle: {
    color: '#ab000d',
    fontSize: 18,
  },
  inputContainerStyle: {
    borderColor: '#ab000d',
    borderBottomWidth: 1,
  },
  buttonLabel: {
    color: '#ab000d',
    fontSize: hp('2.5%'),
    marginLeft: 15,
  },
});

export default styles;
