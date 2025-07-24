import React, {useEffect, useState} from 'react';
import LoginReg from "./components/LoginReg";
import Home from "./components/Home";
import {Context} from "./Context"
import * as SQLite from "expo-sqlite";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import * as Network from "expo-network";

const db = SQLite.openDatabase('db.db');

export default function App() {

    const[logged, setLogged]=useState("loading");
    const[token, setToken]=useState("");
    const[email, setEmail]=useState("");

    //funzione che controlla se le credenziali sono state salvate
    useEffect(async() => {
        try{
            db.transaction((tx) => {
                tx.executeSql('select email, password from credentials',
                    null,
                     (tx, array) => {
                         if (array["rows"]["_array"].length > 0) {
                             let email = array["rows"]["_array"][0]["email"];
                             let password = array["rows"]["_array"][0]["password"];
                             setEmail(email);
                             AutoLogin(email, password);
                         } else{
                             setLogged("login");
                         }
                     }, (tx, error) => {console.log(error); setLogged("login");}
                )
            })
        } catch (error){
            console.log(error);
        }
    },[]);

    //funzione che effettua il login in background
    const AutoLogin = async(email, password) => {
        const rete=await Network.getNetworkStateAsync();
        if(rete["isInternetReachable"]===true){
            const response = await fetch('https://lam21.iot-prism-lab.cs.unibo.it/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "email": email,
                    "password": password
                })
            });
            let json = await response.json()
            let token = JSON.stringify(json["accessToken"]);
            setLogged1(token.slice(1, token.length - 1));
            console.log("Login effettuato.")
        } else {
            setLogged("warning");
        }
    }

    function setLogged1(token1){
        setToken(token1)
        setLogged("home");
    }

    //funzione di logout
    function logout(){
        try{
            db.transaction((tx) => {
                tx.executeSql('drop table credentials')
            })
        } catch (error){
            console.log(error);
        }
        setLogged("login");
        console.log("Logout effettuato.")
    }

    //funzione principale dell'app, in base al valore di logged, viene ritornata una schermata in particolare
    function Returner(){
        if(logged==="loading"){
            return <View style={styles.container}>
                <Image style={styles.loading} source={require('./images/loading.gif')}/>
                </View>
        } else if(logged==="home"){
            return <Home/>
        } else if(logged==="warning") {
            return <View style={styles.container}>
                <Text style={{ fontWeight: "bold", color: 'grey', textAlign: "center", marginBottom: 20, fontSize: 20}}>AVVISO</Text>
                <Text style={{ marginRight: "10%", marginLeft: "10%", color: 'grey', textAlign: "center"}}>In assenza di connessione, potrai solamente effettuare
                    operazioni sulla tua Dispensa Personale.{"\n"}
                    Se si desidera sfruttare tutte le funzionalita' dell'App, effettuare nuovamente il login in presenza di connessione ad Internet.</Text>
                <TouchableOpacity style={{width: "15%",
                    borderRadius: 25,
                    height: 50,
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 40,
                    backgroundColor: "#F2E933"}} onPress={() => setLogged("home")}>
                    <Text>OK</Text>
                </TouchableOpacity>
            </View>
        } else{
            return <LoginReg setLogged={setLogged1} setEmail={setEmail}/>
        }
    }

    return(
        <Context.Provider value={{token, email, logout}}>
            <Returner/>
        </Context.Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1f2028"
    },
    loading: {
        height: 100,
        width: 100,
    },
});