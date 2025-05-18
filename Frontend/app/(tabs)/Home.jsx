import {View,Text,StyleSheet, ScrollView,Image, TextInput, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useRouter } from 'expo-router';

import map from '../../assets/images/map.jpg';
import station1 from '../../assets/images/station1.jpg'
import station2 from '../../assets/images/station2.jpg'
import station3 from '../../assets/images/station3.jpg'
import station4 from '../../assets/images/station4.jpg'

export default function Home(){
const router=useRouter();
    const stationsData=[
        {
            id:1,
            name:"Shell_Maiden",
            rating:"4.9",
            petrol:"200/Ltr",
            diesel:"230/Ltr",
            image:station1
        },
        {
            id:2,
            name:"Shell_Nairobi",
            rating:"4.5",
            petrol:"200/Ltr",
            diesel:"230/Ltr",
            image:station2
        },
        {
            id:3,
            name:"Rubis",
            rating:"4.0",
            petrol:"200/Ltr",
            diesel:"230/Ltr",
            image:station3
        },
        {
            id:4,
            name:"Shell_Dragola",
            rating:"4.4",
            petrol:"200/Ltr",
            diesel:"230/Ltr",
            image:station4
        }
    ]
    return(
        <SafeAreaView style={styles.container} edges={['left','right']}>
            <ScrollView 
            style={{flex:1}}
            contentContainerStyle={{flexGrow:1}}
            >
            <View>
                {/* map section */}
                <View style={styles.mapContainer}>
                    <View style={styles.IntroContainer}>
                        <Text>@ Wilfred</Text>
                        <View style={styles.locationContainer}>
                            <View>
                            <FontAwesome6 name="location-dot" size={18} color="#ff6d1f"/>
                            </View>
                            <Text>Nairobi - CBD</Text>
                        </View>
                    </View>
                    <Image source={map} style={{height:"100%",width:"100%",resizeMode:"cover"}}/>
                    <View style={styles.SearchContainer}>
                        <TextInput
                        placeholder='Search'
                        style={styles.TextInput}
                        />
                    </View>
                </View>
                {/* nearby stations */}
                <View style={styles.nearbyStationsContainer}>
                    <View style={styles.headerContainer}>
                    <Text style={styles.TitleTxt}>Nearby Filling Stations</Text>
                    <TouchableOpacity>
                    <Text style={styles.moreTxt}>See All</Text>
                    </TouchableOpacity>
                    </View>
                    {/* stations list */}
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={styles.stationContainer}>
                            {
                                stationsData.map((station)=>(
                                    <TouchableOpacity key={station.id} onPress={()=>router.push(`/(stationInfo)/${station.id}`)}>
                                        <Image source={station.image} style={{width:200,height:150,resizeMode:"cover"}}/>
                                        <View style={styles.stationInfoContainer}>
                                            <View >
                                                <Text>{station.name}</Text>
                                                <Text>Rating:{station.rating}</Text>
                                            </View>

                                            <View>
                                                <Text>Petrol : 200/Ltr</Text>
                                                <Text>Diesel : 230/Ltr</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            }
                        </View>
                    </ScrollView>

                    {/* most popular*/}
                    <View style={styles.headerContainer}>
                    <Text style={styles.TitleTxt}>Most Popular</Text>
                    <TouchableOpacity>
                    <Text style={styles.moreTxt}>See All</Text>
                    </TouchableOpacity>
                    </View>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={styles.stationContainer}>
                            {
                                stationsData.map((station)=>(
                                    <TouchableOpacity key={station.id}>
                                        <Image source={station.image} style={{width:200,height:150,resizeMode:"cover"}}/>
                                        <View style={styles.stationInfoContainer}>
                                            <View >
                                                <Text>{station.name}</Text>
                                                <Text>Rating:{station.rating}</Text>
                                            </View>

                                            <View>
                                                <Text>Petrol : 200/Ltr</Text>
                                                <Text>Diesel : 230/Ltr</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            }
                        </View>
                    </ScrollView>
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
    IntroContainer:{
        flexDirection:"row",
        justifyContent:"space-between",
        backgroundColor:"#ffff",
        width:"100%",
        alignSelf:"center",
        position:"absolute",
        paddingTop:6,
        paddingBottom:6,
        paddingLeft:10,
        paddingRight:10,
        zIndex:100,
    },
    locationContainer:{
        flexDirection:"row",
        gap:10,
        alignItems:"center",
        padding:5,
        borderRadius:50,
        marginRight:10,
    },
    mapContainer:{
        height:260,
        width:"100%",
        position:"relative",
        backgroundColor:"#ffff",
    },
    SearchContainer:{
        position:"absolute",
        zIndex:50,
        width:"90%",
        marginTop:60,
        backgroundColor:"#ffff",
        alignSelf:"center",
        borderRadius:50,
        opacity:0.9,
    },
    TextInput:{
        padding:5,
        borderRadius:50,
        borderWidth:1,
        paddingLeft:20,
        width:"100%",
        alignSelf:"center",
        borderColor:"#00478F",
        height:45,

    },
    headerContainer:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between",
    },
    nearbyStationsContainer:{
        padding:10,
        width:"100%"
    },
    TitleTxt:{
        paddingTop:10,
        fontSize:19,
        fontWeight:"semibold",
        color:"#00478F"
    },
    moreTxt:{
        color:'#E19540',
        paddingTop:2
    },
    stationContainer:{
        paddingTop:10,
        paddingBottom:15,
        flexDirection:"row",
        gap:15,
    },
    stationInfoContainer:{
        flexDirection:"row",
        backgroundColor:"#EBF5FF",
        gap:10,
        width:"100%",
        marginTop:-45,
        padding:4
    }
})