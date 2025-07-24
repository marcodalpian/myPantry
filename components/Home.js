import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from "./screens/HomeScreen";
import CercaScreen from "./screens/CercaScreen";
import ProfiloScreen from "./screens/ProfiloScreen";

const Tab = createBottomTabNavigator();

export default function Home() {

    const MyTheme = {
        dark: false,
        colors: {
            card: '#1f2028',
            text: 'gray',
            border: '#F2E933',
        },
    };

    return (
        <NavigationContainer theme={MyTheme}>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'Dispensa') {
                            iconName = focused ? 'cube' : 'cube-outline';
                        } else if (route.name === 'Cerca') {
                            iconName = focused ? 'search' : 'search-outline';
                        } else if(route.name === 'Profilo') {
                            iconName = focused ? 'person' : 'person-outline';
                        }

                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: '#F2E933',
                    tabBarInactiveTintColor: 'gray',
                })}
            >
                <Tab.Screen name="Dispensa" component={HomeScreen}/>
                <Tab.Screen name="Cerca" component={CercaScreen}/>
                <Tab.Screen name="Profilo" component={ProfiloScreen}/>
            </Tab.Navigator>
        </NavigationContainer>
    );
}