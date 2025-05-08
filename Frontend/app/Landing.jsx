import {Text,View,StyleSheet,Image, TouchableOpacity} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native';
import {useRouter} from 'expo-router';
export default function Landing(){
    const router = useRouter();
    const handleLogin = () => {
        router.push('/Signin');
    };
    const handleSignup = () => {
        router.push('/Signup');
    };
    return(
        <SafeAreaView style={styles.container}>
        <View>
            <View style={styles.LogoContainer}>
                <Image source={require('../assets/images/logo.png')} style={styles.logo}/>
                <Text style={styles.logoText}>Your Fuel, Delivered Anywhere, Anytime</Text>

                {/* google btn */}
            <TouchableOpacity style={styles.googleContainer}>
                <Image source={require('../assets/images/googleIcon.png')} style={styles.googleIcon}/>
                <Text style={styles.googleText}>Continue with Google</Text>
            </TouchableOpacity>
            {/* login btn */}
            <TouchableOpacity style={styles.buttonContainer} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            {/* signup btn */}
            <TouchableOpacity style={styles.buttonContainer} onPress={handleSignup}>
                <Text style={styles.buttonText}>Create New Account</Text>
            </TouchableOpacity>

            {/* bottom text */}
            <View style={styles.adminLinksContainer}>
<Text style={styles.termsText}></Text><Text style={styles.termsText}> By signing in, you agree to our{' '} 
    <TouchableOpacity style={styles.linkInline}>
        <Text style={styles.linkInline}>Terms of Service</Text>
    </TouchableOpacity> and{' '}
    <TouchableOpacity style={styles.linkInline}>
        <Text style={styles.linkInline}>Privacy Policy</Text>
    </TouchableOpacity>.
  </Text>
</View>
</View>
</View>
</SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff',
        padding:10,
    },
    LogoContainer:{
        width:"100%",
        height:200,
        backgroundColor:'#ffff',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:100,
        position:'absolute',
        marginTop:"70%",
    },
    logo:{
        width:"80%",
        height:"80%",
        resizeMode:'contain',
    },
    logoText:{
        fontSize:24,
        fontWeight:'semibold',
        textAlign:'center',
        marginTop:10,
    },

    // buttons
    googleContainer:{
        width:"85%",
        height:50,
        backgroundColor:'#fff',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:50,
        marginTop:"10%",
        borderWidth:1,
        borderColor:'#05367C',
    },
    googleText:{
        fontSize:16,
        fontWeight:'semibold',
        textAlign:'center',
    },
    googleIcon:{
        width:20,
        height:20,
        resizeMode:'contain',
        position:'absolute',
        left:20,
    },

    buttonContainer:{
        width:"85%",
        height:50,
        backgroundColor:'#05367C',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:50,
        marginTop:"15%",
    },
    buttonText:{
        color:'#fff',
        fontSize:16,
        fontWeight:'semibold',
        textAlign:'center',
    },
    // bottom text
      termsText: {
        fontSize: 12,
        color: '#555',
        textAlign: 'center',
        marginTop: 10,
      },
      linkInline: {
        color: '#05367C',
        fontSize: 12,
        textAlign: 'center',
        textDecorationLine: 'underline',
        paddingTop:2,
      },
      
})
