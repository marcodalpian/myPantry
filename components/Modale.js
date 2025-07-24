import React from "react";
import {Modal, StyleSheet, Text, View, TouchableOpacity} from "react-native";

export default function Modale(props){

    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={props.modalVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>{props.testo}</Text>
                        {props.bottoneVisibile ?
                            <TouchableOpacity onPress={() => props.setModalVisible(!props.modalVisible)}
                                              style={{width: 60,
                                                  borderRadius: 25,
                                                  height: 40,
                                                  alignItems: "center",
                                                  justifyContent: "center",
                                                  marginTop: 5,
                                                  backgroundColor: "#F2E933"}}>
                                <Text style={{fontWeight: "bold", color: "#003f5c"}}>OK</Text>
                            </TouchableOpacity>
                        : null}
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
        alignItems: "center",
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
    modalText: {
        marginTop: 10,
        marginBottom: 15,
        textAlign: "center",
        color: "gray"
    }
});