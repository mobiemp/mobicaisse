import React, { useEffect, useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View } from "react-native";
import {TextInput} from 'react-native-paper'

const produitModal = (props) => {


    const [value, setValue] = useState(0)
    const handleValue = () => {
        if(Object.keys(props.data).length !== 0){
            console.log(value,props.data.index)
            props.remise(value,props.data.index,props.data.item.ref)
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
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={styles.entete}>
                            {Object.keys(props.data).length !== 0 && <Text style={styles.modalText}><Text style={{ textAlign: 'center', fontWeight: 600 }}>{props.data.item.titre}</Text></Text>}
                        </View>
                        <View style={{ flex:1, flexDirection:'row',  width:'100%',padding:20 , justifyContent:'center',alignItems:'center' }}>
                            {/* <TextInput
                                style={styles.numericInput}
                                keyboardType='numeric'
                                onChangeText={(value) => handleValue(value)}
                                value={value}
                                maxLength={10}
                            /> */}
                            <TextInput
                                label="Remise"
                                mode='outlined'
                                keyboardType='numeric'
                                outlineColor='#159335'
                                activeOutlineColor='#159335'
                                placeholder=""
                                selectTextOnFocus={true}
                                onChangeText={(value) => setValue(value)}
                                value={value}
                            /> 
                            <Text style={{fontSize:26,marginLeft:10}}>%</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row',alignItems:'center' }}>
                            <Pressable
                                style={[styles.button, styles.buttonConfirm]}
                                onPress={() => { handleValue(), props.setModalVisible(!props.visible) }}
                            >
                                <Text style={styles.textStyle}>Valider</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => props.setModalVisible(!props.visible)}
                            >
                                <Text style={styles.textStyle}>Annuler</Text>
                            </Pressable>
                        </View>

                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    entete: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#159335',
        height: 50,
        width: '100%'
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    numericInput: {
        margin: 15,
        textAlign: 'center'
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        paddingBottom: 35,
        width: '20%',
        height:'25%',
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        padding: 7,
        elevation: 2,
        borderRadius: 5,
        height:35,

    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    buttonConfirm: {
        backgroundColor: "red",
        marginRight: 10
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 13,
    },
    modalText: {
        marginLeft: 15,
        textAlign: "center",
        textTransform: 'uppercase',
        color: '#FFFFFF',
        fontFamily: 'Tahoma',
        fontSize: 20
    }
});

export default produitModal;