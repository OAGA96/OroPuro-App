import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  botonesContainer: {
    backgroundColor: '#E5E6EA',
    flex: 0.23,
    alignItems: 'center',
  },
  botonContainer: {
    marginTop: 5,
    flex: 1,
  },
  botonStyle: {
    //   height
  },
  cardContainer: {
    flex: 0.13,
    backgroundColor: '#d2d3d6',
    width: wp('80%'),
    alignSelf: 'center',
    justifyContent: 'center',
    // flexDirection: 'row',
    bottom: 5,
    borderRadius: 20,
    marginTop: 12,
  },
  texto: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ab000d',
    textAlign: 'center',
  },
  button: {
    elevation: 6,
  },
  infoCliente: {
    alignSelf: 'center',
  },
});

export default styles;
