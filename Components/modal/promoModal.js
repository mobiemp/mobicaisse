import React, { useEffect, useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, TextInput } from "react-native";
import { Button, Divider } from "react-native-paper"


const promoModal = (props) => {

    const [promotion,setPromotion] = useState(0)
    const addPromo = () => {
      try {
        fetch('http://caisse.serveravatartmp.com/caisse-backend/panier.php', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            addPromo: promotion,
            totalPanier:props.totalPanier,
            session: props.session
          })
  
        })
          .then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson)
            if(responseJson.response == 1){
              props.setPanier(responseJson.result)
            }
            
          })
      }
      catch (error) {
        console.error(error);
      }
    }

    const renderModal = () => {
        return (
        
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
    
    
                    <Text style={styles.modalText}>Entrez le montant de la promotion</Text>
    
                    <TextInput
                        style={styles.numericInput}
                        keyboardType='numeric'
                        onChangeText={(promotion) => setPromotion(parseFloat(promotion))}
                        value={promotion}
                        maxLength={10}
                        selectTextOnFocus={true} />
    
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Button mode="contained" style={[styles.button, styles.buttonConfirm]} onPress={() => { props.setModalPromotionVisible(false),addPromo() } }>
                            CONFIRMER
                        </Button>
                        <Button mode="contained" style={[styles.button, styles.buttonClose]} onPress={() => { props.setModalPromotionVisible(!props.modalVisiblePromotion); } }>
                            ANNULER
                        </Button>
                    </View>
    
                </View>
            {/* <View style={{ display: visible }}>
                <Text>Promo: {promotion}</Text>
            </View> */}
            </View>
            
            
          )
    }

    return (
       <Modal
            animationType="slide"
            transparent={true}
            visible={props.modalVisiblePromotion}
            onRequestClose={() => {
                alert("Le modal est fermé");
                props.setModalPromotionVisible(!props.modalVisiblePromotion);
            } }
        >
            {renderModal()}
        </Modal>
        
           
    )
    
}

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      width: 500,
      height: 300,
      justifyContent:'center',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    button: {
      padding: 10,
      elevation: 2,
      borderRadius: 5,
      height: 30,
      width: 150,
      justifyContent: 'center',
    },
    numericInput: {
      marginTop: 30,
      textAlign: 'center',
      height: 50,
      width: 150,
      marginTop: 27,
      fontSize: 24
    },
    buttonOpen: {
      backgroundColor: "#F194FF",
    },
    buttonClose: {
      backgroundColor: "#2196F3",
    },
    buttonCheques: {
      backgroundColor: 'orange',
      marginLeft: 10,
    },
    buttonConfirm: {
      backgroundColor: "red",
      marginRight: 10,
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
      fontSize: 13,
    },
    modalText: {
      marginBottom: 15,
      fontFamily: 'Tahoma',
      textAlign: "center"
    }
  });

export default promoModal;