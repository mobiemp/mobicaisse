import React, { Component } from 'react'
import { Animated, View, StyleSheet, Text } from 'react-native'

export default class Header extends Component {

    constructor(props) {
        super(props)
        this.fadeAnimation = new Animated.Value(0);
        // console.log(this.props.statut)
    }

    componentDidMount() {
        Animated.loop(
            Animated.sequence([
                Animated.timing(this.fadeAnimation, {
                    toValue: 0,
                    duration: this.props.duration,
                    useNativeDriver: true,
                }),
                Animated.timing(this.fadeAnimation, {
                    toValue: 1,
                    duration: this.props.duration,
                    useNativeDriver: true,
                })
            ]),
            {
                iterations: this.props.repeat_count
            }
        ).start();
    }

    render() {
        return (
            <View style={[{ width: '100%', height: 30 }, this.props.statut !== 200 ? styles.notConnected : styles.connected]}>
                <View style={{ flex: 1, flexDirection: 'row', width: '100%' }}>
                    <View style={{ justifyContent: 'left' }}>
                        <Text style={[styles.text, { textAlign: 'left' }]}>{this.props.statut !== 200 ? 'SERVEUR DISTANT : DÉCONNECTÉ ' : 'SERVEUR DISTANT:  CONNECTÉ'}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row',textAlign: 'center',justifyContent:'center' }}>
                        <Animated.Text style={[styles.text, { opacity: this.fadeAnimation }]} >
                            {this.props.statut !== 200 ? 'ALLUMEZ OU REDEMARREZ LE SERVEUR' : ''}
                        </Animated.Text>
                    </View>
                </View>
            </View>
        )
    }


}


const styles = StyleSheet.create({
    text: {
        fontSize: 14,
        fontFamily: 'Tahoma',
        color: "#ffffff",
        marginTop: 5,
        marginLeft: 5
    },
    connected: {
        backgroundColor: 'green'
    },
    notConnected: {
        backgroundColor: 'red'
    }
});