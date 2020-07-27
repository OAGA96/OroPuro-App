import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  botonStyle: {
    backgroundColor: '#E5E6EA',
    width: wp('45%'),
    borderRadius: 10,
  },
  botonTitulo: {
    color: '#ab000d',
    fontSize: wp('4.85%'),
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#ab000d',
  },
  recuadroContainer: {
    flex: 0.92,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recuadro: {
    height: wp('70%'),
    width: wp('70%'),
    // borderColor: "rgb(155,255,0)",
    borderColor: 'white',
    borderWidth: 3,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  botonesContainer: {
    flex: 0.08,
    backgroundColor: '#ab000d',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

export default styles;
