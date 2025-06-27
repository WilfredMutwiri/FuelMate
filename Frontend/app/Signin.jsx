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
import {SERVER_URI} from '../constants/SERVER_URI.jsx';
import axios from 'axios'
import ToastComponent from "../components/Toast";
import useAuthStore from '../zustand/store.jsx';
import { useNavigation } from 'expo-router';
export default function Signin(){
    const navigation=useNavigation();
    const {login}=useAuthStore();
    const router = useRouter();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [success,setSuccess]=useState(false);
    const [formData,setFormData]=useState({
        username:'',
        password:''
    });

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    }

    const handleInputChange=(name,value)=>{
        setFormData({
            ...formData,
            [name]:value
        })
    }

    const handleSignin=async()=>{
        try {
            const response = await axios.post(`${SERVER_URI}/api/v1/user/signin`,formData)
            const result=response.data;
            console.log(result.user)
            if (result.success){
                await login(result.user.username,result.token,result.user.id,result.user.phoneNo,result.user.email)
                ToastComponent("success",`Welcome back! ${formData.username}`);  
                router.push('/Home');
            }
        } catch (error) {
            console.log(error);
            if(error.response && error.response.data){
                ToastComponent("error",`${error.response.data.message}`);  
            }
        }

        // router.push('/Home');
    }
    const handleRecovery = () => {
        router.push('/Recovery');
    }

    const handleSignup = () => {

        router.push('/Signup');
    }
    return(
        <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                contentContainerStyle={{flexGrow:1}}
                keyboardShouldPersistTaps="handled"
                >
                    <SafeAreaView
                    style={styles.container}
                    keyboardShouldPersistTaps='always'
                    >
                        <View style={styles.LogoContainer}>
                            <Image source={require('../assets/images/logo.png')} style={styles.logo}/>
                        <Text style={styles.logoText}>Glad you are <Text style={styles.logoSubText}>here!</Text></Text>
                        </View>
                        {/* second container */}
                        <View style={styles.secondContainer}>
                            {/* email button */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Username</Text>
                                <TextInput 
                                style={styles.inputText}
                                value={formData.username}
                                onChangeText={(text)=>handleInputChange('username',text)}
                                placeholder='Enter your username'
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

            <TouchableOpacity onPress={handleRecovery}>
            <Text style={styles.forgotPasswordTxt}>Forgot Password?</Text>
            </TouchableOpacity>
            </View>
            
            {/* sign in button */}
            <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.buttonContainer} onPress={handleSignin}>
                <Text style={{color:'#fff', fontSize:16, fontWeight:'semibold'}}>Sign In</Text>
            </TouchableOpacity>
            </View>

            {/* signup text */}
            <View style={styles.BottomContainer}>
            <Text>Don't have an account?</Text>
            <TouchableOpacity onPress={handleSignup}>
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
        paddingBottom:30,
    },
    LogoContainer:{
        flexDirection:'column',
        width:"100%",
        height:"auto",
        backgroundColor:'#ffff',
        alignItems:'center',
        borderRadius:100,
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
    passwordContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
        width:"85%",
        borderWidth:1,
        borderColor:'#05367C',
        borderRadius:50,
        paddingLeft:25,
        height:50,
    },
        forgotPasswordTxt:{
        fontSize:14,
        fontWeight:'semibold',
        color:'#05367C',
        marginTop:5,
        textAlign:'right'
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
