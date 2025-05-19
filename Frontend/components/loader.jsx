import { View,Text,ActivityIndicator } from "react-native";

export default function Loader() {
    return (
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center',alignSelf:'center',width:300, height: 150}}>
            <ActivityIndicator size="large" color="#ff6d1f"/>
            <Text style={{color:"#ff6d1f"}}>Loading...</Text>
        </View>
    )
}