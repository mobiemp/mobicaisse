import { FlatList, View, StyleSheet, ScrollView } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { Chip } from 'react-native-paper'

import useIsMounted from '../useIsMonted'

const categorieList = (props) => {

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const isMounted = useIsMounted();


  const getCategories = async () => {
    try {
      const response = await fetch('http://localhost/caisse-backend/categorie.php?' + new URLSearchParams({
        action: 'categorieListe',
      }))
      const json = await response.json();
      setData(json.categories);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  const getCategoryArticle = (categoryID) => {
    return fetch('http://localhost/caisse-backend/categorie.php?' + new URLSearchParams({
      action: 'byCategory',
      categorieID: categoryID
    }))
      .then((response) => response.json())
      .then((json) => {
        props.setProduitFilter(json.produits)
      })
      .catch((error) => {
        console.error(error);
      });
  };


  useEffect(() => {
    if (isMounted.current) {
      getCategories();
      return () => {
        setData({});
        isMounted.current = false
      };
    }
  }, [isMounted]);

  return (

    <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 10 }}>
      <Chip style={styles.chip} onPress={() => props.setProduitFilter({})}>Tout voir</Chip>
      <FlatList
        numColumns={4}
        data={data}
        keyExtractor={(item, index) => String(index)}
        renderItem={({ item }) => {
          return (
            <Chip style={styles.chip} onPress={() => getCategoryArticle(item.id_categorie)}>{item.nomcategorie}</Chip>
          );
        }}
      />
    </View>

  )
}

const styles = StyleSheet.create({
  chip: {
    height: 35,
    marginRight: 15
  },
});

export default categorieList;
