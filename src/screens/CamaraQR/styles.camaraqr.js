import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  camContent: {
    flex: 1,
  },
  container1: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.5)',
  },
  viewRowsCont: {
    flex: 1.8,
    flexDirection: 'row',
  },
  viewRow: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.5)',
  },
  recuadro: {
    flex: 5,
    borderColor: 'white',
    borderWidth: 3,
    borderRadius: 8,
  },
  buttonsCont: {
    flex: 1.5,
    backgroundColor: 'rgba(0,0,0,.5)',
    justifyContent: 'flex-end',
  },
  viewButtons: {
    flex: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
});

export default styles;
