import React, {useContext} from "react";
import {Modal, StyleSheet, Text, View, TouchableOpacity} from "react-native";
import * as SQLite from "expo-sqlite";
import {Context} from "../../../Context";

const db = SQLite.openDatabase('db.db');

export default function ModaleDelete(props){

    const contesto=useContext(Context);

    //funzione per eliminare prodotto dalla dispensa personale
    function deleteProduct(){
        try{
            db.transaction((tx) => {
                tx.executeSql('delete from products where nome = ? AND email = ?', [props.nomeProd, contesto.email],
                    (txObj, resultSet) => {
                        if (resultSet.rowsAffected > 0) {
                            console.log(props.nomeProd+" -> eliminato dalla dispensa personale.")
                            props.setModalVisible(false)
                            props.getProducts();
                        } else{
                            console.log("ERRORE ELIMINAZIONE DI "+props.nomeProd)
                        }
                    })
            })
        } catch (error){
            console.log(error);
        }
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

                        <Text style={styles.modalText}>Sei sicuro di vole eliminare
                            <Text style={{fontWeight: "bold"}}> {props.nomeProd} </Text>
                            dalla tua dispensa personale?</Text>

                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity
                                style={styles.button1}
                                onPress={() => props.setModalVisible(false)}
                            >
                                <Text style={styles.textStyle}>ANNULLA</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.button}
                                onPress={deleteProduct}
                            >
                                <Text style={styles.textStyle}>ELIMINA</Text>
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
        marginTop: 22
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
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        backgroundColor: "#F2E933"
    },
    button1: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginRight: 20,
        backgroundColor: "#F2E933"
    },
    textStyle: {
        color: "#003f5c",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        color: "gray",
        marginBottom: 15,
        textAlign: "center"
    },
});