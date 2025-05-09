import {View,Text,StyleSheet, ScrollView} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Home(){
    const insets = useSafeAreaInsets();

    return(
        <SafeAreaView style={{flex:1}}>
            <ScrollView 
            style={{flex:1}}
            contentContainerStyle={{flexGrow:1}}
            >
            <View style={{
                paddingTop: insets.top, 
                paddingBottom: insets.bottom, 
                paddingLeft: insets.left, 
                paddingRight: insets.right 
            }}>
                <Text>Welcome home</Text>
            </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles=StyleSheet.create({
    container:{
        flexGrow:1,

    }
})