import * as React from 'react';
import {View,StyleSheet,Image } from 'react-native';

const LoadingScreen = ({ navigation }) => {
    return (
      <View style={styles.container}>
          <Image 
                style={styles.logoStyle}
                source={require('../assets/logo/mobisoft-logo.png')}
            />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: 'center',
      alignContent:'center',
      backgroundColor: '#F8F8F8',
    },
  });


  export default LoadingScreen;