import {View,Text,StyleSheet, ScrollView,Image, TextInput, TouchableOpacity} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import alertImg from '../../assets/images/alert.png';

export default function Alert(){
    return(
        <SafeAreaView style={styles.container} edges={['left','right']}>
            <ScrollView
            style={{flex:1}}
            contentContainerStyle={{flexGrow:1}}
            >
                <View style={styles.emergencyCont}>
                    <View>
                        <Image source={alertImg} style={styles.alertImg}/>
                        <Text style={styles.IntroTxt}>
                            Hello, Welcome to emergency section. By making an order, fuel will be delivered to you by immediately 
                        </Text>
                        <Text style={styles.IntroSubTxt}>Sorry for the emergency...</Text>
                    </View>
                    {/* form section */}
                    <View style={styles.formContainer}>
                        <View>
                            <Text style={styles.label}>Enter Fuel Type</Text>
                            <TextInput
                                placeholder='Enter the fuel type'
                                style={styles.textInput}
                            />
                        </View>

                        <View>
                            <Text style={styles.label}>Enter Fuel Amount</Text>
                            <TextInput
                                placeholder='Enter the fuel amount in Litres'
                                keyboardType='numeric'
                                style={styles.textInput}
                            />
                        </View>

                        <View>
                            <Text style={styles.label}>Preferred Delivery Time</Text>
                            <TextInput
                                placeholder='Immediately'
                                style={styles.textInput}
                            />
                        </View>

                        <View>
                            <Text style={styles.label}>Payment Option</Text>
                            <TextInput
                                placeholder='Pay on Delivery'
                                style={styles.textInput}
                            />
                        </View>

                        {/* submit btn */}
                        <TouchableOpacity style={styles.submitBtn}>
                            <Text style={styles.btnTxt}>Order Now!</Text>
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
    emergencyCont:{
        width:'90%',
        alignSelf:'center',
        paddingTop:25,
        paddingBottom:50
    },
    alertImg:{
        width:100,
        height:100,
        resizeMode:'cover',
        alignSelf:'center'
    },
    IntroTxt:{
        paddingTop:15,
        textAlign:'center',
        fontSize:17
    },
    IntroSubTxt:{
        paddingTop:15,
        textAlign:'center',
        color:'#10AB10'
    },
    formContainer:{
        paddingTop:20,
        gap:15
    },
    textInput:{
        borderRadius:10,
        borderWidth:1,
        borderColor:'#D9D9D9',
        marginTop:10
    },
    label:{
        paddingLeft:4
    },
    submitBtn:{
        backgroundColor:'#10AB10',
        width:'85%',
        alignSelf:'center',
        padding:10,
        marginTop:10,
        borderRadius:10
    },
    btnTxt:{
        textAlign:'center',
        color:'#ffff'
    }
})