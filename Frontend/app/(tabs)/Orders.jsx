import {View,Text,StyleSheet, ScrollView} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function Orders(){
    return(
        <SafeAreaView style={styles.container} edges={['left','right']}>
            <ScrollView
            style={{flex:1}}
            contentContainerStyle={{flexGrow:1}}
            >
                <View style={styles.orderCont}>
                    <View>
                        <Text style={styles.orderID}>Order ID : <Text style={styles.IDsubTxt}>#123fklwewe13232dsda</Text></Text>
                        <Text>Ordered On : <Text style={styles.IDsubTxt}>04/08/2025</Text> - <Text style={styles.IDsubTxt}>09:10 PM</Text></Text>
                    </View>
                    {/* order progress*/}
                    <View>
                        <Text style={{fontSize:18, fontWeight:'bold', marginTop:20,marginBottom:20}}>Progress:</Text>

                        <View style={styles.orderStatus}>
                            <FontAwesome6 name="square-check" size={22} color="#10AB10"/>
                            <Text>-------------------</Text>
                            <Text>Order Placed</Text>
                        </View>
                        <View>
                            {[...Array(2)].map((_, i) => (
                                <View key={i}>
                                    <Text style={styles.drop}>.</Text>
                                </View>
                            ))}
                        </View>

                        <View style={styles.orderStatus}>
                            <FontAwesome6 name="square-check" size={22} color="#10AB10"/>
                            <Text>-------------------</Text>
                            <Text>Order Confirmed</Text>
                        </View>

                        <View>
                            {[...Array(2)].map((_, i) => (
                                <View key={i}>
                                    <Text style={styles.drop}>.</Text>
                                </View>
                            ))}
                        </View>

                        <View style={styles.orderStatus}>
                            <FontAwesome6 name="square" size={22} color="#000"/>
                            <Text>-------------------</Text>
                            <Text>Order Dispatched</Text>
                        </View>

                        <View>
                            {[...Array(2)].map((_, i) => (
                                <View key={i}>
                                    <Text style={styles.drop}>.</Text>
                                </View>
                            ))}
                        </View>


                        <View style={styles.orderStatus}>
                            <FontAwesome6 name="square" size={22} color="#000"/>
                            <Text>-------------------</Text>
                            <Text>Order Delivered</Text>
                        </View>
                        <Text style={{marginTop:30,marginBottom:30}}>---------------------------------------------------------------------------</Text>

                        {/* payment options */}
                        <View>
                            <Text style={{fontSize:18,paddingBottom:15,fontWeight:'semibold'}}>Payment Option:</Text>
                            <View style={{flexDirection:'row', alignItems:'center', gap:20, marginTop:10,marginBottom:10}}>
                                <Text>Pay on Delivery</Text>
                                <FontAwesome6 name="square-check" size={20} color="#10AB10"/>
                            </View>

                            <View style={{flexDirection:'row', alignItems:'center', gap:20, marginTop:10,marginBottom:10}}>
                                <Text>Pay before Delivery</Text>
                                <FontAwesome6 name="square" size={20} color="#000"/>
                            </View>
                        </View>

                        {/* delivery address */}

                        <View>
                            <Text style={{fontSize:18,paddingBottom:15,paddingTop:20,fontWeight:'semibold'}}>Delivery Address:</Text>
                            <Text>350 street- kilimambogo area</Text>
                        </View>

                        {/* total price */}
                        <View style={{marginBottom:30}}>
                            <Text style={{fontSize:18,paddingBottom:15,paddingTop:20,fontWeight:'semibold'}}>Total Price:</Text>
                            <Text style={{color:"#0EA01F",fontWeight:"semibold",fontSize:25}}>Ksh <Text>13000</Text></Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles=StyleSheet.create({
    container:{
        flex:1,
    },
    orderCont:{
        width:'85%',
        alignSelf:'center',
    },
    orderID:{
        fontSize:19,
        fontWeight:'bold',
        color:'#000',
        marginTop:20,
        marginBottom:10
    },
    IDsubTxt:{
        color:'#05367C',
    },
    orderStatus:{
        flexDirection:'row',
        alignItems:'center',
        marginBottom:10,
        marginTop:10,
        gap:30
    },
    drop:{
        fontSize:30,
        color:'#000',
    }
})