import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { View, Text, TextInput } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import stylesQuantity from '../stylesQuantity'
import { stat } from 'original-fs'
import panier from '../Schema/panier'

import useIsMounted from '../useIsMonted'

const QuantitySelector = (props) => {
  const defaultProps = {
    minQuantity: 0,
    baseColor: '#b2b2b2'
  }

  const propTypes = {
    minQuantity: PropTypes.number,
    maxQuantity: PropTypes.number,
    baseColor: PropTypes.string
  }

  const [state, setState] = useState({ quantity: props.produitQTE })
  const isMounted = useIsMounted();

  updateValue = (value) => {
    setState(prevState => ({
      ...prevState,
      quantity: value
    }));
    console.log(state, value)
    props.setQTE(produitQTE = value)
  }

  _onIncreaseQuantity = () => {
    setState({ quantity: parseInt(state.quantity) + 1 })
  }

  _onDecreaseQuantity = () => {
    if (props.minQuantity === undefined || state.quantity > props.minQuantity) {
      setState({ quantity: parseInt(state.quantity) - 1 })
    }
    decreaseTimer = setTimeout(_onDecreaseQuantity, 200)
  }

  _onStopDecreaseQuantity = () => {
    clearInterval(decreaseTimer)
  }

  // _onStopIncreaseQuantity = () => {
  //   clearInterval(increaseTimer)
  // }
  // useEffect(() => {
  //   console.log(state.quantity)
  //   if (isMounted.current) {
  //     props.setQTE(panierQTE = state.quantity)
  //     return () => { 
  //       isMounted.current = false
  //      }
  //   }
  // }, [isMounted]);

  return (
    <View style={[stylesQuantity.container, props.style]}>
      <Icon.Button
        size={30}
        backgroundColor='transparent'
        color={defaultProps.baseColor}
        underlayColor='transparent'
        style={stylesQuantity.actionButton}
        iconStyle={stylesQuantity.icon}
        onPressIn={_onDecreaseQuantity}
        onPressOut={_onStopDecreaseQuantity}
        name='remove-circle-outline' />
      <TextInput
        underlineColorAndroid={defaultProps.baseColor}
        keyboardType='numeric'
        onChangeText={(value) => updateValue(value)}
        style={[stylesQuantity.quantityInput, { color: defaultProps.baseColor }]}
        editable={true}
        value={state.quantity.toString()} />
      <Icon.Button
        size={30}
        color={defaultProps.baseColor}
        backgroundColor='transparent'
        underlayColor='transparent'
        style={stylesQuantity.actionButton}
        iconStyle={stylesQuantity.icon}
        onPress={_onIncreaseQuantity}
        name='add-circle-outline' />
    </View>
  )
}

export default QuantitySelector;