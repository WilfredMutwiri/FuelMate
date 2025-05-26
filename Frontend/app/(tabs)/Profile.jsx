import {View,Text,StyleSheet, ScrollView,Image, TextInput, TouchableOpacity} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import userImg from '../../assets/images/user.jpg';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function Profile(){
    return(
        <SafeAreaView style={styles.container} edges={['left','right']}>
            <ScrollView
            style={{flex:1}}
            contentContainerStyle={{flexGrow:1}}
            >
                <View style={styles.profileCont}>
                    {/* header section */}
                        <View style={styles.header}>
                            <Image source={userImg} style={styles.profileImg}/>
                            <View>
                                <Text style={styles.label}>John Kamau</Text>
                                <Text style={styles.subTitle}>Eldoret Town Center</Text>
                            </View>
                        </View>

                        {/* data section */}
                        <View>
                            <View style={styles.dataContainer}>
                                <Text style={styles.label}>Username</Text>
                                <Text style={styles.subTitle}>J_Kamau</Text>
                            </View>

                            <View style={styles.dataContainer}>
                                <Text style={styles.label}>Phone Number</Text>
                                <Text style={styles.subTitle}>0721234356</Text>
                            </View>

                            <View style={styles.dataContainer}>
                                <Text style={styles.label}>Email Address</Text>
                                <Text style={styles.subTitle}>johnkamau@gmail.com</Text>
                            </View>
                        </View>

                        {/* buttons */}
                        <View style={styles.BTNsContainer}>
                        <TouchableOpacity style={styles.signoutBtn}>
                            <Text style={styles.btnTxt}>Signout</Text>
                            <FontAwesome6 name="right-from-bracket" size={18} color="#ffff"/>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.updateBtn}>
                            <Text style={styles.btnTxt}>Update Profile</Text>
                            <FontAwesome6 name="pen" size={18} color="#ffff"/>
                        </TouchableOpacity>

                        </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles=StyleSheet.create({
    container:{
        flex:1
    },
    profileCont:{
        width:'90%',
        alignSelf:'center',
        paddingTop:25,
        paddingBottom:50
    },
    header:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-start',
        marginBottom:20,
        gap:25,
        borderWidth:1,
        borderColor:'#E19540',
        borderRadius:10,
        padding:10  
    },
    profileImg:{
        width:50,
        height:50,
        resizeMode:'cover',
        alignSelf:'center',
        borderRadius:50,
    },
    dataContainer:{
        borderWidth:1,
        borderColor:'#E19540',
        borderRadius:10,
        padding:10,
        marginTop:10
    },
    label:{
        fontSize:16,
        color:'#000',
        fontWeight:'500'
    },
    subTitle:{
        color:"#05367C",
    },
    BTNsContainer:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        marginTop:20,
        justifyContent:'space-between',
        marginTop:"50%"
    },
    signoutBtn:{
        backgroundColor:'#E42629',
        width:'45%',
        alignSelf:'center',
        padding:13,
        marginTop:10,
        borderRadius:10,
        flexDirection:'row',
        justifyContent:'space-between',
    },
    updateBtn:{
        backgroundColor:'#05367C',
        width:'45%',
        alignSelf:'center',
        padding:13,
        marginTop:10,
        borderRadius:10,
        flexDirection:'row',
        justifyContent:'space-between',
    },
    btnTxt:{
        textAlign:'center',
        color:'#ffff'
    }
})