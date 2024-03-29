import React, { useEffect } from "react";
import { SafeAreaView, StyleSheet, TextInput } from "react-native";
import { Searchbar } from 'react-native-paper';

const BarcodeInput = (props) => {
  const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = query => setSearchQuery(query);
    const clearInput = React.useCallback(()=> onChangeSearch(''), []);
    const barcodeInputRef = React.useRef();
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
            session: props.session,
          })
        })
          .then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson)
            if (responseJson.result === 0) {
              props.setModalNewArticle(true)
            }
            if(responseJson.result === 2){
              setSearchQuery('')
              // barcodeInputRef.current.focus();
              alert('ERREUR DE SAISIE.')
            }
            else{
              props.setPanier(responseJson.json)
              setSearchQuery('')
              props.setMoneyToReturn({ reponse: false, montant: 0 })
            }
            
          })
      }
      catch (error) {
        console.error(error);
      }
    }
  
    useEffect(() => {
      barcodeInputRef.current = false;
    }, []);

  return (
    // <SafeAreaView>
      <Searchbar
        style={styles.search}
        onChangeText={onChangeSearch}
        value={searchQuery}
        autoFocus={true}
        placeholder="Scanner un article..."
        onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
        ref={barcodeInputRef}
      />
    // </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  search: {
    margin: 15,
    width: '100%',
  },
});

export default BarcodeInput;