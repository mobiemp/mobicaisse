import React, { useEffect, useState } from "react";
import ModalSelector from 'react-native-modal-selector-searchable'



const SearchArticleModal = (props) => {


  const [searchInputValue,setSearchInputValue] = useState('')


    searchArticle = ()  => {
        try {
          fetch('http://caisse.serveravatartmp.com/caisse-backend/catalogue.php', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              search: searchInputValue,
            })
          })
            .then((response) => response.json())
            .then((responseJson) => {
              setData(responseJson)
              console.log(responseJson)
            })
        } catch (error) {
          console.error(error);
        } 
      }


    return (
      <ModalSelector
        data={data}
        initValue=""
        supportedOrientations={['landscape']}
        accessible={true}
        scrollViewAccessibilityLabel={'Scrollable options'}
        cancelButtonAccessibilityLabel={'Cancel Button'}
        onChange={(option) => { setSearchInputValue({ searchInputValue: option.label }) }}>

        <TextInput
          style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, height: 30 }}
          editable={false}
          placeholder="Select something yummy!"
          value={searchInputValue} />

      </ModalSelector>
    )
  }

  export default SearchArticleModal;