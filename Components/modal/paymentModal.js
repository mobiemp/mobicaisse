import React, { useEffect, useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, TextInput } from "react-native";
import { Button, Divider } from "react-native-paper"
import searchArticleModal from './searchArticleModal'
import * as caisseData from '../../caisse_data'
import validbarcode from "barcode-validator";
import realm from "../../Schema/panier"

import confirmDialog from '../dialog/confirmDialog'
import { event } from "react-native-reanimated";

const paymentModal = (props) => {

  // const [montant, setMontant] = useState(0);
  const [retour, setRetourArticle] = useState('');
  // const [data, setData] = useState([])
  const [showModal, setShowSearchModal] = useState(false)
  const [divers, setArticleDivers] = useState('')
  const [prixDivers, setPrixDivers] = useState(0)
  const [codeTVA, setCodeTVA] = useState(0)

  const totalPanier = props.modalData.total;
  const [total, setTotal] = useState(totalPanier)
  const [methodePaiement, setMethodePaiement] = useState('')
  const [totalTemp, setTotalTemp] = useState(totalPanier)


  const [cb, setCB] = useState(0)
  const [espece, setEspece] = useState(0)
  const [cheques, setCheques] = useState(0)
  const [ticketRestaurant, setTicketRestaurant] = useState(0)

  const [showConfirm, setShowConfirm] = useState(false)



  const createTicket = () => {
    try {
      fetch('http://localhost/caisse-backend/tickets/ajoutTicket.php', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          panier: props.modalData.panier,
          id_caisse: props.idCaisse,
          totalPanier: props.modalData.total,
        })

      })
        .then((response) => response.text())
        .then((responseJson) => {
          console.log(responseJson)
          if (responseJson.response === 1) {
            clearPanier({})
          }
        })
    }
    catch (error) {
      console.error(error);
    }
  }

  clearPanier = (data) => {
    props.passDataToModal(data);
    fetch('http://localhost/caisse-backend/panier/emptyPanier.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clear: true,
      })
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson === 1) {
          props.setTotalParent(0)
        }
      })
  }

  retourArticle = async (retour) => {
    try {
      fetch('http://localhost/caisse-backend/catalogue.php', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          retourArticle: retour,
          id_caisse: caisseData.ID_CAISSE
        })

      })
        .then((response) => response.json())
        .then((responseJson) => {

          if (responseJson === 0) {
            setShowSearchModal(true)
          }
          else if (validbarcode(responseJson.ref)) {
            fetch('http://localhost/caisse-backend/panier.php', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                retourArticle: responseJson,
                id_caisse: caisseData.ID_CAISSE
              })
            })
              .then((response) => response.json())
              .then((responseRetour) => {
                console.log(responseRetour)
                props.passDataToModal(responseRetour)
              })
          }
        })
    } catch (error) {
      console.error(error);
    }
  }

  createArticleDivers = () => {

    try {
      fetch('http://localhost/caisse-backend/panier.php', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articleDivers: divers,
          prixDivers: prixDivers,
          codeTVA: codeTVA,
          id_caisse: caisseData.ID_CAISSE
        })

      })
        .then((response) => response.text)
        .then((responseJson) => {
          console.log(responseJson)
        });
    } catch (error) {
      console.error(error);
    }
  }

  const setPaiementValeurs = (type) => {
    // console.log('type=>',type,'montant=>',totalTemp,'resto=>',ticketRestaurant)
    var p_espece = (type === 1 && totalTemp === totalPanier ? totalPanier : (type === 1 && totalPanier > totalTemp ? totalTemp : espece));
    var p_cb = (type === 2 && totalTemp === totalPanier ? totalPanier : (type === 2 && totalPanier > totalTemp ? totalTemp : cb));
    var p_cheque = (type === 3 && totalTemp === totalPanier ? totalPanier : (type === 3 && totalPanier > totalTemp ? totalTemp : cheques));
    var p_restaurant = (type === 4 && totalTemp === totalPanier ? totalPanier : (type === 4 && totalPanier > totalTemp ? totalTemp : ticketRestaurant));
    fetch('http://localhost/caisse-backend/panier/panier_temp.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        espece: p_espece,
        cb: p_cb,
        cheques: p_cheque,
        ticket_restaurant: p_restaurant,
        totalTemp: totalTemp,
        id_caisse: caisseData.ID_CAISSE
      })

    })
      // .then((response) => response.json())
      // .then((responseJson) => {
      //   console.log(responseJson)
      // })
  }

  // PAIEMENT CHEQUES
  const paiementCheque = () => {
    var res = false
    if (cheques === 0) {
      setPaiementValeurs(3)
      clearPanier({})
      props.setModalVisible(false)
      res = true
    }
    else {
      if (totalTemp === 0 && cb > 0) {
        setPaiementValeurs(0)
        createTicket()
        res = true
      }
      else {


        var paiement = parseFloat(totalPanier) - (espece + cb + cheques + restaurant);
        setTotalTemp(paiement)
        setShowConfirm(true)
        // setPaiementValeurs(0)
      }
    }
    res === true ? createTicket() : console.log('Création du ticket échoué !');
  }
  // PAIEMENT CB
  const paiementCB = () => {
    var res = false

    if (cb === 0) {
      clearPanier({})
      setPaiementValeurs(2)
      props.setModalVisible(false)
      res = true
    }
    else {
      if (totalTemp === 0 && cb > 0) {
        setPaiementValeurs(0)
        createTicket()
        res = true
      }
      else {
        var paiement = parseFloat(totalPanier) - (espece + cb + cheques + ticketRestaurant);
        // console.log(paiement,totalPanier,espece,cb,cheques)
        setTotalTemp(paiement)
        setShowConfirm(true)
        // setPaiementValeurs(0)
      }
    }

    res === true ? createTicket() : console.log('Création du ticket échoué !');
  }

  // PAIEMENT TICKET RESTAURANT
  const paiementRestaurant = () => {
    var res = false
    console.log(ticketRestaurant,totalTemp)
    if (ticketRestaurant === 0) {
      clearPanier({})
      setPaiementValeurs(4)
      props.setModalVisible(false)
      res = true
    }
    else {
      if (totalTemp === 0 && ticketRestaurant > 0) {
        setPaiementValeurs(0)
        createTicket()
        res = true
      }
      else {
        var paiement = parseFloat(totalPanier) - (espece + cb + cheques + ticketRestaurant);
        setTotalTemp(paiement)
        setShowConfirm(true)
        // setPaiementValeurs(0)
      }
    }

    res === true ? createTicket() : console.log('Création du ticket échoué !');
  }

  // PAIEMENT EN ESPECE
  const paiementEspece = () => {
    var res = false
    if (espece > totalPanier) {
      var A_rendre = espece - total
      props.setMoneyToReturn({ reponse: true, montant: A_rendre.toFixed(2) })
      setPaiementValeurs(0)
      clearPanier({})
      props.setModalVisible(false)
      res = true
    }
    else if (espece === 0) {
      setPaiementValeurs(1)
      setEspece(totalPanier)
      clearPanier({})
      props.setModalVisible(false)
      res = true
    }
    else {
      if (totalTemp === 0 && espece > 0) {
        setPaiementValeurs(0)
        createTicket()
        res = true
      }
      else {
        var paiement = parseFloat(totalPanier) - (espece + cb + cheques + ticketRestaurant);
        console.log(paiement, totalPanier, espece, cb, cheques, ticketRestaurant)
        setTotalTemp(paiement)
        setShowConfirm(true)
        // setPaiementValeurs(0)
      }

    }
    res === true ? createTicket() : console.log('Création du ticket échoué !');
  }


  useEffect(() => {
    // setTotal(totalPanier)

    setEspece(espece)
    if (methodePaiement === 'cb') {
      setCB(total - montant)
      console.log(total, montant, methodePaiement)
    }
    else if (methodePaiement === 'especes') {
      setEspece(total - montant)
      console.log(total, montant, methodePaiement)
    }
    else if (methodePaiement === 'cheques') {
      setCheque(total - montant, methodePaiement)
      console.log(total, montant, methodePaiement)
    }

  }, [totalPanier, methodePaiement]);

  const renderModal = () => {
    if (props.type === "cb") {
      return (
        <View style={styles.centeredView}>
          {showConfirm === false ?
            <View style={styles.modalView}>


              <Text style={styles.modalText}>Choisir un <Text style={{ fontWeight: 600 }}>MONTANT</Text> ou <Text style={{ fontWeight: 600 }}>PAYER {props.modalData.total} </Text>€ par CB-CA</Text>

              <TextInput
                style={styles.numericInput}
                keyboardType='numeric'
                defaultValue={totalPanier.toFixed(2)}
                onChangeText={(cb) => setCB(parseFloat(cb))}
                maxLength={10}
                selectTextOnFocus={true}
              />

              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Button mode="contained" style={[styles.button, styles.buttonConfirm]} onPress={() => { paiementCB() }}>
                  PAYER
                </Button>
                <Button mode="contained" style={[styles.button, styles.buttonClose]} onPress={() => { props.setModalVisible(!props.visible) }}>
                ANNULER
              </Button>
              </View>

            </View>
            :
            <View style={styles.modalView}>

              {totalTemp !== 0 ? <Text style={styles.modalText} >Paiement de <Text style={{ fontWeight: 600 }}>{cb}</Text> € par CB-CA {'\n'} Reste à payer de <Text style={{ fontWeight: 600 }}>{totalTemp} </Text>€</Text> :
                <Text style={styles.modalText}>D'accord avec le paiment suivant ? {'\n'}{'\n'} <Text style={{ fontWeight: 600 }}>{total}</Text> € en CB-CA</Text>
              }
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Button mode="contained" style={[styles.button, styles.buttonConfirm]} onPress={() => { props.setModalVisible(!props.visible), props.setTotalParent(totalTemp), paiementEspece() }}>
                  ESPÈCE
                </Button>
                <Button mode="contained" style={[styles.button, styles.buttonClose]} onPress={() => { props.setModalVisible(!props.visible), props.setTotalParent(totalTemp), paiementCheque() }}>
                  CHÈQUE
                </Button>
              </View>
            </View>
          }
        </View>
      )
    }
    else if (props.type === 'cheques') {
      return (
        <View style={styles.centeredView}>
          {showConfirm === false ?
            <View style={styles.modalView}>


              <Text style={styles.modalText}>Choisir un <Text style={{ fontWeight: 600 }}>MONTANT</Text> ou <Text style={{ fontWeight: 600 }}>PAYER {props.modalData.total} </Text>€ par Chèques</Text>

              <TextInput
                style={styles.numericInput}
                keyboardType='numeric'
                defaultValue={totalPanier.toFixed(2)}
                onChangeText={(cheques) => setCheques(parseFloat(cheques))}
                maxLength={10}
                selectTextOnFocus={true}
              />

              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Button mode="contained" style={[styles.button, styles.buttonConfirm]} onPress={() => { paiementCheque() }}>
                  PAYER
                </Button>
                <Button mode="contained" style={[styles.button, styles.buttonClose]} onPress={() => { props.setModalVisible(!props.visible) }}>
                ANNULER
              </Button>
              </View>

            </View>
            :
            <View style={styles.modalView}>

              {totalTemp !== 0 ? <Text style={styles.modalText} >Paiement de <Text style={{ fontWeight: 600 }}>{cheques}</Text> € par Chèques {'\n'} Reste à payer de <Text style={{ fontWeight: 600 }}>{totalTemp} </Text>€</Text> :
                <Text style={styles.modalText}>D'accord avec le paiment suivant ? {'\n'}{'\n'} <Text style={{ fontWeight: 600 }}>{total}</Text> € en Chèques</Text>
              }
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Button mode="contained" style={[styles.button, styles.buttonConfirm]} onPress={() => { props.setModalVisible(!props.visible), props.setTotalParent(totalTemp), paiementCB() }}>
                  CB
                </Button>
                <Button mode="contained" style={[styles.button, styles.buttonClose]} onPress={() => { props.setModalVisible(!props.visible), props.setTotalParent(totalTemp), paiementEspece() }}>
                  ESPÈCE
                </Button>
              </View>
            </View>
          }
        </View>
      )
    }
    else if (props.type === 'retour') {
      return (
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{ textAlign: 'center' }}>RETOUR ARTICLE: Saisissez le gencode de l'article:</Text>
            <TextInput
              style={[styles.numericInput, { width: '80%' }]}
              keyboardType='numeric'
              onChangeText={(retour) => { setRetourArticle(retour) }}
              value={retour}
              maxLength={13}
            />


            <View style={{ flex: 1, flexDirection: 'row' }}>
              <Pressable
                style={[styles.button, styles.buttonConfirm, { margin: 30 }]}
                onPress={() => { props.setModalVisible(!props.visible), retourArticle(retour) }}
              >
                <Text style={styles.textStyle}>OK</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose, { marginTop: 30 }]}
                onPress={() => props.setModalVisible(!props.visible)}
              >
                <Text style={styles.textStyle}>ANNULER</Text>
              </Pressable>
            </View>

          </View>
        </View>
      )
    }
    else if (showModal != false) {
      <searchArticleModal data={data} />
    }
    else if (props.type == 'divers') {
      return (
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{ textAlign: 'center' }}>Article divers: entrez son TITRE et son PRIX en EURO: </Text>
            <TextInput
              style={styles.numericInput}
              clearTextOnFocus={true}
              placeholder='TITRE'
              onChangeText={(divers) => { setArticleDivers(divers) }}
            />
            <TextInput
              style={styles.numericInput}
              keyboardType='numeric'
              clearTextOnFocus={true}
              placeholder='PRIX'
              onChangeText={(prixDivers) => { setPrixDivers(prixDivers) }}
              maxLength={10}

            />
            <TextInput
              style={styles.numericInput}
              keyboardType='numeric'
              clearTextOnFocus={true}
              placeholder='CODE TVA'
              onChangeText={(codeTVA) => { setCodeTVA(codeTVA) }}
              maxLength={10}
              onBlur={() => {
                if (codeTVA != 8 || codeTVA != 2 || codeTVA != 1 || codeTVA != 0) {
                  Alert.alert('Le code TVA entrer est incorrect, veuillez chosir une des ces valeurs: 8, 2, 1, 0 ')
                }
              }}
            />
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <Pressable
                style={[styles.button, styles.buttonConfirm]}
                onPress={() => { props.setModalVisible(!props.visible), createArticleDivers() }}
              >
                <Text style={styles.textStyle}>OK</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => props.setModalVisible(!props.visible)}
              >
                <Text style={styles.textStyle}>ANNULER</Text>
              </Pressable>
            </View>

          </View>
        </View>
      )
    }
    else if (props.type === 'especes') {
      return (
        <View style={styles.centeredView}>
          {showConfirm === false ?
            <View style={styles.modalView}>


              <Text style={styles.modalText}>Choisir un <Text style={{ fontWeight: 600 }}>MONTANT</Text> ou <Text style={{ fontWeight: 600 }}>PAYER {props.modalData.total.toFixed(2)} </Text>€ en Espèces</Text>

              <TextInput
                style={styles.numericInput}
                keyboardType='numeric'
                defaultValue={totalPanier.toFixed(2)}
                onChangeText={(espece) => setEspece(parseFloat(espece))}
                maxLength={10}
                selectTextOnFocus={true}
              />

              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Button mode="contained" style={[styles.button, styles.buttonConfirm]} onPress={() => { paiementEspece() }}>
                  PAYER
                </Button>
                <Button mode="contained" style={[styles.button, styles.buttonClose]} onPress={() => { props.setModalVisible(!props.visible) }}>
                ANNULER
              </Button>
              </View>

            </View>
            :
            <View style={styles.modalView}>

              {totalTemp !== 0 ? <Text style={styles.modalText} >Paiement de <Text style={{ fontWeight: 600 }}>{espece}</Text> € en ESPECES {'\n'} Reste à payer de <Text style={{ fontWeight: 600 }}>{totalTemp}</Text>€</Text> :
                <Text style={styles.modalText}>D'accord avec le paiment suivant ? {'\n'}{'\n'} <Text style={{ fontWeight: 600 }}>{total}</Text> € en ESPECE</Text>
              }
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Button mode="contained" style={[styles.button, styles.buttonConfirm]} onPress={() => { props.setModalVisible(!props.visible), props.setTotalParent(totalTemp), paiementCB() }}>
                  CB
                </Button>
                <Button mode="contained" style={[styles.button, styles.buttonClose]} onPress={() => { props.setModalVisible(!props.visible), props.setTotalParent(totalTemp), paiementCheque() }}>
                  Cheques
                </Button>
              </View>
            </View>
          }
        </View>
      )
    }
    else if (props.type === 'restaurant') {
      return (
        <View style={styles.centeredView}>
          {showConfirm === false ?
            <View style={styles.modalView}>


              <Text style={styles.modalText}>Entrez le montant du ticket restaurant : </Text>

              <TextInput
                style={styles.numericInput}
                keyboardType='numeric'
                defaultValue={totalPanier.toFixed(2)}
                onChangeText={(ticketRestaurant) => setTicketRestaurant(parseFloat(ticketRestaurant))}
                maxLength={10}
                selectTextOnFocus={true}
              />

              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Button mode="contained" style={[styles.button, styles.buttonConfirm]} onPress={() => { paiementRestaurant() }}>
                  PAYER
                </Button>
                <Button mode="contained" style={[styles.button, styles.buttonClose]} onPress={() => { props.setModalVisible(!props.visible) }}>
                ANNULER
              </Button>
              </View>

            </View>
            :

            <View style={styles.modalView}>

              {ticketRestaurant > totalPanier ?

                <View style={{justifyContent:'center'}}>
                  <Text style={[styles.modalText, { color: 'red' }]}>Attention, le total panier inférieur au montant du ticket restaurant ! </Text>
                  <Button mode="contained" style={[styles.button, styles.buttonClose,{backgroundColor:'#000000',margin:'auto'}]} onPress={() => { setShowConfirm(false) }}>
                RETOUR
              </Button>
                
                </View> : <>

                  {totalTemp !== 0 ? <View><Text style={styles.modalText} >Reste à payer de <Text style={{ fontWeight: 600 }}>{totalTemp.toFixed(2)}</Text>€</Text>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                      <Button mode="contained" style={[styles.button, styles.buttonConfirm]} onPress={() => { props.setModalVisible(!props.visible), props.setTotalParent(totalTemp), paiementCB() }}>
                        CB
                      </Button>
                      <Button mode="contained" style={[styles.button, styles.buttonClose, { marginRight: 10 }]} onPress={() => { props.setModalVisible(!props.visible), props.setTotalParent(totalTemp), paiementCheque() }}>
                        Cheques
                      </Button>
                      <Button mode="contained" style={[styles.button, styles.buttonClose]} onPress={() => { props.setModalVisible(!props.visible), props.setTotalParent(totalTemp), paiementEspece() }}>
                        Especes
                      </Button>

                    </View>
                  </View>
                    :
                    <View style={{justifyContent:'center'}}>
                      <Text style={styles.modalText}>D'accord avec le paiment suivant ? {'\n'}{'\n'} <Text style={{ fontWeight: 600 }}>{total.toFixed(2)}</Text> € en Ticket Restaurant ?</Text>

                      <Button mode="contained" style={[styles.button, styles.buttonConfirm,{margin:'auto'}]} onPress={() => { paiementRestaurant() }}>
                        PAYER
                      </Button>
                    </View>

                  }
                </>
              }
            </View>
          }
        </View >
      )
    }
  }

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.visible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          props.setModalVisible(!props.visible);
        }}
      >
        {renderModal()}
      </Modal>
    </View>
  );
};

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

export default paymentModal;