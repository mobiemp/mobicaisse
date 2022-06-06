import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { TextInput,Button } from "react-native-paper"

const ClotureForm = () => {

    // Champs formulaire Pieces

    const [state, setState] = useState({
        cent1:{ value: 0.01 , qte: "" },
        cent2: { value: 0.02 , qte: "" },
        cent5: { value: 0.05 , qte: "" },
        cent10: { value: 0.1 , qte: "" },
        cent20: { value: 0.2 , qte: "" },
        cent50: { value: 0.5 , qte: "" },
        euro1: { value: 1 , qte: "" },
        euro2: { value: 2 , qte: "" },
        billet5: { value: 5 , qte: "" },
        billet10: { value: 10 , qte: "" },
        billet20: { value: 20 , qte: "" },
        billet50: { value:50 , qte: "" },
        billet100: { value:100 , qte: "" },
        billet200: { value:200 , qte: "" },
        billet500: { value:500 , qte: "" }
    })

    // Total 
    const [total, setTotal] = useState(0)


    totalCaisse = () => {
        let sum = 0
        if (Object.keys(state).length != 0 && state != null) {
            for (const [key, item] of Object.entries(state)) {
                let qte = item.qte === "" ? 0 : parseInt(item.qte)
                if(qte > 0){
                    sum += (qte * item.value)
                }
              }
        }
        return sum
    }
    const handleChange = (name, qte, value) => {
        setState({
            ...state,
            [name]: {
                value:value,
                qte:qte
            },
        });
    };
    // useEffect(() => {
    //     totalCaisse() 
    // }, []);

    return (
        <View>
            <View style={styles.container}>
                <View style={styles.inputGroup} >
                    <Text style={{ fontSize: 36, fontWeight: 700, color: 'steelblue' }}>Les Pièces</Text>
                    <TextInput
                        mode='outlined'
                        label="1 cents"
                        // keyboardType='numeric'
                        name="cent1"
                        style={styles.inputFields}
                        value={state.cent1.qte}
                        onChangeText={(value) => {handleChange('cent1', value,0.01)}}
                        selectTextOnFocus={true}
                    />
                    <TextInput
                        mode='outlined'
                        label="2 cents"
                        name="cent2"
                        // keyboardType='numeric'
                        style={styles.inputFields}
                        value={state.cent2.qte}
                        onChangeText={(value) => handleChange('cent2', value,0.02)}
                    />
                    <TextInput
                        mode='outlined'
                        label="5 cents"
                        // keyboardType='numeric'
                        style={[styles.inputFields, { marginBottom: 20 }]}
                        value={state.cent5.qte}
                        onChangeText={(value) => handleChange('cent5', value,0.05)}
                    />
                    <TextInput
                        mode='outlined'
                        label="10 cents"
                        // keyboardType='numeric'
                        style={styles.inputFields}
                        value={state.cent10.qte}
                        onChangeText={(value) => handleChange('cent10', value,0.10)}
                    />
                    <TextInput
                        mode='outlined'
                        label="20 cents"
                        // keyboardType='numeric'
                        style={styles.inputFields}
                        value={state.cent20.qte}
                        onChangeText={(value) => handleChange('cent20', value,0.20)}
                    />
                    <TextInput
                        mode='outlined'
                        label="50 cents"
                        // keyboardType='numeric'
                        style={[styles.inputFields, { marginBottom: 20 }]}
                        value={state.cent50.qte}
                        onChangeText={(value) => handleChange('cent50', value,0.50)}
                    />
                    <TextInput
                        mode='outlined'
                        label="1 euro"
                        // keyboardType='numeric'
                        style={styles.inputFields}
                        value={state.euro1.qte}
                        onChangeText={(value) => handleChange('euro1', value,1)}
                    />
                    <TextInput
                        mode='outlined'
                        label='2 euros'
                        style={styles.inputFields}
                        value={state.euro2.qte}
                        onChangeText={(value) => handleChange('euro2', value,2)}
                    />
                </View>
                <View style={styles.inputGroup} >
                    <Text style={{ fontSize: 36, fontWeight: 700, color: 'red' }}>Les Billets</Text>
                    <TextInput
                        mode='outlined'
                        label="5 euro"
                        // keyboardType='numeric'
                        style={styles.inputFields}
                        value={state.billet5.qte}
                        onChangeText={(value) => handleChange('billet5', value,5)}
                        selectTextOnFocus={true}
                    />
                    <TextInput
                        mode='outlined'
                        label="10 euros"
                        // keyboardType='numeric'
                        style={styles.inputFields}
                        value={state.billet10.qte}
                        onChangeText={(value) => handleChange('billet10', value,10)}
                    />
                    <TextInput
                        mode='outlined'
                        label="20 euros"
                        // keyboardType='numeric'
                        style={[styles.inputFields, { marginBottom: 20 }]}
                        value={state.billet20.qte}
                        onChangeText={(value) => handleChange('billet20', value,20)}
                    />
                    <TextInput
                        mode='outlined'
                        label="50 euros"
                        // keyboardType='numeric'
                        style={styles.inputFields}
                        value={state.billet50.qte}
                        onChangeText={(value) => handleChange('billet50', value,50)}
                    />
                    <TextInput
                        mode='outlined'
                        label="100 euros"
                        // keyboardType='numeric'
                        style={styles.inputFields}
                        value={state.billet100.qte}
                        onChangeText={(value) => handleChange('billet100', value,100)}
                    />
                    <TextInput
                        mode='outlined'
                        label="200 euros"
                        // keyboardType='numeric'
                        style={[styles.inputFields, { marginBottom: 20 }]}
                        value={state.billet200.qte}
                        onChangeText={(value) => handleChange('billet200', value,200)}
                    />
                    <TextInput
                        mode='outlined'
                        label="500 euros"
                        // keyboardType='numeric'
                        style={styles.inputFields}
                        value={state.billet500.qte}
                        onChangeText={(value) => handleChange('billet500', value,500)}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={{ fontSize: 30, fontWeight: 700, color: 'steelblue' }}>TOTAL : </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <TextInput
                            mode='outlined'
                            style={styles.inputFields}
                            keyboardType="numeric"
                            value={totalCaisse()}
                            onChangeText={(total) => setTotal(total)}
                        />
                        <Text style={{ fontSize: 30, fontWeight: 700, color: 'steelblue' }}>€</Text>
                    </View>

                    <Button  mode="contained" style={styles.btnAction} onPress={() => console.log('imprimé')}>
                    Imprimer cette page
                </Button>
                </View>
            </View>

        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 50,
        marginBottom: 75
    },
    inputGroup: {
        width: '30%'
    },
    inputFields: {
        marginBottom: 10,
        marginRight: 15,
        width: 300
    },
    btnAction: {
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: 'steelblue',
        textTransform:'uppercase'
    },

})
export default ClotureForm;