import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  circuloP: {
    backgroundColor: 'white',
    height: 70,
    width: 70,
    borderRadius: 100,
  },
  circuloG: {
    borderRadius: 100,
    borderColor: 'white',
    borderWidth: 5,
    height: 100,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonCont: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  camContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});

export default styles;
