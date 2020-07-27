import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ab000d',
    // justifyContent: 'center',
    marginBottom: 10,
    flex: 1,
    // height: hp("100%")
  },
  titulos: {
    fontSize: hp('3.5%'),
    fontWeight: 'bold',
    color: '#ab000d',
  },
  subtitulo: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#ab000d',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer1: {
    width: wp('84%'),
    backgroundColor: '#E5E6EA',
    borderRadius: 12,
    marginTop: hp('5%'),
    marginBottom: hp('2.5%'),
    elevation: 10,
  },
  cardContainer2: {
    width: wp('84%'),
    backgroundColor: '#E5E6EA',
    borderRadius: 12,
    marginBottom: hp('2.5%'),
  },
  cardContainer3: {
    width: wp('84%'),
    backgroundColor: '#E5E6EA',
    borderRadius: 12,
    shadowRadius: 10,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewTitles: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTitle: {
    fontSize: 25,
    marginLeft: 10,
  },
  divider: {
    marginTop: 12,
    backgroundColor: 'black',
  },
  button: {
    height: hp('8%'),
    borderRadius: 15,
    elevation: 5,
  },
});

export default styles;
