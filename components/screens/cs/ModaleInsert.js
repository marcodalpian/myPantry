import React, {useContext, useState} from "react";
import {Modal, StyleSheet, Text, View, TextInput, TouchableOpacity} from "react-native";
import {Context} from "../../../Context";

export default function ModaleInsert(props){

    const contesto=useContext(Context);
    const [nome, setNome] = useState("");
    const [descrizione, setDescrizione] = useState("");

    //funzione che aggiunge un prodotto alla dispensa pubblica
    const Insert = async() => {
        if(nome!=="" && descrizione!==""){
            await fetch('https://lam21.iot-prism-lab.cs.unibo.it/products', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer '+contesto.token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "token": props.productToken,
                    "name": nome,
                    "description": descrizione,
                    "barcode": props.barcode,
                    "test": true,
                })
            });
            setNome("")
            setDescrizione("")
            setDisable(true)
            console.log("Prodotto inserito nel database remoto.")
            props.modaleConferma("Prodotto aggiunto al catalogo pubblico.", false)
            props.setModalVisible(!props.modalVisible)
        }
    }

    const[disable, setDisable]=useState(true);

    //funzioni che si occupano di disabilitare il pulsante di aggiunta, nel caso il testo sia assente
    function Disable1(nome){
        setNome(nome)
        if(nome!=="" && descrizione.length>8){
            setDisable(false)
        } else{
            setDisable(true)
        }
    }
    function Disable2(descrizione){
        setDescrizione(descrizione)
        if(descrizione.length>8 && nome!==""){
            setDisable(false)
        } else{
            setDisable(true)
        }
    }

    //funzione per chiudere il modale
    function Annulla(){
        props.setModalVisible(!props.modalVisible)
        setNome("")
        setDescrizione("")
        setDisable(true)
    }

    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={props.modalVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>AGGIUNGI AL DATABASE PUBBLICO IL TUO PRODOTTO</Text>

                        <View style={styles.inputView}>
                            <TextInput
                                style={styles.TextInput}
                                placeholder="Nome"
                                placeholderTextColor="#1f2028"
                                onChangeText={(nome) => Disable1(nome)}
                            />
                        </View>

                        <View style={styles.inputView1}>
                            <TextInput
                                style={styles.TextInput}
                                placeholder="Descrizione"
                                placeholderTextColor="#1f2028"
                                multiline={true}
                                numberOfLines = {4}
                                onChangeText={(descrizione) => Disable2(descrizione)}
                            />
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={Annulla} style={styles.aggiungi2}>
                                <Text style={{fontWeight: "bold", color: "#003f5c"}}>ANNULLA</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={Insert} style={[styles.aggiungi, disable ? styles.disattivo : styles.attivo]} disabled={disable}>
                                <Text style={{fontWeight: "bold", color: "#003f5c"}}>AGGIUNGI</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "#1f2028",
        borderRadius: 20,
        padding: 35,
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
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        color: "gray"
    },

    inputView: {
        backgroundColor: "grey",
        borderRadius: 30,
        width: "100%",
        height: 45,
        marginBottom: 20,
        marginTop: 10,
    },
    inputView1: {
        backgroundColor: "grey",
        borderRadius: 30,
        width: "100%",
        height: 150,
        marginBottom: 20,
    },
    TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
    },
    aggiungi: {
        width: "40%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
        alignSelf: 'center',
        marginLeft: 10
    },
    aggiungi2: {
        width: "40%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
        alignSelf: 'center',
        backgroundColor: "#F2E933",
    },
    attivo:{
        backgroundColor: "#F2E933",
    },
    disattivo:{
        backgroundColor: "grey",
    }
});