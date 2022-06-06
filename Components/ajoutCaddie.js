import React,{ useEffect, useState }  from "react";
import { Text,Divider,Subheading,Card,Button, Title, Paragraph } from 'react-native-paper'
import {View,StyleSheet,FlatList,ScrollView,TouchableOpacity,SafeAreaView,TextInput} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';


const ajoutCaddie  = () => {


    const [isLoading, setLoading] = useState(true);
    const [qte,setQTE] = useState({count:0});
    const [data,setData] = useState();

    _retrieveData = async () => {
      try {
          const value = await AsyncStorage.getItem('data');
          if (value !== null) {
              // Our data is fetched successfully
              setData(value)
              console.log(JSON.parse(value));
          }
      } catch (error) {
          // Error retrieving data
      }
  }

    return (
        <View>
          <Card.Title
            title="Nouveau Ticket" titleStyle={{fontWeight: 600, fontSize:20}}
            right={(props) => <Button style={{marginRight:10}} icon="percent" color="#fafafa" mode="contained" onPress={() => console.log('Pressed')}>Promo
            </Button>}  
            />
            <Divider style={{marginBottom:15}} /> 
            <FlatList
                numColumns={1}
                data={data}
                refreshing={true}
                keyExtractor={(item, index) => {
                  return item.num;
                }}
                renderItem= {({ item,index }) => {
                    return (
                      <SafeAreaView style={styles.container}>
                      <View style={styles.container}>
                        <Card style={styles.card}>
                          <Card.Title title={item.titre} subtitle={item.pu_euro + "€"} titleStyle={styles.titre} subtitleStyle={styles.subtitle} rightStyle={styles.right}
                           left={(props) => 
                            <View style={styles.buttonsAdd}>
                                 <TextInput
                                    style={styles.quantite}
                                    name="itemQTE"
                                    onChangeText = {(qte) => setQTE(props.data[index].qte = qte) }
                                    value={item.qte}
                                    placeholder="0"
                                    underlineColorAndroid={"transparent"}
                                    />
                                    
                            </View>
                          }
                          right={(props)=>
                            <Icon name="trash" size={20} color="#900" style={styles.iconPoubelle} onPress={() => console.log("Supprimé")} />
                          }
                          />
                        </Card>
                      </View>
                    </SafeAreaView>
                    );
                  }}
            />
            </View>
    )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#ffffff',
  },
  iconPoubelle: {
    paddingTop:15,
    paddingBottom:15,
    paddingRight:15
  },  
  paragraph: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
  },
  card:{
    backgroundColor:"#F2F7FB",
    borderRadius: "15px",
  },
  titre: {
    fontWeight:600,
    fontSize: 17,
  },
  subtitle: {
    fontSize:17,
    fontWeight:"normal",
  },
  quantite: {
    fontSize: 15,
    fontWeight:600,
    textAlign:"right",
    marginRight:15,
    paddingRight:15,
    width:40,
    backgroundColor:"#fff",
    borderRadius:10
  },
  buttonsAdd:{
    flex: 1,
    flexDirection:"row",
    justifyContent: 'center',
  }
  });
export default ajoutCaddie;