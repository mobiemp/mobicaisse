import React,{useEffect} from 'react';
import { TextInput, StyleSheet } from "react-native";
const TextInputQTE = (props) => {
    const updateQTE = (quantite, index, ref) => {
        
        try {
          fetch('http://localhost/caisse-backend/panier.php', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              updateQTE: quantite,
              ref: ref,
            })
          }).then((response) => response.json())
          .then((responseJson) => {
            props.setQTE(props.panierRefresh[index].qte = quantite);
          })
        }
        catch (error) {
          console.error(error);
        }
      }

    return (
      <TextInput
        style={styles.quantite}
        key="textinputqte"
        mode='outlined'
        name="itemQTE"
        onChangeText={updateQTE(props.quantite, props.index, props.refs)}
        // onKeyPress={(e) => e.key === 'Enter' && updateQTE(item.qte,index.ref)}
        value={props.quantite}
        placeholder="0"
        underlineColorAndroid={"transparent"} />
    )
  }
 const styles = StyleSheet.create({
    quantite: {
        fontSize: 15,
        fontWeight: 600,
        padding: 5,
        textAlign: "center",
        justifyContent: 'center',
        backgroundColor: "#fff",
        borderColor: "lightgray",
        borderWidth: 1,
        width: 50
      },
 })

export default TextInputQTE;