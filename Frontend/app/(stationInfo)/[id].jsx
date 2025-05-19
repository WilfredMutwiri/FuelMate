import { useLocalSearchParams } from 'expo-router';
import { View, Text,StyleSheet,Image, ScrollView, TouchableOpacity} from 'react-native';
import station1 from '../../assets/images/station1.jpg'
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { SERVER_URI } from '../../constants/SERVER_URI.jsx';
import Loader from '../../components/loader.jsx';

export default function StationInfoScreen() {


    const { id } = useLocalSearchParams();
    const [station, setStation] = useState(null);
    const [loading, setLoading] = useState(false);
    
    //   fetching the station data from the server
    useEffect(() => {
        const getStation = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${SERVER_URI}/api/v1/station/${id}`);
                const result = response.data;
                console.log(result);
                if (result.station) {
                    setStation(result.station);
                }
            }
            catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        getStation();
    },[id])

    useEffect(() => {
        console.log(station);
    },[station])

  return (
    <SafeAreaView style={styles.container} edges={['left','right']}>
        <ScrollView
        contentContainerStyle={{paddingBottom:50}}
        >
            {
                loading?(
                    <Loader/>
            ):(
                <>
                    <View style={styles.ImageContainer}>
                        <Image source={station1} style={styles.stationImg}/>
                    </View>
                    <View style={styles.Stationinfo}>
                        <View style={styles.topInfo}>
                            <View>
                                <Text style={styles.stationName}>{station?.username}</Text>
                                {/* rating */}
                                <TouchableOpacity style={styles.ratingContainer}>
                                    <FontAwesome6 name="star" size={18} color="#ff6d1f"/>
                                    <Text style={styles.ratingTxt}>{station?.rating}</Text>
                                </TouchableOpacity>
                            </View>
                            {/* likes */}
                            <View style={styles.likesContainer}>
                                <TouchableOpacity>
                                    <FontAwesome6 name="thumbs-up" size={18} color="#ff6d1f"/>
                                    <Text>{200}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <FontAwesome6 name="thumbs-down" size={18} color="red"/>
                                    <Text>{20}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/* location View */}
                        <View style={styles.locationContainer}>
                            <Text style={styles.headingTxt}>Location</Text>
                            <Text>{station?.location}</Text>
                        </View>
                        {/* stationMeta */}
                        <View style={styles.MetaConatiner}>
                            <View style={styles.MetaInfo}>
                                <FontAwesome6 name="location-dot" size={18} color="#ff6d1f"/>
                                <View>
                                    <Text>Distance</Text>
                                    <Text>{200}Km</Text>
                                </View>
                            </View>

                            <View style={styles.MetaInfo}>
                                <FontAwesome6 name="clock" size={18} color="#ff6d1f"/>
                                <View>
                                    <Text>Opening</Text>
                                    <Text>24/7</Text>
                                </View>
                            </View>
                        </View>
                        {/* gas types */}
                        <View>
                            <Text style={styles.headingTxt}>Available Gas Types</Text>
                            <View style={styles.gasContainer}>
                                {
                                    station?.fuel.map((gas)=>(
                                        <TouchableOpacity key={gas.name} style={styles.gas}>
                                            <Text>{gas.name}</Text>
                                        </TouchableOpacity>
                                    ))
                                }
                            </View>
                        </View>
                        {/* lowerInfo */}
                        <View style={styles.lowerInfoContainer}>
                            <Text>Price</Text>
                            <View style={styles.priceContainer}>
                                <Text style={styles.price}>Ksh {800}/Ltr</Text>
                                <TouchableOpacity style={styles.orderBtn}>
                                    <Text style={styles.orderTxt}>Order Now!</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </>
            )}
        </ScrollView>
    </SafeAreaView>
  );
}

const styles=StyleSheet.create({
    container:{
        flex:1,
    },
    ImageContainer:{
        width:"100%",
        height:250,
    },
    stationImg:{
        width:"100%",
        height:"100%",
        resizeMode:"cover"
    },
    Stationinfo:{
        padding:15,
        gap:20
    },
    topInfo:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    ratingContainer:{
        flexDirection:'row',
        gap:10,
        paddingTop:5
    },
    ratingTxt:{
        fontSize:16
    },
    stationName:{
        fontWeight:'semibold',
        fontSize:20,
        color:"#00478F"
    },
    likesContainer:{
        flexDirection:'row',
        gap:30
    },
    locationContainer:{
        flexDirection:'column',
        gap:10
    },
    headingTxt:{
        fontWeight:'semibold',
        fontSize:18,
        color:'#525151'
    },
    MetaConatiner:{
        flexDirection:'row',
        justifyContent:'space-between',
    },
    MetaInfo:{
        flexDirection:'row',
        gap:20,
        backgroundColor:'#E3E2E2',
        padding:10,
        width:'43%',
        borderRadius:10
    },
    gasContainer:{
        flexDirection:'row',
        paddingTop:10,
        gap:40
    },
    gas:{
    backgroundColor:'#E3E2E2',
    padding:5,
    width:"25%",
    alignItems:'center',
    borderRadius:10
    },
    lowerInfoContainer:{
        paddingBottom:20
    },
    priceContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
        paddingTop:10,
        paddingBottom:20
    },
    price:{
        fontWeight:'semibold',
        fontSize:24,
        color:"#ff6d1f"
    },
    orderBtn:{
        backgroundColor:"#00478F",
        padding:10,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10
    },
    orderTxt:{
        color:"#fff"
    }
})