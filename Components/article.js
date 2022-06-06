import { text } from 'body-parser';
import React, { useState,useEffect } from 'react';
import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";
import { Card } from 'react-native-paper';
import * as caisseData from '../caisse_data'
import realm from "../Schema/panier"


const Article = (props) => {

    const [isLoading, setLoading] = useState(true);
    const [value, setValue] = useState();
    const [articleQTE, setArticleQte] = useState(0);
    
    // realm.write(() => {
    //     realm.deleteAll();
    //   });
    // const savePanier = async (item) => {

    //     let refinconnu = '164750'
    //     let id_produit = ''

    //     if (validbarcode(item.ref) != false) {
    //         id_produit = item.id
    //         ref = item.ref
    //     }
    //     else {
    //         id_produit = '#DIVERS'
    //         ref = 'articleinconnu' + refinconnu
    //     }
    //     const date = new Date();
    //     setArticleQte(articleQTE + 1)
    //     console.log(articleQTE)
    //     realm.write(() => {
    //         panier = realm.create("Panier", {
    //             panierID: item.num,
    //             id_produit: id_produit,
    //             session: '127.0.0.1/1',
    //             ref: ref,
    //             qte: '' + articleQTE,
    //             credit: '0',
    //             pu_euro: item.prixttc_euro,
    //             promo: '',
    //             pu_deref: '',
    //             famille: '',
    //             titre: item.titre,
    //             taux_tva: '8.5',
    //             date: date.toLocaleString(),
    //             remise: '0',
    //         }, true);
    //         props.setPanier({ realm })
    //         // const caddie = realm.objects("Panier");
    //         // console.log(`The lists of tasks are: ${caddie.map((task) => task.panierID)}`);
    //     });
    // }
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
                    props.setPanier(responseJson)
                    props.setMoneyToReturn({ reponse: false, montant: 0 })
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

    return (
        <TouchableOpacity style={{ marginRight: 10 }} onPress={() => { addToPanier(props.data)  }} >
            <Card style={styles.card}>
                <View>
                    {props.data.img === "" ?
                    <View style={{width:150,height:100,borderRadius:20,justifyContent:'center'}}  ><Text style={[styles.titre,{color:'#fff',fontSize:15}]}>{props.data.titre.toLowerCase()}</Text></View>                  
                    :
                    <Image
                        source={{ uri: props.data.img }}
                        style={{
                            width:150,
                            height:100,
                            resizeMode: "cover",
                            borderRadius: 20,
                            backgroundColor: '#fff'
                        }}
                        key={props.data.id}
                    />
                    }
                    
                    <Text style={styles.titre}>{breakLine(props.data.titre.toLowerCase())}</Text>
                    <Text style={styles.prix}>{props.data.prixttc_euro} €</Text>
                </View>
            </Card>
        </TouchableOpacity>
    );
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


export default Article;