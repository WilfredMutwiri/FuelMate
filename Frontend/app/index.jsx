import {Text,View,StyleSheet,Image, TouchableOpacity} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native';

export default function Index(){
    return(
        <SafeAreaView style={styles.container}>
        <View>
            <View style={styles.topContainer}>
            <View style={styles.dropContainer}>
                <Image source={require('../assets/images/drop.png')} style={styles.dropImage}/>
            </View>
            <View style={styles.LogoContainer}>
                <Image source={require('../assets/images/logo.png')} style={styles.logo}/>
                <Text style={styles.logoText}>Fuel<Text style={styles.subText}>Mate</Text></Text>
                <Text>Your Fuel, Delivered Anywhere, Anytime</Text>

            <TouchableOpacity style={styles.buttonContainer}>
                <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
            </View>
            </View>
        </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff'
    },
    topContainer:{
        width:'100%',
        height:50,
        backgroundColor:'#ffff',
    },
    dropContainer:{
        width:200,
        height:200,
        backgroundColor:'#05367C',
        justifyContent:'flex-start',
        alignItems:'center',
        borderRadius:100,
        position:'absolute',
        marginTop:-10,
        right:-55,
    },
    dropImage:{
        width:150,
        height:135,
        resizeMode:'contain',
    },
    LogoContainer:{
        width:"100%",
        height:200,
        backgroundColor:'#fff',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:100,
        position:'absolute',
        marginTop:"90%",
    },
    logo:{
        width:"80%",
        height:"80%",
        resizeMode:'contain',
    },
    logoText:{
        fontSize:30,
        fontWeight:'bold',
        color:'#E19540',
        textAlign:'center',
        marginTop:10,
    },
    subText:{
        color:'#05367C',
        fontSize:30,
        fontWeight:'bold',
    },
    buttonContainer:{
        width:"70%",
        height:50,
        backgroundColor:'#05367C',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:50,
        marginTop:"30%",
    },
    buttonText:{
        color:'#fff',
        fontSize:16,
        fontWeight:'semibold',
        textAlign:'center',
    },
})
