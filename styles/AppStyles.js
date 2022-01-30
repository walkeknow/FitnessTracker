import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'white',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  row: {
    margin: 10,
    flexDirection: 'row',
  },
  label: {
    color: '#007FFF',
  },
  button: {
    marginTop: 20,
    marginLeft: 24,
    borderRadius: 5,
    height: 50,
    width: 150,
    backgroundColor: '#FDC7C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  statList: {
    marginTop: 20,
    marginHorizontal: 18,
  },
});

export default styles;
