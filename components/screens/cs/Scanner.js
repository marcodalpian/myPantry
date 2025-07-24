import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Ionicons from "react-native-vector-icons/Ionicons";

export default function Scanner(props) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    //richiesta di permessi all'utente
    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    //funzione di conseguenza all'ottenimento del codice
    const handleBarCodeScanned = ({ data }) => {
        setScanned(true);
        props.setBarcode(data);
        props.setScan();
    };

    if (hasPermission === null) {
        return <View style={styles.container2}>
            <Text style={{color:"grey"}}>Richiesta permessi in corso.</Text>
        </View>
    }

    if (hasPermission === false) {
        return <>
            <View style={styles.container}>
                <TouchableOpacity onPress={props.setScan} style={styles.camera}>
                    <Ionicons name='chevron-back' size={30} color="black"/>
                </TouchableOpacity>
            </View>
            <View style={styles.container2}>
                <Text style={{color:"grey", marginTop: "-170%"}}>Accesso alla fotocamera non consentito, recarsi </Text>
                <Text style={{color:"grey"}}>nelle impostazioni del telefono per poter utilizzare</Text>
                <Text style={{color:"grey"}}>lo scanner.</Text>
            </View>
        </>
    }

    return (
        <>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
            <TouchableOpacity onPress={props.setScan} style={styles.camera}>
                <Ionicons name='chevron-back' size={30} color="black"/>
            </TouchableOpacity>
        </>
    );
}

const styles = StyleSheet.create({
    camera: {
        width: "8%",
        borderRadius: 25,
        height: "5%",
        marginTop: 10,
        marginLeft: 10,
        backgroundColor: "#F2E933",
        alignSelf: 'flex-start',
        alignItems: "center",
        justifyContent: "center",
    },
    container: {
        flex: 15,
        backgroundColor: "#1f2028"
    },
    container2: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1f2028"
    },
});