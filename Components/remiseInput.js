import React, {useState,useEffect} from 'react';
import { Button } from 'react-native-paper';
import {StyleSheet,TextInput} from 'react-native'

const remiseInput = (props) => {
    
    const [remise,setRemise] = useState(props.remisePanier)
    const onChangeRemise = remise => setRemise(remise);

    

    const handleRemise = (index, ref) => {
        try {
            fetch('http://localhost/caisse-backend/panier.php', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // montant:panierRefresh[index].remise,
                ajoutRemise: remise,
                refRemise: ref,
            })
        })
        .then((response) => response.text())
        .then((responseJson) => {
            setRemise(responseJson)
            props.panier[index].remise = remise
            props.setRemiseEuro(current => [...current, {index: index, value: remise}]);
            
        })
    }
    catch (error) {
        console.error(error);
    }
}

useEffect(()=>{
    localStorage.setItem('remise', remise)
},[remise]);


return (
    <TextInput
    style={styles.quantite}
    mode='outlined'
    name="itemRemise"
    onChangeText={onChangeRemise}
    blurOnSubmit={false}
    onKeyPress={(e) => e.key === 'Enter' && handleRemise(props.index, props.reference)}
    value={remise}
    placeholder="0"
    underlineColorAndroid={"transparent"} /> 
    
    );
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

export default remiseInput;