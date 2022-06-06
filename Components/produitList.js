import { FlatList, View, Image, Text, StyleSheet, ScrollView,TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";

import { Card } from 'react-native-paper';

import useIsMounted from '../useIsMonted'


const produitList = (props) => {

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const isMounted = useIsMounted();


  const getArticles = async () => {
    try {
      const response = await fetch('http://localhost/caisse-backend/catalogue.php?' + new URLSearchParams({
        action: 'articleList',
      }))
      const json = await response.json();
      setData(json.articles);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  // articles configuration
  const addToPanier = (item) => {
    try {
        fetch('http://localhost/caisse-backend/panier.php', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                article: item,
            })

        })
            .then((response) => response.json())
            .then((responseJson) => {
                props.passProduitData(responseJson)
                props.moneyToReturn({ reponse: false, montant: 0 })
                //savePanier(responseJson)
            })
    }
    catch (error) {
        console.error(error);
    }
    finally {
        setLoading(false);
    }
}

// Genere un fond de couleur aléatoire pour les produits sans images

const generateColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0');
    return `#${randomColor}`;
  };

// Passe a la ligne en fonction de la taille du titre
const breakLine = (text) => {
    if(text.length % 10 == 0 ){
        text += '\n'
    }
}

  useEffect(() => {
    if (isMounted.current) {
    
  getArticles();

      return () => {
        setData({}); // This worked for me
      };
    }
  }, [isMounted]);

  return (

    <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 10 }}>
      <FlatList
        numColumns={4}
        data={Object.keys(props.produitFilter).length != 0 ? props.produitFilter : data}
        keyExtractor={(item, index) => String(index)}
        renderItem={({ item }) => {
          return (
            // <Article data={item} setPanier={props.passProduitData} setMoneyToReturn={props.moneyToReturn} qte={props.qte} setQTE={props.setQTE} />
            <TouchableOpacity style={{ marginRight: 10 }} onPress={() => { addToPanier(item)  }} >
            <Card style={styles.card}>
                <View>
                    {item.img === "" ? 
                    <View style={{width:150,height:100,borderRadius:20,justifyContent:'center',backgroundColor:'steelblue'}}  ><Text style={[styles.titre,{color:'#fff',fontSize:15}]}>{item.titre.toLowerCase()}</Text></View>                  
                    :
                    <Image
                        source={{ uri: item.img }}
                        style={{
                            width:150,
                            height:100,
                            resizeMode: "cover",
                            borderRadius: 20,
                            backgroundColor: '#fff'
                        }}
                        key={item.id}
                    />
                    }
                    
                    <Text style={styles.titre}>{breakLine(item.titre.toLowerCase())}</Text>
                    <Text style={styles.prix}>{item.prixttc_euro} €</Text>
                </View>
            </Card>
        </TouchableOpacity>
          );
        }}
      />
    </View>

  )
}

const styles = StyleSheet.create({
  titre: {
      textAlign: "center",
      textTransform:'capitalize',
      fontSize: 13,
      fontFamily:'Tahoma',
      fontWeight:600
  },
  prix: {
      color: "#F1743C",
      fontWeight:'bold',
      textAlign: "center",
      zIndex:10,
      backgroundColor:'#f8f8f8',
      width:'50%',
      padding:5,
      borderRadius:5,
      position:'absolute',
      bottom:'-14px',
      left:'25%'
  },
  card: {
      padding: 10,
      margin: 10,
      backgroundColor: '#fff',
      borderRadius:5
  }
});


export default produitList;
