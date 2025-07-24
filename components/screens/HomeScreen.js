import {RefreshControl, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {useContext, useEffect, useState} from "react";
import * as React from 'react';
import * as SQLite from 'expo-sqlite';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Card} from "react-native-shadow-cards";
import {Divider, SearchBar} from "react-native-elements";
import ModaleDelete from "./hs/ModaleDelete";
import {Context} from "../../Context";

const db = SQLite.openDatabase('db.db');

export default function HomeScreen() {

    useEffect(async() => {
        getproducts();
    },[]);

    const[nomi, setNomi]=useState([]);
    const[descrizioni, setDescrizioni]=useState([]);
    const contesto=useContext(Context);

    //aggiornamento prodotti nella dispensa personale
    const getproducts = () => {
        /*db.transaction(tx => {
            tx.executeSql('drop table products',
                (txObj, resultSet) => {console.log(resultSet)})})*/
        try{
            db.transaction(tx => {
                tx.executeSql('create table if not exists products (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, descrizione TEXT, email TEXT)')
            });
        } catch (error){
            console.log(error);
        }
        try{
            db.transaction((tx) => {
                tx.executeSql('select nome, descrizione from products where email = ?',
                    [contesto.email],
                    (tx, array ) => {
                        if(array["rows"]["_array"].length>0){
                            let nomiTemp=[];
                            let descrizioniTemp=[];
                            for(let i=0; i<array["rows"]["_array"].length; i++){
                                nomiTemp[i]=array["rows"]["_array"][i]["nome"];
                                descrizioniTemp[i]=array["rows"]["_array"][i]["descrizione"]
                            }
                            setNomi(nomiTemp);
                            setDescrizioni(descrizioniTemp);
                            setFiltered(nomiTemp);
                            setFilteredD(descrizioniTemp);
                        } else {
                            setNomi([]);
                            setDescrizioni([]);
                            setFiltered([]);
                            setFilteredD([]);
                        }
                    }, (tx, error) => {console.log(error)}
                )
            })
        } catch (error){
            console.log(error);
        }
    }

    const[deleteModal, setDeleteModal]=useState(false);
    const[nomeProdotto, setNomeProdotto]=useState("");

    function deleteProduct(nomeProd){
        setNomeProdotto(nomeProd)
        setDeleteModal(true)
    }

    const[filtered, setFiltered]=useState([]);
    const[filteredD, setFilteredD]=useState([]);
    const[filtro, setFiltro]=useState("");

    //filtra i prodotti in base alla stringa search
    function Filter(search){
        setFiltro(search);
        if (search !== '') {
            let filtroD=[];
            let resultsD=[];
            const results = nomi.filter((nomi) => {
                filtroD.push(nomi.toLowerCase().includes(search.toLowerCase()))
                return nomi.toLowerCase().includes(search.toLowerCase());
            });
            for (let i = 0; i <filtroD.length; i++) {
                if(filtroD[i]===true){
                   resultsD.push(descrizioni[i])
                }
            }
            setFiltered(results);
            setFilteredD(resultsD);
        } else{
            setFiltered(nomi);
            setFilteredD(descrizioni);
        }
    }

    const [refreshing, setRefreshing] = React.useState(false);

    //funzione su aggiornamento
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getproducts();
        setTimeout(function(){setRefreshing(false)}, 1000)
    }, []);

    return (
        <>
            <SearchBar
                placeholder="Cerca nella tua dispensa"
                onChangeText={(search) => Filter(search)}
                inputContainerStyle={{backgroundColor: '#F2E933'}}
                containerStyle={{backgroundColor: 'rgba(253,246,209,0.45)', marginTop: -1, marginBottom: -1}}
                inputStyle={{ color:"black"}}
                value={filtro}
                round
            />
            <ScrollView style={{backgroundColor: "#1f2028"}} refreshControl={
                <RefreshControl
                    progressBackgroundColor="yellow"
                    tintColor="#F2E933"
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }>
                <View style={{ alignItems: 'center', marginTop: 15}}>
                    {filtered.length>0 ?
                        filtered.map((nomi, index) => (
                            <Card style={{padding: 10, margin: 10}} key={index}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <Text style={{ marginTop: 7, marginBottom: 10, fontWeight: "bold"}}>{nomi}</Text>
                                    <TouchableOpacity onPress={() => deleteProduct(nomi)}>
                                        <Ionicons name='trash-outline' size={28} color="#F2E933"/>
                                    </TouchableOpacity>
                                </View>
                                <Divider/>
                                <Text style={{ marginTop: 7}}>{filteredD[index]}</Text>
                            </Card>
                        )) : <Text style={{ marginLeft: "15%", marginRight: "15%", marginTop: 100, color: 'grey', textAlign: "center"}}>Nessun prodotto trovato.{"\n"}{"\n"}
                            Trascina verso il basso per aggiornare.{"\n"}{"\n"}
                            Oppure recati nella sezione "Cerca" per aggiungere prodotti alla tua Dispensa Personale.</Text>}

                </View>
                <ModaleDelete modalVisible={deleteModal} setModalVisible={setDeleteModal} nomeProd={nomeProdotto} getProducts={getproducts}/>
            </ScrollView>
        </>
    );
}