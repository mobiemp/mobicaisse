import 'react-native-gesture-handler';
import React, { useEffect, useState, useRef } from 'react';

import { StyleSheet, View, ScrollView, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text, Button, Appbar, DataTable, Searchbar, Divider } from 'react-native-paper'

import QuantitySelector from './Components/quantitySelector';
import RechercherArticle from './Components/searchBar'
import RemiseInput from './Components/remiseInput'


import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import caisseData from './caisse_data'
import useStatusServer from './useStatusServer';
import Header from './Components/header'
import ProduitList from './Components/produitList'
import CategorieListe from './Components/categorieList'

// Screens
import ClotureScreen from './Screen/ClotureScreen';
import LoadingScreen from './Screen/loadingScreen';
import useIsMounted from './useIsMonted'

//Modal
import PaymentModal from './Components/modal/paymentModal'
import NewArticleModal from './Components/modal/newArticleModal'
// import ProduitModal from './Components/modal/produitModal'

export default function App() {
  const [panierRefresh, setPanier] = useState({});
  const [qte, setQTE] = useState(0);
  const [remise, setRemise] = useState(0)
  const [remiseEuro,setRemiseEuro] = useState([{index:null,value:0}])
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const [typePaiement, setTypePaiement] = useState('');
  const [moneyToReturn, setMoneyToReturn] = useState({ reponse: false, montant: 0 })
  const [pu_euro, setPuEuro] = useState(0)
  // const [isLoading, setLoading] = useState(true);
  const [produitFilter, setProduitFilter] = useState({})
  const [session, setSession] = useState(1)
  const focusDiv = useRef();

  //Modal vue
  const [modalVisible, setModalVisible] = useState(false);
  const [modalNewArticle,setModalNewArticle] = useState(false)
  const [modalConfirmTotal,setConfirmTotalModal] = useState(false)
  // const [modalRemise, setModalRemise] = useState(false)
  // const [produit, setProduit] = useState({})

  const [totalCaddie, setTotalCaddie] = useState(0)
  const [caisse, setCaisseData] = useState({})
  const [status,setStatus] = useState(404);
  // const isMounted = useIsMounted();

  const getCaisseData = async () => {
    const data = await caisseData();
    if (data) {
      setCaisseData({ data })
    }
  }

  // Verifie si le serveur PHP local fonctionne.

  const isAvailable = async () => {
    const timeout = new Promise((resolve, reject) => {
      setTimeout(reject, 5000, 'Votre demande est expiré.');
  });

    const request = fetch('http://localhost/caisse-backend/synchronisation.php');

    // return Promise
    //   .race([timeout, request])
    //   .then(response => console.log('Connecté'))
    //   .catch(error => alert('Connexion expiré. Vérifiez si wamp est en cours d\'exécution. '));
    try {
      const response = await Promise
          .race([timeout, request]);
          console.log('connecté')
      return true;
    }
    catch (error) {
      console.log('non-connecté')
      alert('Échec de la connexion au serveur. Vérifiez votre connexion internet ou que le serveur local ne soit pas hors ligne.');
      location.reload();
    }
  }

    // Mise a jour des données catalogue depuis le serveur toutes les 3 minutes

  const updateCatalogue = () => {

    fetch('http://localhost/caisse-backend/synchronisation.php?action=update', {method: "GET"})
     .then((response) => response.json())
     .then((responseData) =>
     {
      //  console.log(responseData)
      //  if(responseData.result === 1){
      //    console.log(responseData.message)
      //  }
      //  else if(responseData.result === 0){  
      //    console.log(responseData.message);
      //  }
     })
     .catch((error) => {
         console.error(error);
     });
   
   }

 // Vérifie si le serveur est en cour d'éxécution

  const checkServerStatus = () => {

    fetch('http://localhost/caisse-backend/synchronisation.php', {method: "GET"})
     .then((response) => response.json())
     .then((responseData) =>
     {
       if(responseData.response === 200){
        setStatus(200)
       }
       else if(responseData.response === 404){
         setStatus(404)
       }
     })
     .catch((error) => {
         console.error(error);
     });
   
   }






  // Contenu du caddie
  const getPanier = async () => {
    try {
      const response = await fetch('http://localhost/caisse-backend/ajoutpanier.php');
      const json = await response.json();
      setPanier(json);
    } catch (error) {
      console.error("ERREUR");
    }
  };

  const totalPanier = () => {
    var sum = 0;
    // console.log(panierRefresh, typeof panierRefresh)
    if (panierRefresh && typeof panierRefresh !== 'undefined') {
      if (Object.keys(panierRefresh).length != 0) {
        panierRefresh.forEach(function (item) {
          // if (item.session === session) {
            sum += remise !== 0 ? (item.pu_euro - (item.pu_euro * remise / 100)) * item.qte : item.pu_euro * item.qte
          // }
        })
      }
    }
    return sum
  }

  const onChangeSearch = query => setSearchQuery(query);
  

  const handleSearch = () => {
    try {
      fetch('http://localhost/caisse-backend/searchProduit.php', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          search: searchQuery,
          session: session,
        })
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson.json)
          if (responseJson.result === 0) {
            setModalNewArticle(true)
          }
          setPanier(responseJson.json)
          setSearchQuery('')
          setMoneyToReturn({ reponse: false, montant: 0 })
        })
    }
    catch (error) {
      console.error(error);
    }
  }



  const handleRemise = (index, ref) => {
    fetch('http://localhost/caisse-backend/panier.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // montant:panierRefresh[index].remise,
        ajoutRemise: remise,
        ref: ref,
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson.response == 1){
          console.log(index,remise)
          setRemise(panierRefresh[index].remise = remise);
        }
      })
    })

    var prix_unique = panierRefresh[index].pu_euro
    panierRefresh[index].pu_euro = prix_unique - (prix_unique * (remise / 100))

  }

  const deleteArticle = (num) => {
    try {
      fetch('http://localhost/caisse-backend/panier.php', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deleteArticle: num,
        })
      }).then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.response === 0) {
            setPanier({});
            console.log(panierRefresh)
            setTotalCaddie(0);
          }
          else {
            setPanier(responseJson)
          }
        })
    }
    catch (error) {
      console.error(error);
    }
  }

  clearPanier = (data) => {
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
          setTotalCaddie(0)
        }
      })
  }
  const printTotalCaisse = () => {

    fetch('http://localhost/caisse-backend/print_total_caisse.php', {method: "GET"})
     .then((response) => response.json())
     .then((responseData) =>
     {
       console.log(responseData)
       if(responseData.response === 1){
        alert('Ticket du total de caisse généré');
       }
       else{
         alert('Aucune vente trouvé!')
       }
     })
     .catch((error) => {
         console.error(error);
     });
   
   }

  // Affiche le panier du client suivant
  const clientSuivant = () => {
    setSession(prevState => prevState + 1)
  }

  const clientPrecedent = () => {
    setSession(prevState => prevState - 1)
  }



  useEffect(() => {
    totalPanier()
    getPanier();
    getCaisseData()
    // isAvailable();
    // checkServerStatus();
    // updateCatalogue()
    // setInterval(isAvailable(), 5000);
    setInterval(() => {
      checkServerStatus();
    }, 5000);

    setInterval(() => {
      updateCatalogue();
    }, 300000);

    if (focusDiv.current) focusDiv.current.focus();
  }, [focusDiv, session]);


  useEffect(() => {
    localStorage.setItem('session', session)

    console.log(localStorage.getItem('session'))
  }, [session]);



  function CaisseScreen({ navigation }) {
    return (
      <View style={styles.container}>
        <View style={{ width: "7%", height: '100%', zIndex: 9999, backgroundColor: '#303456' }}>
          <View style={styles.leftIcon}>
            <Icon name="home" size={30} color="#FFFFFF" style={styles.iconMenu} onPress={() => { navigation.navigate('Caisse') }} />
          </View>
          <View style={styles.leftIcon}>
            <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => { navigation.navigate('Cloture') }} >
              <Icon name="shopping-cart" size={30} color="#FFFFFF" style={styles.iconMenu} />
              <Text style={{ color: '#FFFFFF', textAlign: 'center' }}>Calcul des caisses</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[{ width: '60%', margin: 25, alignItems: 'center' }]}>
          <Searchbar
            style={styles.search}
            placeholder="Scanner un article..."
            onChangeText={onChangeSearch}
            value={searchQuery}
            autoFocus={true}
            blurOnSubmit={false}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          {/* <Produits passProduitData={setPanier} qte={qte} setQTE={setQTE} /> */}
          {moneyToReturn.reponse === false ?
            <ScrollView style={[styles.shadowProp, styles.cardBox, { backgroundColor: '#F2F7FB', width: '100%', height: '70%' }]} >
              <Appbar style={[styles.bottom, { width: '100%' }]}>
                <Appbar.Header style={{ backgroundColor: "steelblue", elevation: 0, justifyContent: 'space-between', width: '100%' }}>
                  <Appbar.Content title={"CADDIE " + session} titleStyle={{ color: "#ffffff", textAlign: 'center' }} />
                </Appbar.Header>
              </Appbar>
              <Button mode="contained" style={{ width: 200, position: 'absolute', right: 230, top: 10, zIndex: 9999, display: session === 1 ? 'none' : 'block' }} onPress={() => { clientPrecedent() }}>
                Client Précédent
              </Button>
              <Button mode="contained" style={{ width: 200, position: 'absolute', right: 15, top: 10, zIndex: 9999 }} onPress={() => { clientSuivant() }}>
                Client Suivant
              </Button>
              <DataTable style={styles.containerAjout}>
                <DataTable.Header>
                  <DataTable.Title style={{ flex: 1 }}>Désignation</DataTable.Title>
                  <DataTable.Title numeric style={{ flex: 0.5 }}>QTÉ</DataTable.Title>
                  <DataTable.Title numeric style={{ flex: 0.5 }}>PU €</DataTable.Title>
                  <DataTable.Title numeric style={{ flex: 0.5 }}>Montant (€)</DataTable.Title>
                  <DataTable.Title numeric style={{ flex: 0.5 }}>Remise (%)</DataTable.Title>
                  <DataTable.Title numeric style={{ flex: 0.5 }}>Remise (€)</DataTable.Title>
                </DataTable.Header>
                {panierRefresh && Object.keys(panierRefresh).length !== 0  ? panierRefresh.map((item, index) => {
                  if (session === parseInt(item.session)) {
                    return (
                      <DataTable.Row key={index} style={styles.card}>
                        <><DataTable.Cell style={[styles.tableRow, { flex: 1 }]}>{item.titre}
                          <Icon name="trash" size={15} color="red" style={styles.iconPoubelle} onPress={() => deleteArticle(item.num)} />
                        </DataTable.Cell>
                        <DataTable.Cell style={{ justifyContent: 'flex-end', flex: 0.5 }}>
                            <TextInput
                              style={styles.quantite}
                              mode='outlined'
                              name="itemQTE"
                              onChangeText={(qte) => setQTE(panierRefresh[index].qte = qte)}
                              value={item.qte}
                              placeholder="0"
                              blurOnSubmit={false}
                              underlineColorAndroid={"transparent"} />
                          </DataTable.Cell>
                          <DataTable.Cell numeric style={[styles.tableRow, { flex: 0.5 }]}>
                            {pu_euro === 0 ? parseFloat(item.pu_euro).toFixed(2) : parseFloat(pu_euro).toFixed(2)} €
                            
                            </DataTable.Cell>
                          <DataTable.Cell numeric style={[styles.tableRow, { flex: 0.5 }]}>
                            {pu_euro === 0 ? parseFloat(item.pu_euro * item.qte).toFixed(2) : parseFloat(pu_euro * item.qte).toFixed(2)} €
                            </DataTable.Cell>
                          <DataTable.Cell numeric style={[styles.tableRow, { flex: 0.5 }]}>
                            <RemiseInput panier={panierRefresh} setRemise={setRemise} index={index} 
                            reference={item.ref} remise={remise} remisePanier={item.remise} setRemiseEuro={setRemiseEuro} remiseEuro={remiseEuro} />
                            {/* <TextInput
                              style={styles.quantite}
                              mode='outlined'
                              name="itemRemise"
                              onChangeText={newRemise => setRemise(newRemise)}
                              blurOnSubmit={false}
                              // onKeyPress={(e) => e.key === 'Enter' && handleRemise(index, item.ref)}
                              value={remise}
                              placeholder="0"
                              underlineColorAndroid={"transparent"} /> % */}
                          </DataTable.Cell>
                          <DataTable.Cell numeric style={[styles.tableRow, { flex: 0.5 }]}> 
                            
                            {/* {parseFloat(panierRefresh[index].pu_euro * panierRefresh[index].qte * panierRefresh[index].remise / 100).toFixed(2)} € */}
                            {}
                            {remiseEuro.index === item.index ? remiseEuro.value : 0.00 } 0.00 € 
                            
                          </DataTable.Cell></>
                      </DataTable.Row>
                    );
                  }
                }
                ) : <View style={{ justifyContent: 'center', alignItems: 'center' }}></View>}
              </DataTable>

            </ScrollView>
            :
            <View style={[styles.shadowProp, styles.cardBox, { backgroundColor: '#F2F7FB', width: '100%', height: '70%', justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={{ fontFamily: 'Tahoma', fontSize: 40, color: 'steelblue', fontWeight: 600 }}>A RENDRE : {moneyToReturn.montant} €</Text>
            </View>
          }
          <PaymentModal setModalVisible={setModalVisible} visible={modalVisible} passDataToModal={setPanier}  modalData={{ 'total': totalCaddie == 0 ? totalPanier() : totalCaddie, 'panier': panierRefresh }} setTotalParent={setTotalCaddie} setMoneyToReturn={setMoneyToReturn} type={typePaiement} idCaisse={typeof caisse.data !== 'undefined' ? caisse.data.id_caisse : 'Inconnu'} />
          <NewArticleModal setModalNewArticle={setModalNewArticle} modalNewArticle={modalNewArticle} gencode={searchQuery} />
        </View>
        <View style={{ width: '25%', marginRight: 2, alignItems: 'start', padding: 50 }}>
          <Text style={{ fontFamily: 'Tahoma', fontSize: 22, fontWeight: 700, margin: 15 }}>TOTAL A PAYER</Text>
          <View style={[styles.shadowProp, styles.totalCaisse]}>
            <Text style={{ padding: 15, fontFamily: 'Tahoma', color: '#FFFFFF', fontSize: 32, textAlign: 'end' }}><Text style={{ fontSize: 56, fontWeight: 700, color: '#FFFFFF', fontFamily: 'Tahoma', color: '#FFFFFF' }}>{totalCaddie == 0 ? totalPanier().toFixed(2).split('.')[0] : totalCaddie.toFixed(2).split('.')[0]}</Text>€{totalCaddie == 0 ? totalPanier().toFixed(2).split('.')[1] : totalCaddie.toFixed(2).split('.')[1]}</Text>
          </View>

          {/* BOUTON PRODUIT DIVERS & VARIABLE */}
          <View style={[styles.touches, styles.shadowProp, { marginTop: 30 }]}>
            {/* <Subheading style={{ fontWeight: 600, marginBottom: 15 }}>Méthode de Paiement</Subheading> */}
            <SafeAreaView style={{ flex: 1, flexDirection: "row", flexWrap: "wrap", justifyContent: 'space-between', marginBottom: 30 }}>
              <View style={styles.btn}>
                <Button icon="cash" mode="contained" style={styles.btnAction} onPress={() => { setModalVisible(true), setTypePaiement('especes') }}>
                  Espèce
                </Button>
              </View>
              <View style={styles.btn}>
                <Button icon="credit-card" mode="contained" style={styles.btnAction} onPress={() => { setModalVisible(true), setTypePaiement('cb') }}>
                  CB
                </Button>
              </View>
            </SafeAreaView >
            <SafeAreaView style={{ flex: 1, flexDirection: "row", flexWrap: "wrap", justifyContent: 'space-between', marginBottom: 30 }} >
              <View style={styles.btn}>
                <Button icon="bank" mode="contained" style={styles.btnAction} onPress={() => { setModalVisible(true), setTypePaiement('cheques') }}>
                  Chèques
                </Button>
              </View>
              <View style={styles.btn}>
                <Button mode="contained" style={styles.btnAction} onPress={() => { setModalVisible(true), setTypePaiement('retour') }}>
                  Retour Article
                </Button>
              </View>
            </SafeAreaView>
            <SafeAreaView style={{ flex: 1, flexDirection: "row", flexWrap: "wrap", justifyContent: 'space-between', marginBottom: 30 }}>
              <View style={styles.btn}>
                <Button mode="contained" style={styles.btnAction} onPress={() => { setModalVisible(true), setTypePaiement('divers') }}>
                  Divers
                </Button>
              </View>
              <View style={styles.btn}>
                <Button mode="contained" style={styles.btnAction} onPress={() => { setModalVisible(true), setTypePaiement('clear') }}>
                  Vider
                </Button>
              </View>
            </SafeAreaView>
            <SafeAreaView style={{ flex: 1, flexDirection: "row", flexWrap: "wrap", justifyContent: 'space-between' }}>
              <View style={styles.btn}>
                <Button mode="contained" style={styles.btnAction} onPress={() => { setModalVisible(true)  }}>
                  Promo
                </Button>
              </View>
              <View style={styles.btn}>
                <Button mode="contained" style={styles.btnAction} onPress={() => { printTotalCaisse()  }}>
                  Total Caisse
                </Button>
              </View>
            </SafeAreaView>
          </View>
        </View>
      </View>
    )
  }


  // Caisse type 2

  function Caisse2Screen({ navigation }) {
    return (
      <View style={styles.containerCaisse2}>

        <View style={{ width: "7%", height: '100%', zIndex: 9999, backgroundColor: '#03050C' }}>
          <View style={styles.leftIcon}>
            <Icon name="home" size={30} color="#FFFFFF" style={styles.iconMenu} onPress={() => { navigation.navigate('Caisse') }} />
          </View>
          <View style={styles.leftIcon}>
            <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => { navigation.navigate('Cloture') }} >
              <Icon name="shopping-cart" size={30} color="#FFFFFF" style={styles.iconMenu} />
              <Text style={{ color: '#FFFFFF', textAlign: 'center' }}>Calcul des caisses</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[{ width: '55%', height: '95%', paddingBottom: 10, paddingRight: 10, marginLeft: '2%' }]} >
          <View>
            {/* {<Searchbar
              style={styles.searchCaisse2}
              placeholder="Rechercher un article..."
              onChangeText={onChangeSearch}
              value={searchQuery}
              ref={focusDiv}
              blurOnSubmit={true}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchArticle(e)}
            />} */}
            <RechercherArticle setProduitFilter={setProduitFilter} />
          </View>
          <View style={{ marginBottom: 20 }}>
            <CategorieListe setProduitFilter={setProduitFilter} />
          </View>
          <ScrollView style={[styles.shadowProp, styles.touchesProduit, { borderRadius: 0 }]}>
            <View>
              <ProduitList passProduitData={setPanier} produitFilter={produitFilter} moneyToReturn={setMoneyToReturn} />
            </View>
          </ScrollView>
        </View>
        {/* Les modals de paiements */}
        <PaymentModal setModalVisible={setModalVisible} visible={modalVisible} passDataToModal={setPanier} modalData={{ 'total': totalCaddie == 0 ? totalPanier() : totalCaddie, 'panier': panierRefresh }} setTotalParent={setTotalCaddie} setMoneyToReturn={setMoneyToReturn} type={typePaiement} idCaisse={typeof caisse.data !== 'undefined' ? caisse.data.id_caisse : 'Inconnu'} />
        {/* <ProduitModal setModalVisible={setModalRemise} visible={modalRemise} remise={handleRemise} data={produit} /> */}
        <View style={{ width: '35%', marginRight: 2, alignItems: 'start', paddingRight: 15, height: '100%' }}>
          <View style={[styles.touchesCaisse2, { marginTop: '5%', marginBottom: 10 }]}>
            <SafeAreaView style={{ flex: 1, flexDirection: "row", flexWrap: "wrap", justifyContent: 'space-between', marginBottom: 5, paddingLeft: 10, paddingRight: 10, paddingTop: 5 }}>
              <View style={styles.btnCaisse2}>
                <Button mode="contained" style={styles.btnActionCaisse} onPress={() => { setModalVisible(true), setTypePaiement('especes') }}>
                  Espèce
                </Button>
              </View>
              <View style={styles.btnCaisse2}>
                <Button mode="contained" style={styles.btnActionCaisse} onPress={() => { setModalVisible(true), setTypePaiement('cb') }}>
                  CB
                </Button>
              </View>
              <View style={styles.btnCaisse2}>
                <Button mode="contained" style={styles.btnActionCaisse} onPress={() => { setModalVisible(true), setTypePaiement('cheques') }}>
                  Chèques
                </Button>
              </View>
            </SafeAreaView >
            <SafeAreaView style={{ flex: 1, flexDirection: "row", flexWrap: "wrap", justifyContent: 'space-between', marginBottom: 5, paddingLeft: 10, paddingRight: 10 }} >

              <View style={styles.btnCaisse2}>
                <Button mode="contained" style={styles.btnActionCaisse} onPress={() => { setModalVisible(true), setTypePaiement('retour') }}>
                  Retour {'\n'} Article
                </Button>
              </View>
              <View style={styles.btnCaisse2}>
                <Button mode="contained" style={styles.btnActionCaisse} onPress={() => { setModalVisible(true), setTypePaiement('restaurant') }}>
                  Ticket{'\n'}Restaurant
                </Button>
              </View>
              <View style={styles.btnCaisse2}>
                <Button mode="contained" style={styles.btnActionCaisse} onPress={() => { clearPanier({}) }}>
                  Vider {'\n'} panier
                </Button>
              </View>
            </SafeAreaView>
          </View>
          {/* BOUTON PRODUIT DIVERS & VARIABLE */}
          {moneyToReturn.reponse === false ?
            <ScrollView style={[styles.touches, styles.shadowProp, { maxHeight: '60%' }]}>
              <Text style={{ fontSize: 18, fontFamily: 'Tahoma', paddingTop: 15, paddingLeft: 5 }}>Panier</Text>
              <Divider style={{ marginTop: 10 }} />


              <DataTable.Header>
                <DataTable.Title style={{ flex: 0.8 }}>Désignation / PU €</DataTable.Title>
                <DataTable.Title numeric style={{ flex: 0.5, justifyContent: 'center' }}>QTÉ</DataTable.Title>
                <DataTable.Title numeric style={{ flex: 0.5 }}>Remise (%)</DataTable.Title>
                <DataTable.Title numeric style={{ flex: 0.5 }}>Remise (€)</DataTable.Title>
                <DataTable.Title numeric style={{ flex: 0.5 }}>Montant (€)</DataTable.Title>
              </DataTable.Header>
              {Object.keys(panierRefresh).length !== 0 && panierRefresh !== null ? panierRefresh.map((item, index) => {
                return (
                  // <TouchableOpacity  onPress={() => { setProduit({ item, index }), setModalRemise(true) }}>
                  <DataTable.Row key={index} style={styles.card} >
                    {/* TITRE */}
                    <DataTable.Cell style={[styles.tableRow, { flex: 1, textTransform: 'capitalize' }]}><Text style={{ fontSize: 16 }}>{item.titre.toLowerCase()}</Text>
                      <Icon name="trash" size={15} color="red" style={styles.iconPoubelle} onPress={() => deleteArticle(item.num)} />
                      {'\n'}
                      <Text style={{ marginTop: 5 }}><Text style={{ fontWeight: 'bold' }}> Prix: </Text>{parseFloat(panierRefresh[index].pu_euro).toFixed(2)} €</Text>
                    </DataTable.Cell>
                    {/* PRIX UNIQUE */}
                    <DataTable.Cell style={{ justifyContent: 'flex-start', flex: 0.5 }}>
                      <TextInput
                        style={styles.quantite}
                        mode='outlined'
                        name="itemQTE"
                        onChangeText={(qte) => setQTE(panierRefresh[index].qte = qte)}
                        value={item.qte}
                        placeholder="0"
                        underlineColorAndroid={"transparent"}
                      />
                    </DataTable.Cell>
                    {/* MONTANT */}
                    <DataTable.Cell numeric style={[styles.tableRow, { flex: 0.5, justifyContent: 'center' }]}>
                      <TextInput
                        style={styles.quantite}
                        mode='outlined'
                        name="itemRemise"
                        onChangeText={(remise) => handleRemise(remise, index, item.ref)}
                        value={item.remise}
                        placeholder="0"
                        underlineColorAndroid={"transparent"}
                      /> %
                    </DataTable.Cell>
                    <DataTable.Cell numeric style={[styles.tableRow, { flex: 0.5 }]}> {parseFloat(panierRefresh[index].pu_euro * item.qte * panierRefresh[index].remise / 100).toFixed(2)} €</DataTable.Cell>
                    <DataTable.Cell numeric style={[styles.tableRow, { flex: 0.5 }]}>{parseFloat(panierRefresh[index].pu_euro * item.qte).toFixed(2)} €</DataTable.Cell>
                  </DataTable.Row>
                  // </TouchableOpacity>
                );
              }) : <View style={{ justifyContent: 'center', alignItems: 'center' }}></View>
              }

            </ScrollView>
            :
            <View style={[styles.shadowProp, styles.cardBox, { backgroundColor: '#F2F7FB', width: '100%', height: '70%', justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={{ fontFamily: 'Tahoma', fontSize: 40, color: 'steelblue', fontWeight: 600 }}>A RENDRE : {moneyToReturn.montant} €</Text>
            </View>
          }
          {/* <Subheading style={{ fontWeight: 600, marginBottom: 15 }}>Méthode de Paiement</Subheading> */}


          <View style={{ height: '10%', width: '100%', alignContent: 'flex-end', marginTop: 10, alignItems: 'flex-end' }}>
            <Text style={{ fontFamily: 'Tahoma', fontSize: 20, fontWeight: 700, color: '#000000' }}>TOTAL A PAYER</Text>
            <View style={[styles.shadowProp, styles.totalCaisse, { width: '70%' }]}>
              <Text style={{ padding: 15, fontFamily: 'Tahoma', color: '#FFFFFF', fontSize: 32, textAlign: 'end' }}><Text style={{ fontSize: 56, fontWeight: 700, color: '#FFFFFF', fontFamily: 'Tahoma', color: '#FFFFFF' }}>{totalCaddie == 0 ? totalPanier().toFixed(2).split('.')[0] : totalCaddie.toFixed(2).split('.')[0]}</Text>€{totalCaddie == 0 ? totalPanier().toFixed(2).split('.')[1] : totalCaddie.toFixed(2).split('.')[1]}</Text>
            </View>
          </View>
        </View>

      </View>
    );
  }

  const Stack = createNativeStackNavigator();


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Caisse">
        {(typeof caisse.data === 'undefined' ?
          <Stack.Screen name="Chargement" component={LoadingScreen} />
          :
          (caisse.data.type_caisse == 1 ?
            <Stack.Screen name={"Caisse"} component={CaisseScreen} totalCaddie={totalCaddie} options={{ headerShown: false }} />
            :
            <Stack.Screen name={"Caisse 2"} component={Caisse2Screen} totalCaddie={totalCaddie} options={{ headerShown: false }} />

          ))}
        <Stack.Screen name="Cloture" component={ClotureScreen} />
      </Stack.Navigator>
      <Header statut={status} duration={1000} />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  containerCaisse2: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: 'space-between',
    backgroundColor: '#f8f8f8',

  },
  commandes: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    paddingTop: 5,
    paddingBottom: 5
  },

  shadowProp: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },
  btn: {
    width: '49%',
  },
  btnCaisse2: {
    width: '30%',
  },
  btnAction: {
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: 'steelblue'
  },
  btnActionCaisse: {
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 15,
    backgroundColor: '#159335'
  },
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: 'space-between',
    backgroundColor: '#F8F8F8',

  },
  totalCaisse: {
    width: '100%',
    height: 100,
    borderWidth: 3,
    borderRadius: 10,
    borderColor: '#FFFFFF',
    backgroundColor: 'darkblue',
  },
  touches: {
    borderRadius: 10,
    width: '100%',
    borderWidth: 1,
    padding: 10,
    borderColor: '#159335',
    backgroundColor: "#FFFFFF"
  },
  touchesProduit: {
    borderRadius: 10,
    width: '100%',
    // borderWidth: 1,
    padding: 10,
    borderColor: '#159335',
    backgroundColor: "#FFFFFF",
    margin: 'auto'
  },
  touchesCaisse2: {
    borderRadius: 10,
    width: '100%',
    padding: 5,
  },
  caddie: {
    flex: 1,
    width: '100%',
    margin: 5,
    justifyContent: 'flex-end',
    position: 'absolute',
    bottom: '3%',
  },
  bottom: {
    backgroundColor: "steelblue",
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,

  },
  search: {
    margin: 15,
    width: '100%',
  },
  searchCaisse2: {
    marginTop: 15,
    marginBottom: 15
  },
  containerAjout: {
    paddingTop: 75,
    paddingLeft: 10,
    paddingRight: 10
  },
  tableRow: {
    textAlign: 'center',
    fontFamily: 'Tahoma',
  },
  iconPoubelle: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 10
  },
  iconMenu: {
    padding: 15
  },
  paragraph: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginBottom: 5
  },
  cardBox: {
    backgroundColor: 'white',
    borderRadius: 8,
    // width: '90%',
    marginVertical: 10,
  },
  titre: {
    fontWeight: "normal",
    fontSize: 17,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#000",
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 15
  },
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
  buttonsAdd: {
    flex: 1,
    flexDirection: "row",
    justifyContent: 'center',

  },
  total: {
    elevation: 2,
    padding: 10,
  },
  box: {
    width: "30%",
    height: 80,
    margin: 1,
    elevation: 20,
    shadowColor: '#52006A',
    borderRadius: 8,
    paddingVertical: 35,
    paddingHorizontal: 20,
  },
  boxTitle: {
    textAlign: 'center',
    color: '#ffffff'
    // textTransform: 'uppercase',
  },
  leftIcon: {
    padding: 10,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  }
});
