import React, {useState} from 'react';
import { Searchbar,Button } from 'react-native-paper';
import {StyleSheet} from 'react-native'

const RechercherArticle = (props) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isLoading, setLoading] = useState(true);


  const onChangeSearch = query => setSearchQuery(query);

  const handleSearchArticle = (e) => {
    try {
      fetch('http://caisse.serveravatartmp.com/caisse-backend/searchProduit.php', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          search: searchQuery,
        })
      })
        .then((response) => response.json())
        .then((responseJson) => {
          props.setProduitFilter(responseJson)
          
        })
    }
    catch (error) {
      console.error(error);
    }
  }

  return (
     <Searchbar
              style={styles.searchCaisse2}
              placeholder="Rechercher un article..."
              onChangeText={onChangeSearch}
              value={searchQuery}
              blurOnSubmit={true}
              // onKeyPress={(e) => e.key === 'Enter' && handleSearchArticle(e)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchArticle(e)}
            />
  );
};
const styles = StyleSheet.create({
  searchCaisse2: {
    marginTop: 15,
    marginBottom: 15

    }
});
export default RechercherArticle;