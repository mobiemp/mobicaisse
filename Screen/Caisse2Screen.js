import * as React from 'react';
import { View, StyleSheet, SafeAreaView, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Chip, Button } from 'react-native-paper';
import ProduitList from '../Components/produitList'

const Caisse2Screen = ({ navigation, props }) => {

    return (
        <View style={styles.container}>
            <View style={{ width: "7%", height: '100%', zIndex: 9999, backgroundColor: '#303456' }}>

            </View>
            <View style={[{ width: '60%', marginTop: 10, maxHeight: 800 }]} >
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Chip style={styles.chip} icon="information" onPress={() => console.log('Pressed')}>Sandwich</Chip>
                    <Chip style={styles.chip} icon="information" onPress={() => console.log('Pressed')}>Burgers</Chip>
                    <Chip style={styles.chip} icon="information" onPress={() => console.log('Pressed')}>Kebab</Chip>
                    <Chip style={styles.chip} icon="information" onPress={() => console.log('Pressed')}>Tacos</Chip>
                </View>
                <ScrollView horizontal={true}>
                    <View>
                        <ProduitList number={20} />
                    </View>
                </ScrollView>
            </View>
            <View style={{ width: '25%', marginRight: 2, alignItems: 'start',paddingRight:15 }}>
                <Text style={{ fontFamily: 'Tahoma', fontSize: 22, fontWeight: 700, margin: 15 }}>TOTAL A PAYER</Text>
                <View style={[styles.shadowProp, styles.totalCaisse,{width: '70%'}]}>
                    <Text style={{ padding: 15, fontFamily: 'Tahoma', color: '#FFFFFF', fontSize: 32, textAlign: 'end' }}><Text style={{ fontSize: 56, fontWeight: 700, color: '#FFFFFF', fontFamily: 'Tahoma', color: '#FFFFFF' }}></Text>€</Text>
                </View>
                <View style={[styles.shadowProp]}>
                    
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
                    <SafeAreaView style={{ flex: 1, flexDirection: "row", flexWrap: "wrap", justifyContent: 'space-between' }}>
                        <View style={styles.btn}>
                            <Button mode="contained" style={styles.btnAction} onPress={() => { setModalVisible(true), setTypePaiement('divers') }}>
                                Chèque Restaurant
                            </Button>
                        </View>
                        <View style={styles.btn}>
                            <Button mode="contained" style={styles.btnAction} onPress={() => { setModalVisible(true), setTypePaiement('clear') }}>
                                Vider
                            </Button>
                        </View>
                    </SafeAreaView>
                </View>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({

    container: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: 'space-between',
        backgroundColor: '#F8F8F8',

    },
    chip: {
        height: 35,
        marginRight: 15
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
    btnAction: {
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: 'steelblue'
    },
    totalCaisse: {
        width: '100%',
        height: 100,
        borderWidth: 3,
        borderRadius: 10,
        borderColor: '#FFFFFF',
        backgroundColor: 'steelblue',
    },
    touches: {
        borderRadius: 10,
        width: '100%',
        padding: 10,
        borderWidth: 3,
        borderColor: 'steelblue',
        backgroundColor: "#FFFFFF"
    },
});

export default Caisse2Screen;