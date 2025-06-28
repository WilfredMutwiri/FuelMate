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
import {useRouter} from 'expo-router';
import axios from 'axios';
import { SERVER_URI } from '../constants/SERVER_URI';
import ToastComponent from "../components/Toast";
import useAuthStore from '../zustand/store.jsx';


export default function Signup(){
    const {signup}=useAuthStore();
    const {user}=useAuthStore();
    const router=useRouter();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [formData,setFormData]=useState({
        username:'',
        email:'',
        password:'',
        confirmPassword:'',
        phoneNo:''
    })
    const handleInputChange=(name,value)=>{
        setFormData({
            ...formData,
            [name]:value
        })
    }

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    }

    const handleSignUp=async()=>{
    try {
    // confirm password
    if(formData.password !== formData.confirmPassword){
        return ToastComponent("error","Passwords don't match")

    }
    const response=await axios.post(`${SERVER_URI}/api/v1/user/signup`, formData)
    const result=response.data
    if(response.data.success){
        await signup(result.user.email,result.user.username);
        ToastComponent("success","Account created successfully!")
        router.push('/Signin')
    }
    } catch (error) {
         if(error.response && error.response.data){
            ToastComponent("error",error.response.data.message || "An error occurred")  
         }else{
            ToastComponent("error",`An error occured ${error.message}`)  
         }
    }
    }
    const handleLogin = () => {
        router.push('/Signin');
    };
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
                        <Text style={styles.welcomeTxt}>Create your account to continue ...</Text>

                        {/* second container */}
                        <View style={styles.secondContainer}>
                            {/* username button */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Username</Text>
                                <TextInput 
                                style={styles.inputText}
                                value={formData.username}
                                onChangeText={(text)=>handleInputChange('username',text)}
                                placeholder='Enter your username'
                                />
                            </View>
                            {/* phone number button */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Phone Number</Text>
                                <TextInput 
                                style={styles.inputText}
                                value={formData.phoneNo}
                                keyboardType='numeric'
                                onChangeText={(text)=>handleInputChange('phoneNo',text)}
                                placeholder='Enter your phone number'
                                />
                            </View>
                            {/* email button */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Email</Text>
                                <TextInput 
                                value={formData.email}
                                onChangeText={(text)=>handleInputChange('email',text)}
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
                value={formData.password}
                onChangeText={(text)=>handleInputChange('password',text)}
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

            {/* confirm password */}
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <View style={styles.passwordContainer}>
            <TextInput   
                placeholder='Confirm your password'
                value={formData.confirmPassword}
                onChangeText={(text)=>handleInputChange("confirmPassword",text)}
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

            </View>
            
            {/* sign up button */}
            <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.buttonContainer} onPress={handleSignUp}>
                <Text style={{color:'#fff', fontSize:16, fontWeight:'semibold'}}>Create Account</Text>
            </TouchableOpacity>
            </View>

            {/* signup text */}
            <View style={styles.BottomContainer}>
            <Text>Already have an account?</Text>
            <TouchableOpacity onPress={handleLogin}>
                <Text style={{color:'#05367C', fontSize:14, fontWeight:'semibold'}}>Sign in</Text>
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
        paddingBottom:50
    },
    LogoContainer:{
        flexDirection:'row',
        width:"100%",
        height:"auto",
        backgroundColor:'#ffff',
        alignItems:'center',
        paddingTop:15,
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
    welcomeTxt:{
        fontSize:16,
        textAlign:"center"
    },
    // buttons
    secondContainer:{
        flex:1,
        flexDirection:'column',
        justifyContent:'center',
        width:"100%",
    },
    inputContainer:{
        marginTop:10,
        flexDirection:'column',
        width:"100%",
        alignSelf:'center',
        justifyContent:'center',
        alignItems:'center',
    },
// input text
inputLabel:{
        marginTop:10,
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
        marginBottom:15
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
        marginTop:15,
    },
})
