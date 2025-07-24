import {Image, RefreshControl, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {Context} from "../../Context";
import {useContext, useEffect, useState} from "react";
import * as React from 'react';
import * as SQLite from "expo-sqlite";
import {Divider} from "react-native-elements";
import * as Network from "expo-network";
import Modale from "../Modale";

const db = SQLite.openDatabase('db.db');

export default function ProfiloScreen() {

    const contesto=useContext(Context);

    const[username, setUsername]=useState("");
    const[email, setEmail]=useState("");
    const[numeroProd, setNumeroProd]=useState(0);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(async() => {
        await getInfos();
    },[]);

    //funzione di logout circondata da un controllo di connessione
    const logout0 = async() => {
        const rete=await Network.getNetworkStateAsync();
        if (rete["isInternetReachable"]===true){
            contesto.logout()
        } else {
            setModalVisible(!modalVisible)
        }
    }

    //funzione che ricava il nome e nome utente dell'utente loggato
    const getInfos = async() => {
        const response = await fetch('https://lam21.iot-prism-lab.cs.unibo.it/users/me', {
            method: 'GET',
            headers: {
                Authorization: 'Bearer '+contesto.token,
            },
        });
        let json = await response.json()
        let mail=JSON.stringify(json["email"]);
        setEmail(mail.slice(1,mail.length-1));
        let nome=JSON.stringify(json["username"]);
        setUsername(nome.slice(1,nome.length-1));

        try{
            db.transaction((tx) => {
                tx.executeSql('select nome from products where email = ?',
                    [contesto.email],
                    (tx, array ) => {
                        if(array["rows"]["_array"].length>0){
                            setNumeroProd(array["rows"]["_array"].length)
                        }
                    }, (tx, error) => {console.log(error)}
                )
            })
        } catch (error){
            console.log(error);
        }
    }

    const [refreshing, setRefreshing] = React.useState(false);

    //funzione su aggiornamento pagina attraverso trascinamento
    const onRefresh = React.useCallback(async() => {
        setRefreshing(true);
        const rete=await Network.getNetworkStateAsync();
        if (rete["isInternetReachable"]===true){
            await getInfos();
        }
        setTimeout(function(){setRefreshing(false)}, 1000)
    }, []);

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', backgroundColor: "#1f2028"}} refreshControl={
            <RefreshControl
                progressBackgroundColor="yellow"
                tintColor="#003f5c"
                refreshing={refreshing}
                onRefresh={onRefresh}
            />
        }>
            <View style={{ alignItems: 'center', marginTop: "20%"}}>
                <Text style={{fontWeight: "bold", fontSize: 30, color: "grey"}}>IL TUO PROFILO</Text>
            </View>
            <Divider orientation="horizontal" width={0.6} color="#F2E933" style={{marginTop: 30,
                marginBottom: 30, marginLeft: 40, marginRight: 40}}/>
            <View style={{ alignItems: 'center'}}>
                <Text style={{fontWeight: "bold", fontSize: 20, color: "grey"}}>Username</Text>
                {username==="" ? <Image style={{width: 22, height:22 }} source={require('../../images/loading.gif')}  /> :
                    <Text style={{marginBottom: 10, color: "grey"}}>{username}</Text>}
                <Text style={{fontWeight: "bold", fontSize: 20, color: "grey"}}>Email</Text>
                {email==="" ? <Image style={{width: 22, height:22 }} source={require('../../images/loading.gif')}  /> :
                    <Text style={{marginBottom: 20, color: "grey"}}>{email}</Text>}
                <Text style={{marginBottom: 10, fontStyle: "italic", color: "grey"}}>Prodotti nella dispensa: {numeroProd}</Text>
            </View>
                <Divider orientation="horizontal" width={0.6} color="#F2E933" style={{marginTop: 20,
                    marginBottom: 10, marginLeft: 40, marginRight: 40}}/>
            <View style={{ alignItems: 'center'}}>
                <TouchableOpacity onPress={logout0}
                                  style={{width: "30%",
                                    borderRadius: 25,
                                    height: 50,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginTop: 30,
                                    backgroundColor: "#F2E933"}}>
                    <Text style={{fontWeight: "bold", color: "#003f5c"}}>LOGOUT</Text>
                </TouchableOpacity>
            </View>
            <Modale modalVisible={modalVisible} setModalVisible={setModalVisible}
                    testo={"Connettersi ad internet per poter effettuare il Logout."} bottoneVisibile={true}/>
        </ScrollView>
    );
}

