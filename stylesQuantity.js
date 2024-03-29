import { StyleSheet } from 'react-native'

const stylesQuantity = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: 10,
    marginRight: 10,
    padding: 0
  },
  actionButton: {
  },
  icon: {
    marginRight: 0,
    alignSelf: 'center'
  },
  quantityInput: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    height: 45,
    width:35
  }
})

export default stylesQuantity