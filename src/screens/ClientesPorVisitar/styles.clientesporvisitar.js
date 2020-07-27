import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#E5E6EA',
  },
  SwitchContainer: {
    flex: 0.08,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  listContainer: {
    flex: 0.84,
  },
  titleContainer: {
    flex: 0.7,
    justifyContent: 'center',
  },
  switcherContainer: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ab000d',
    marginLeft: 10,
  },
  switch: {
    transform: [{scaleX: 1.16}, {scaleY: 1.16}],
  },
  listStyle: {
    backgroundColor: '#E5E6EA',
  },
  totalContainer: {
    flex: 0.08,
    backgroundColor: '#ab000d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleFooter: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E5E6EA',
  },
  numeroFooter: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6400',
  },
});

export default styles;
