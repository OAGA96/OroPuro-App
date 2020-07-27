import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E6EA',
  },
  contenido: {
    flex: 1,
  },
  card: {
    flex: 0.22,
  },
  lista: {
    // backgroundColor: "blue",
    flex: 0.78,
  },
  cardTitulos: {
    flexDirection: 'row',
  },
  cardStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('82%'),
    alignSelf: 'center',
    backgroundColor: '#ab000d',
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 10,
    // borderWidth: 3,
    // borderColor: '#ab000d' E5E6EA
  },
  tituloStyle: {
    fontSize: 20,
    color: '#E5E6EA',
    fontWeight: 'bold',
  },
  botonStyle: {
    color: '#ab000d',
  },
  botonContainer: {
    backgroundColor: '#E5E6EA',
    width: wp('68%'),
    marginTop: 14,
  },
  listContainer: {
    backgroundColor: '#E5E6EA',
  },
});

export default styles;
