import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    ScrollView,
    Keyboard,
    Platform,

} from 'react-native';
import React,{useState} from 'react';
import { SafeAreaView } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
export default function Signin(){
    const [passwordVisible, setPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    }
    return(
        <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                contentContainerStyle={{flexGrow:1}}
                keyboardShouldPersistTaps="handled"
                >
                    <SafeAreaView style={styles.container}>
                        <View style={styles.LogoContainer}>
                            <Image source={require('../assets/images/logo.png')} style={styles.logo}/>
                        <Text style={styles.logoText}>Glad you are <Text style={styles.logoSubText}>here!</Text></Text>
                        </View>
                        {/* second container */}
                        <View style={styles.secondContainer}>
                            {/* email button */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Email</Text>
                                <TextInput 
                                style={styles.inputText}
                                placeholder='Enter your email'
                                />
                            </View>

            {/* password btn */}
            <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordContainer}>
            <TextInput   
                placeholder='Enter your password'
                secureTextEntry={!passwordVisible}
                />
            <TouchableOpacity style={styles.eyeIcon} onPress={togglePasswordVisibility}>
            {
                passwordVisible ? (
                    <FontAwesome6 name="eye" size={18} color="black"/>
                ) : (
                    <FontAwesome6 name="eye-slash" size={18} color="black"/>
                )
            }
            </TouchableOpacity >
            </View>

            <TouchableOpacity>
            <Text style={styles.forgotPasswordTxt}>Forgot Password</Text>
            </TouchableOpacity>
            </View>
            
            {/* sign in button */}
            <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.buttonContainer}>
                <Text style={{color:'#fff', fontSize:16, fontWeight:'semibold'}}>Sign In</Text>
            </TouchableOpacity>
            </View>

            {/* signup text */}
            <View style={styles.BottomContainer}>
            <Text>Don't have an account?</Text>
            <TouchableOpacity>
                <Text style={{color:'#05367C', fontSize:14, fontWeight:'semibold'}}>Sign up</Text>
            </TouchableOpacity>
            </View>
            </View>
</SafeAreaView>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff',
        padding:10,
    },
    LogoContainer:{
        flexDirection:'row',
        width:"100%",
        height:"auto",
        backgroundColor:'#ffff',
        alignItems:'center',
        borderRadius:100,
        paddingTop:40,
    },
    logo:{
        marginTop:20,
        width:100,
        height:100,
        resizeMode:'contain',
    },
    logoText:{
        fontSize:24,
        fontWeight:'semibold',
        textAlign:'center',
        marginTop:10,
    },
    logoSubText:{
        fontSize:24,
        fontWeight:'semibold',
        textAlign:'center',
        color:'#05367C',
    },

    // buttons
    secondContainer:{
        flex:1,
        flexDirection:'column',
        gap:25,
        justifyContent:'center',
        width:"100%",
        marginTop:10,
    },
    inputContainer:{
        flexDirection:'column',
        gap:10,
        width:"100%",
        alignSelf:'center',
        justifyContent:'center',
        alignItems:'center',
        marginTop:10,
    },
// input text
inputLabel:{
        fontSize:16,
        fontWeight:'semibold',
        marginBottom:5,
        left:45,
        alignSelf:'flex-start',
    },
inputText:{
        height:50,
        width:"85%",
        borderWidth:1,
        borderColor:'#05367C',
        fontSize:16,
        borderRadius:50,
        fontWeight:'semibold',
        justifyContent:'center',
        alignItems:'center',
        paddingLeft:25,
    },
    forgotPasswordTxt:{
        fontSize:14,
        fontWeight:'semibold',
        color:'#05367C',
        marginTop:5,
        left:90,
        // alignSelf:'flex-end',
    },
    passwordContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        width:"85%",
        borderWidth:1,
        borderColor:'#05367C',
        borderRadius:50,
        paddingLeft:25,
        height:50,
    },
    eyeIcon:{
        position:'absolute',
        right:20,
        top:10,
        alignItems:'center',
        justifyContent:'center',    
        height:30,
        width:30,
    },  
    buttonContainer:{
        width:"85%",
        height:50,
        backgroundColor:'#05367C',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:50,
    },
    BottomContainer:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        gap:5,
        marginTop:20,
    },
})
