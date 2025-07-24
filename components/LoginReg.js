import React from 'react';
import {StyleSheet, Text, View, Image, TextInput, TouchableOpacity} from "react-native";
import {useState} from "react";
import {StatusBar} from "expo-status-bar";
import Modale from "./Modale";
import * as SQLite from "expo-sqlite";
import {CheckBox} from 'react-native-elements';
import * as Network from "expo-network";

const db = SQLite.openDatabase('db.db');

export default function LoginReg(props) {

    const [modalVisible, setModalVisible] = useState(false);
    const [testo, setTesto] = useState(false);

    function setModalVisible1(){
        setModalVisible(!modalVisible);
    }

    function setModalVisible2(text){
        setTesto(text);
        setModalVisible(!modalVisible);
    }

    const [switch1, setSwitch] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const[remember, setRemember]=useState(false);
    const[wait, setWait]=useState(false);

    //funzione di switch tra login e registrazione
    function setSwitch1() {
        setSwitch(!switch1);
        setUsername("");
        setEmail("");
        setPassword("");
        if(remember===true){
            setRemember(false)
        }
    }

    //funzione di login
    const Login = async() => {
        const rete=await Network.getNetworkStateAsync();
        if(rete["isInternetReachable"]===true){
        setWait(true);
        if (email !== "" && password !== "") {
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
            if(JSON.stringify(json).includes("accessToken")){
                props.setEmail(email);
                StoreCredentials(email, password);
                let token=JSON.stringify(json["accessToken"]);
                props.setLogged(token.slice(1,token.length-1));
                console.log("Login effettuato.")
            } else{
                setWait(false);
                setModalVisible2("Credenziali errate, controlla email e password.")
                console.log("Login non effettuato.")
            }
        } else {
            setWait(false);
            setModalVisible2("Compila i campi richiesti!")
        }
        } else{
            setModalVisible2("Attivare la connessione ad Internet per poter effettuare il Login.")
        }
    }

    //funzione di salvataggio credenziali
    const StoreCredentials = (email, password) => {
        if(remember===true){
            try{
                 db.transaction((tx) => {
                     tx.executeSql('create table if not exists credentials (email TEXT PRIMARY KEY, password TEXT)')
                });
            } catch (error){
                console.log(error);
            }
            try{
                 db.transaction((tx) => {
                     tx.executeSql('insert into credentials (email, password) values(?,?)',
                        [email, password], (txObj, resultSet) =>{
                            console.log(resultSet+"\n   ^\n   |\nCredenziali salvate.")
                        })
                })
            } catch (error){
                console.log(error);
            }
        }
    }

    //funzione di registrazione
    const Registrazione = async() => {
        const rete=await Network.getNetworkStateAsync();
        if(rete["isInternetReachable"]===true){
        if(username.length<4){
            setModalVisible2("L'username deve essere composto da almeno 4 caratteri.")
        } else{
            if(!VerificaEmail(email)){
                setModalVisible2("Inserire una mail valida.")
            } else{
                if(password.length<8){
                    setModalVisible2("Inserire una password da almeno 8 caratteri.")
                } else{
                    const response = await fetch('https://lam21.iot-prism-lab.cs.unibo.it/users', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "username": username,
                            "email": email,
                            "password": password
                        })
                    });
                    let json = await response.json()
                    if(JSON.stringify(json).includes("createdAt")){
                        setSwitch1();
                        setModalVisible2("Registrazione avvenuta con successo, ora puoi procedere al login.")
                        console.log("Registrazione effettuata.")
                    } else{
                        setEmail("");
                        setModalVisible2("Questa email e' gia' associata ad un account, prova con un'altra.")
                        console.log("Registrazione non effettuata.")
                    }
                }
            }
        }
        } else{
            setModalVisible2("Attivare la connessione ad Internet per poter effettuare la Registrazione.")
        }
    }

    //funzione di controllo email valida
    function VerificaEmail(mail){
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)){
            return true;
        }
        return false;
    }

    return (
        <View style={styles.container}>
            <Image style={styles.image} source={require("../assets/splash.png")}/>
            <Text style={{fontWeight: "bold", fontSize: 25, color: "#F2E933", marginBottom: 50}}>myPantry</Text>
            <StatusBar style="auto"/>

            {switch1 ?<>
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.TextInput}
                            placeholder="Username"
                            placeholderTextColor="#003f5c"
                            onChangeText={(username) => setUsername(username)}
                        />
                    </View>
                </>
                : null}


            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Email"
                    placeholderTextColor="#003f5c"
                    onChangeText={(email) => setEmail(email)}
                    value={email}
                />
            </View>

            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Password"
                    placeholderTextColor="#003f5c"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                    value={password}
                />
            </View>

            {!switch1 ?
                <CheckBox
                    center
                    title='Salva le credenziali'
                    onPress={() => setRemember(!remember)}
                    checked={remember}
                    size={16}
                    textStyle={{ fontSize: 12, color: '#F2E933' }}
                    containerStyle={{backgroundColor: '#1f2028', borderColor: "#F2E933", borderRadius: 30}}
                    checkedColor={'#F2E933'}
                />
                :
                null
            }

            {!switch1 ? <>
                            {!wait ?
                                <TouchableOpacity onPress={Login}
                                                  style={{width: "30%",
                                                      borderRadius: 25,
                                                      height: 45,
                                                      alignItems: "center",
                                                      justifyContent: "center",
                                                      marginTop: 30,
                                                      backgroundColor: "#F2E933"}}>
                                    <Text style={{fontWeight: "bold", color: "#003f5c"}}>LOGIN</Text>
                                </TouchableOpacity>
                                    :
                                <TouchableOpacity
                                style={{width: "30%",
                                borderRadius: 25,
                                height: 45,
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: 30,
                                backgroundColor: "#F2E933"}}>
                                    <Image style={{width: 22, height:22 }} source={require('../images/loading.gif')}  />
                                </TouchableOpacity>
                            }
                        </>
                :
                <TouchableOpacity onPress={Registrazione}
                style={{width: "40%",
                borderRadius: 25,
                height: 45,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 30,
                backgroundColor: "#F2E933"}}>
                <Text style={{fontWeight: "bold", color: "#003f5c"}}>REGISTRATI</Text>
                </TouchableOpacity>
            }

            <TouchableOpacity onPress={setSwitch1}>
                {!switch1 ? <Text style={styles.forgot_button}>Non hai un profilo? Registrati!</Text>
                    : <Text style={styles.forgot_button}>Hai gia' un profilo? Loggati!</Text>}
            </TouchableOpacity>

            <Modale modalVisible={modalVisible} setModalVisible={setModalVisible1} testo={testo} bottoneVisibile={true}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1f2028",
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        marginTop: "35%",
        width: 150,
        height: 150,
    },
    inputView: {
        backgroundColor: "#F5EC98",
        borderRadius: 30,
        width: "70%",
        height: 45,
        marginBottom: 20,
        alignItems: "center",
    },
    TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
    },
    forgot_button: {
        marginTop: 20,
        height: 30,
        marginBottom: "35%",
        color: "#F2E933",
        fontWeight: "bold"
    },
});