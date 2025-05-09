import {View,Text,StyleSheet} from 'react-native'

export default function Orders(){
    return(
        <View style={styles.container}>
            <Text>Welcome to orders</Text>
        </View>
    )
}

const styles=StyleSheet.create({
    container:{
        flex:1
    }
})