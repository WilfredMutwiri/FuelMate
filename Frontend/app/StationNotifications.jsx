import {View,Text,StyleSheet, ScrollView,Image, TextInput, TouchableOpacity} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function StationNotifications(){
    const notificationData = [
        {
            id: 1,
            from: 'FuelMate',
            message: 'Your fuel delivery is on the way!',
            timestamp: '2023-10-01 10:00 AM',
            read: false
        },  
        {
            id: 2,
            from: 'FuelMate',
            message: 'Your order has been confirmed.',
            timestamp: '2023-10-01 09:30 AM',
            read: true
        },
        {
            id: 3,
            from: 'FuelMate',
            message: 'New fuel delivery options available.',
            timestamp: '2023-10-01 08:45 AM',
            read: false
        }
    ]
    return(
        <SafeAreaView style={styles.container} edges={['left','right']}>
            <ScrollView
            style={{flex:1}}
            contentContainerStyle={{flexGrow:1}}
            >
                <View style={styles.notificationCont}>
                    {/* <View>
                        <Text style={styles.IntroTxt}>
                            You don't have any notifications at the moment.
                        </Text>
                    </View> */}
                    {/* notification section */}
                    <View>
                        {
                            notificationData.map((notification) => (
                                <View key={notification.id} style={styles.notification}>
                                    <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 5, justifyContent: 'space-between'}}>
                                        <Text style={{fontWeight: 'bold'}}>{notification.from}</Text>
                                        <Text style={{color: '#888', fontSize: 12}}>{notification.timestamp}</Text>
                                    </View>
                                    <Text>{notification.message}</Text>
                                </View>
                            ))
                        }
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
    notificationCont:{
        width:'90%',
        alignSelf:'center',
        paddingTop:25,
        paddingBottom:50
    },
    label:{
        paddingLeft:4
    },
    notification:{
        backgroundColor:'#f9f9f9',
        padding:15,
        borderRadius:10,
        marginBottom:10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2
    },
})