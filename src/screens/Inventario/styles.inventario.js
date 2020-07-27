import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E6EA',
  },
  headerContainer: {
    backgroundColor: '#E5E6EA',
    flex: 1.1,
  },
  switchContainer: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  contentSwitchContainer: {
    flexDirection: 'row',
  },
  listContainer: {
    flex: 8.2,
  },
  textSwitch: {
    alignSelf: 'flex-start',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ab000d',
    marginLeft: 14,
  },
  switch: {
    transform: [{scaleX: 1.3}, {scaleY: 1.3}],
    marginLeft: 10,
  },
  listContainerStyle: {
    backgroundColor: '#E5E6EA',
  },
  rightTitle: {
    fontWeight: 'bold',
  },
});

export default styles;
