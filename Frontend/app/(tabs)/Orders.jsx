import {View,Text,StyleSheet, ScrollView} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Orders(){
    return(
        <SafeAreaView style={styles.container} edges={['left','right']}>
            <ScrollView
            style={{flex:1}}
            contentContainerStyle={{flexGrow:1}}
            >
                <View style={styles.emergencyCont}>
                    <Text>Welcome to orders</Text>
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
        width:'85%',
        alignSelf:'center',
        backgroundColor:'red'
    }
})