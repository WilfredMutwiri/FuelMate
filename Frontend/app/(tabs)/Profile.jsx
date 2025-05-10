import {View,Text,StyleSheet, ScrollView} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Profile(){
    return(
        <SafeAreaView style={{flex:1}}>
            <ScrollView 
            style={{flex:1}}
            contentContainerStyle={{flexGrow:1}}
            >
            <View style={styles.container}>
                <Text>Welcome to emergency</Text>
            </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles=StyleSheet.create({
    container:{
        flexGrow:1
    }
})