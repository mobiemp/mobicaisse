import React, {useState,useEffect} from 'react';
import { DataTable } from 'react-native-paper';
import {StyleSheet,TextInput} from 'react-native'
import panier from '../Schema/panier';

const remiseInput = (props) => {
    
    const [remise,setRemise] = useState(props.remisePanier)
    const [qte, setQTE] = useState(props.qte)
    const [remiseEuro,setRemiseEuro] = useState([{index:null,value:0}])
    const [montantTotal,setMontantTotal] = useState(props.panier[props.index].pu_euro * props.panier[props.index].qte)
    const [puEuro,setPuEuro] = useState(props.panier[props.index].pu_euro)
    const onChangeRemise = remise => setRemise(remise);
    const onChangeQte = qte => setQTE(qte);
    
    
    // CHAMPS REMISE
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
        .then((response) => response.json())
        .then((responseJson) => {
            setRemise(responseJson)
            props.panier[index].remise = remise
            var montant_remise = (props.panier[index].pu_euro * props.panier[index].qte) * (remise/100)
            setRemiseEuro(current => [...current, {index: index, value: montant_remise}]);
            setPuEuro(props.panier[index].pu_euro  - (props.panier[index].pu_euro * (remise/100)))
            setMontantTotal(props.panier[index].pu_euro * props.panier[index].qte  - (props.panier[index].pu_euro * props.panier[index].qte  * (remise/100)))
            
        })
    }
    catch (error) {
        console.error(error);
    }
}

// CHAMPS QUANTITE
const handleQte = (index, ref) => {
    try {
        fetch('http://localhost/caisse-backend/panier.php', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            // montant:panierRefresh[index].remise,
            updateQTE: qte,
            refQte: ref,
        })
    })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log(responseJson)
        setQTE(responseJson)
        props.panier[index].qte = qte
        setMontantTotal(0)
        setMontantTotal(props.panier[index].pu_euro * qte)
    })
    }
    catch (error) {
        console.error(error);
    }
}

// useEffect(()=>{
//     localStorage.setItem('remise', remise)
// },[remise]);


return (
    <>
    <DataTable.Cell style={{ justifyContent: 'flex-end', flex: 0.5 }}>
        <TextInput
        style={styles.quantite}
        mode='outlined'
        name="itemQTE"
        onChangeText={onChangeQte}
        value={qte}
        onKeyPress={(e) => e.key === 'Enter' && handleQte(props.index, props.reference)}
        placeholder="0"
        blurOnSubmit={false}
        underlineColorAndroid={"transparent"} />
    </DataTable.Cell>
    
    <DataTable.Cell numeric style={[styles.tableRow, { flex: 0.5 }]}>
        {/* {parseFloat(props.panier[props.index].pu_euro).toFixed(2)} € */}
        {props.idproduit !== "#promo" ? parseFloat(puEuro).toFixed(2) : "-" + parseFloat(puEuro).toFixed(2) } €
    </DataTable.Cell>
    
    <DataTable.Cell numeric style={[styles.tableRow, { flex: 0.5 }]}>
        {/* {parseFloat(props.panier[props.index].pu_euro * props.panier[props.index].qte).toFixed(2)} € */}
        {props.idproduit !== "#promo" ? parseFloat(montantTotal).toFixed(2) : "-" + parseFloat(montantTotal).toFixed(2) } €
    </DataTable.Cell>
    
    <DataTable.Cell numeric style={[styles.tableRow, { flex: 0.5 }]}>
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
    </DataTable.Cell>
    
    <DataTable.Cell numeric style={[styles.tableRow, { flex: 0.5 }]}>
        {parseFloat(props.panier[props.index].pu_euro * props.panier[props.index].qte * props.panier[props.index].remise / 100).toFixed(2)} €
    </DataTable.Cell></>
    
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
    tableRow: {
        textAlign: 'center',
        fontFamily: 'Tahoma',
    },
})

export default remiseInput;