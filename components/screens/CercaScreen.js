import { ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import * as React from 'react';
import {useContext, useState} from "react";
import {Context} from "../../Context";
import Modale from "../Modale";
import ModaleInsert from "./cs/ModaleInsert";
import Scanner from "./cs/Scanner";
import {Card} from 'react-native-shadow-cards';
import {Button, Divider, SearchBar} from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as SQLite from 'expo-sqlite';
import * as Network from 'expo-network';

const db = SQLite.openDatabase('db.db');

export default function CercaScreen() {

    //aggiunta di un prodotto alla dispensa personale, con controllo se e' gia presente
    const Aggiungi = async (nome, descrizione) => {
        try{
             db.transaction(async(tx) => {
                 await tx.executeSql('select nome from products where email = ?',
                    [contesto.email],
                    (tx, array ) => {
                        let duplicato=false;
                        for(let i=0; i<array["rows"]["_array"].length; i++){
                            if(array["rows"]["_array"][i]["nome"]===nome){
                                duplicato=true;
                            }
                        }
                        if(duplicato===false){
                            try{
                                 db.transaction(async(tx) => {
                                     await tx.executeSql('insert into products (nome, descrizione, email) values(?,?,?)',
                                        [nome, descrizione, contesto.email], (txObj, resultSet) =>{
                                            console.log(resultSet+"\n   ^\n   |\nAggiunto alla dispensa privata.")
                                            setModalVisible2("Prodotto aggiunto alla tua dispensa.", false)
                                        })
                                })
                            } catch (error){
                                console.log(error);
                            }
                        }
                    }, (tx, error) => {console.log(error)}
                )
            })
        } catch (error){
            console.log(error);
        }
    }

    const contesto=useContext(Context);

    //modale di alert
    const [modalVisible, setModalVisible] = useState(false);
    const [testo, setTesto] = useState(false);
    const [bottoneVisibile, setBottoneVisibile] = useState(false);

    function setModalVisible1(){
        setModalVisible(!modalVisible);
    }

    //funzione per aprire i modali
    function setModalVisible2(text, visibilitaBottone){
        setBottoneVisibile(visibilitaBottone)
        setTesto(text);
        setModalVisible(!modalVisible);
        if(visibilitaBottone===false){
            setTimeout(function(){setModalVisible(false)}, 1500)
        }
    }

    //modale di insert
    const [modalVisibleInsert, setModalVisibleInsert] = useState(false);

    //funzione per aprire il modale di inserimento prodotto
    function setModalVisible1Insert(){
        setModalVisibleInsert(!modalVisibleInsert);
    }

    const[bottone, setBottone]=useState(false);
    const[barcode, setBarcode]=useState("");
    const[productToken, setProductToken]=useState("");
    const[nomi, setNomi]=useState([]);
    const[descrizioni, setDescrizioni]=useState([]);
    const[id, setId]=useState([]);

    //funzione di ricerca nella dispensa pubblica
    const Cerca = async() => {
        const rete=await Network.getNetworkStateAsync();
        if(rete["isInternetReachable"]===true){
            if (barcode.length >= 13) {
                const response = await fetch('https://lam21.iot-prism-lab.cs.unibo.it/products?barcode='+barcode, {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer '+contesto.token,
                    },
                });
                let json = await response.json()
                console.log("Ricerca prodotti effettuata.")
                let nomiTemp=[];
                let descrizioniTemp=[];
                let idTemp=[];
                for(let i=0;i<json["products"].length;i++) {
                    nomiTemp[i]=json["products"][i]["name"]
                    descrizioniTemp[i]=json["products"][i]["description"]
                    idTemp[i]=json["products"][i]["id"]
                }
                setNomi(nomiTemp)
                setDescrizioni(descrizioniTemp)
                setId(idTemp)
                setProductToken(json["token"])
                setBottone(true);
            } else {
                setModalVisible2("Codice a barre errato.\n Deve contenere almeno 13 cifre.", true)
            }
        } else{
            setModalVisible2("Connettersi ad internet per poter effettuare una ricerca nella Dispensa Pubblica.", true)
        }
    }

    //funzione per votare i prodotti
    const Voto = async(voto, productId, nome, descrizione) => {
        if(voto==="like"){
            await fetch('https://lam21.iot-prism-lab.cs.unibo.it/votes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer '+contesto.token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "token": productToken,
                    "rating": 1,
                    "productId": productId,
                })
            });
            await console.log("Like effettuato.")
            await Aggiungi(nome, descrizione)
        } else{
            await fetch('https://lam21.iot-prism-lab.cs.unibo.it/votes', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer '+contesto.token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "token": productToken,
                    "rating": 0,
                    "productId": productId,
                })
            });
            await console.log("Dislike effettuato.")
            setModalVisible2("La ringraziamo per il feedback.", false)
        }
    }

    const[scann, setScann]=useState(false);
    function Scan(){
        setScann(!scann);
    }

    function onChangeBarcode(barcode){
        setBarcode(barcode);
        if(barcode===""){
            setBottone(false);
        }
    }

    return (
        <>
            {scann ? <Scanner setScan={Scan} setBarcode={setBarcode}/> :
                <>
                    <View style={{backgroundColor: "rgba(245,236,152,0.49)", flexDirection: 'row', justifyContent: 'center' }}>
                        <SearchBar
                            placeholder="Cerca per codice a barre"
                            onChangeText={(barcode) => onChangeBarcode(barcode)}
                            inputContainerStyle={{backgroundColor: '#F2E933'}}
                            containerStyle={{backgroundColor: 'rgba(253,246,209,0.45)', width: '75%',
                                marginBottom:-1, marginTop: -1}}
                            value={barcode}
                            round
                        />
                        <Button
                            icon={<Ionicons name='search' size={30} color="#1f2028"/>}
                            type="clear"
                            onPress={Cerca}
                            containerStyle={{width: "12%", marginTop: 9, marginLeft: -5}}
                        />
                        <Divider orientation="vertical" width={1} color="#z003f5c" style={{marginTop: 10,
                            marginBottom: 10}}/>
                        <Button
                            icon={<Ionicons name='camera' size={30} color="#1f2028"/>}
                            type="clear"
                            onPress={Scan}
                            containerStyle={{width: "12%", marginTop: 9}}
                        />
                    </View>
                    <ScrollView style={{backgroundColor: "#1f2028"}}>
                        {bottone ?
                            <View style={{marginTop: 20, alignItems: 'center'}}>
                                {nomi.map((nomi, index) => (
                                    <Card style={{padding: 10, margin: 10}} key={index}>
                                        <Text style={{fontWeight: "bold"}}>{nomi}</Text>
                                        <Divider orientation="vertical" height={10}/>
                                        <Text style={{ marginRight: 65 }}>{descrizioni[index]}</Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                            <TouchableOpacity onPress={() => Voto("like", id[index], nomi, descrizioni[index])}
                                                              style={{ marginRight: 10 }}>
                                                <Ionicons name='heart-outline' size={30} color="#F2E933"/>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => Voto("dislike", id[index])}
                                                              style={{ marginRight: 5 }}>
                                                <Ionicons name='heart-dislike-outline' size={30} color="#F2E933"/>
                                            </TouchableOpacity>
                                        </View>
                                    </Card>
                                ))}
                                <TouchableOpacity onPress={setModalVisible1Insert} style={styles.aggiungi}>
                                    <Text style={{fontWeight: "bold", color: "#003f5c"}}>Non vedi il tuo prodotto? Aggiungilo!</Text>
                                </TouchableOpacity>
                            </View>
                        : <Text style={{ marginLeft: "15%", marginRight: "15%", marginTop: 100, color: 'grey', textAlign: "center"}}>Inserisci il codice a barre
                                nella sezione di ricerca, oppure scannerizzalo dalla fotocamera, per esplorare il Database Pubblico.</Text>}

                        <Modale modalVisible={modalVisible} setModalVisible={setModalVisible1} testo={testo} bottoneVisibile={bottoneVisibile}/>
                        <ModaleInsert modalVisible={modalVisibleInsert} setModalVisible={setModalVisible1Insert}
                        productToken={productToken} barcode={barcode} modaleConferma={setModalVisible2}/>
                    </ScrollView>
                </>
            }
        </>
    );
}

const styles = StyleSheet.create({
    aggiungi: {
        width: "80%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
        backgroundColor: "#F2E933",
        alignSelf: 'center',
    },
});