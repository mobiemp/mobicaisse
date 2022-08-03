import React, { useEffect, useState } from "react";
import { View, Text, Modal, StyleSheet } from 'react-native'
import { Button, TextInput } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

import useIsMounted from '../../useIsMonted'



const newArticleModal = (props) => {



    const [addFormVisible, setAddFormVisible] = useState()
    const [form, setForm] = useState({
        gencode: localStorage.getItem('gencode'),
        designation: '',
        codeTVA: '8.5',
        quantite: '0.00',
        // prix_variable: '',
        prix: '0.00',
        promo: '0.00',
    })
    const [errorMessage, setMessageError] = useState('')
    const [successMessage, setMessageSuccess] = useState('')
    const [categories, setCategories] = useState({})
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedUnite, setSelectedUnite] = useState('')
    const [selectedMode, setSelectedMode] = useState('')


    const isMounted = useIsMounted();

    const getCategories = async () => {
        try {
            const response = await fetch('http://localhost/caisse-backend/categorie.php?' + new URLSearchParams({
                action: 'categorieListe',
            }))
            const json = await response.json();
            setCategories(json.categories);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        props.gencode !== '' ? localStorage.setItem('gencode', props.gencode) : '';
        if (isMounted.current) {
            getCategories();
            return () => {
                setCategories({});
                isMounted.current = false
            };
        }
    }, [isMounted]);

    const handleChange = (name, value) => {
        setForm({
            ...form,
            [name]: value,
        });
    };

    const addArticle = () => {
        try {
            fetch('http://localhost/caisse-backend/catalogue.php', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ajoutArticle: form,
                    categorie: selectedCategory,
                    unite: selectedUnite,
                    mode: selectedMode,

                })
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson)
                    if (responseJson.response === 0) {
                        setErrorMessage('Une erreur c\'est produite')
                    }
                    else {
                        setMessageSuccess('Article ajouté au catalogue')
                        props.setPanier(responseJson)
                        props.setModalNewArticle(false)
                    }
                })
        }
        catch (error) {
            console.error(error);
        }
    }

    const renderCategorieListe = () => {
        return categories.map((category, index) => {
            return <Picker.Item label={category.nomcategorie} value={category.id} key={index} />
        })
    }

    const renderErrorMessage = () => {
        return (
            <View style={styles.errorBox}>
                <Text style={{ color: 'red', fontSize: '16', fontFamily: 'Tahoma', textAlign: 'center' }}>{errorMessage}</Text>
            </View>
        )
    }

    const renderSuccessMessage = () => {
        return (
            <View style={styles.errorBox}>
                <Text style={{ color: 'green', fontSize: '16', fontFamily: 'Tahoma', textAlign: 'center' }}>{successMessage}</Text>
            </View>
        )
    }


    const renderAddForm = () => {
        return (
            <View style={styles.modalView}>
                <View style={styles.entete}>
                    <Text style={{ fontFamily: 'Tahoma', fontSize: 20, color: '#ffffff' }}>Ajouter un article</Text>
                </View>
                <View style={{ padding: 35 }}>
                    <Picker
                        style={{ height: 40, marginTop: 15, width: '100%', marginBottom: 15 }}
                        selectedValue={selectedCategory}
                        onValueChange={(itemValue, itemIndex) =>
                            setSelectedCategory(itemValue)
                        }>
                        <Picker.Item label="Choisir une famile" value="" />
                        {renderCategorieListe()}
                    </Picker>

                    <TextInput
                        mode='outlined'
                        label="Nom de l'article"
                        // keyboardType='numeric'
                        name="designation"
                        style={styles.inputFields}
                        value={form.designation}
                        onChangeText={(value) => { handleChange('designation', value) }}
                        selectTextOnFocus={true}
                    />


                    <View style={styles.rowContainer}>
                        <TextInput
                            mode='outlined'
                            label="Code TVA"
                            keyboardType='numeric'
                            name="codetva"
                            style={styles.inputCodeTva}
                            value={form.codeTVA}
                            onChangeText={(value) => { handleChange('codeTVA', value) }}
                            selectTextOnFocus={true}
                        />
                        <TextInput
                            mode='outlined'
                            label="Quantite"
                            keyboardType='numeric'
                            name="quantite"
                            style={styles.inputQuantite}
                            value={form.quantite}
                            onChangeText={(value) => { handleChange('quantite', value) }}
                            selectTextOnFocus={true}
                        />
                        <Picker
                            style={{ height: 50, marginTop: 15 }}
                            selectedValue={selectedUnite}
                            onValueChange={(itemValue, itemIndex) =>
                                setSelectedUnite(itemValue)
                            }>
                            <Picker.Item label="Désactivé" value="desactive" />
                            <Picker.Item label="KG" value="1" />
                            <Picker.Item label="Litre" value="2" />
                            <Picker.Item label="Mètre" value="3" />
                        </Picker>
                    </View>
                    {/* <Text>Prix variable</Text>
                <Picker
                    style={{ height: 50, marginTop: 15,width:'100%',marginBottom:20 }}
                    selectedValue={selectedPV}
                    onValueChange={(itemValue, itemIndex) =>
                        setSelectedPV(itemValue)
                    }>
                    <Picker.Item label="Désactivé" value="desactive" />
                    <Picker.Item label="Activé, en euros" value="euros" />
                </Picker> */}
                    <View style={styles.rowContainer}>
                        <TextInput
                            mode='outlined'
                            label="Prix"
                            keyboardType='numeric'
                            name="prix"
                            style={styles.inputPrix}
                            value={form.prix}
                            onChangeText={(value) => { handleChange('prix', value) }}
                            selectTextOnFocus={true}
                        />
                        <Picker
                            style={{ height: 30, marginTop: 15, width: '30%' }}
                            selectedValue={selectedMode}
                            onValueChange={(itemValue, itemIndex) =>
                                setSelectedMode(itemValue)
                            }>
                            <Picker.Item label="TTC" value="prixTTC" />
                            <Picker.Item label="HT" value="prixHT" />
                        </Picker>


                    </View>
                    <TextInput
                        mode='outlined'
                        label="Promo"
                        keyboardType='numeric'
                        name="promo"
                        style={styles.inputPromo}
                        value={form.promo}
                        onChangeText={(value) => { handleChange('promo', value) }}
                        selectTextOnFocus={true}
                    />

                    <Button style={styles.buttonSubmit} mode="contained" onPress={() => addArticle()}>
                        Enregistrer
                    </Button>

                    {errorMessage !== "" && renderErrorMessage()}
                    {successMessage !== "" && renderSuccessMessage()}

                    <Button style={[styles.buttonClose]} mode="contained" onPress={() => props.setModalNewArticle(!props.modalNewArticle) }>
                        Fermer
                    </Button>
                </View>
            </View>
        );
    }

    const renderModal = () => {
        return (
            <View style={styles.centeredView}>
                {addFormVisible === true ? renderAddForm() :
                    <View style={styles.modalView}>
                        <View style={{ padding: 35 }}>
                            <Text style={styles.modalText}>Référence inconnue. Ajouter l'article dans le catalogue ? </Text>
                            <View style={[styles.buttons, { justifyContent: 'center' }]}>
                                <Button icon="plus-circle" style={styles.buttonAdd} mode="contained" onPress={() => setAddFormVisible(true)}>
                                    Ajouter
                                </Button>
                                <Button style={[styles.buttonClose]} mode="contained" onPress={() => props.setModalNewArticle(!props.modalNewArticle)}>
                                    Fermer
                                </Button>
                            </View>
                        </View>
                    </View>
                }
            </View>
        )
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.modalNewArticle}
            onRequestClose={() => {
                alert("Modal has been closed.");
                props.setModalNewArticle(!props.modalNewArticle);
            }}
        >
            {renderModal()}
        </Modal>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    rowContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%'
    },
    entete: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'steelblue',
        height: 50,
        width: '100%'
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        paddingBottom: 35,
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
    inputFields: {
        marginBottom: 10,
        marginRight: 15,
        width: 300
    },
    inputCodeTva: {
        marginBottom: 10,
        marginRight: 5,
        width: 110
    },
    inputQuantite: {
        marginBottom: 10,
        marginRight: 5,
        width: 110
    },
    inputPrix: {
        marginBottom: 10,
        marginRight: 5,
        width: '70%'
    },
    inputPromo: {
        width: '100%',
        marginBottom: 10,
        marginRight: 5,
    },
    buttonClose: {
        backgroundColor: "red",
    },
    buttonAdd: {
        marginRight: 10,
        backgroundColor: '#42ba96'
    },
    buttons: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    buttonSubmit: {
        backgroundColor: "skyblue",
        marginTop: 15,
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 20,
        color: 'red',
        marginBottom: 20
    },
    errorBox: {
        marginTop: 15,
        width: '100%'
    }
});

export default newArticleModal;