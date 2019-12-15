import {useSafeArea} from 'react-native-safe-area-context';
import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Modal,
  Button,
  ScrollView, TouchableNativeFeedback
} from 'react-native';
import {Linking} from 'expo';
import {FontAwesome, Ionicons} from "@expo/vector-icons";
import {commonStyles, backgroundColor, primaryColor, grayDark} from "../styles";


interface IFlightInfoDest {
  name: string;
  time: string;
}


interface IFlightInfo {
  from: IFlightInfoDest;
  to: IFlightInfoDest;
  duration: string;
  flightNumber: string;
}


interface IStayInfo {
  name: string;
  street: string;
  mapUri: string;
}


interface IListItem {
  type: string;
  header: string;
  sortableDate: string;
  date: string;
  previewText?: string;
  flightInfo?: IFlightInfo;
  stayInfo?: IStayInfo;
}


const listItems: IListItem[] = [
  {
    type: 'non-flight',
    header: 'Helsinki',
    sortableDate: '25-12-2019',
    date: '25.12.',
    previewText: 'Tavataan Helsinki Vantaa lentokenltällä. Etkot Oak Barrelissa tai finnair longuessa klo 14.00'
  },
  // Helsinki Hanoi
  {
    type: 'flight',
    flightInfo: {
      from: {
        name: 'HEL',
        time: '16:15'
      },
      to: {
        name: 'SGN',
        time: '7:55(+1)'
      },
      duration: '10h 40min',
      flightNumber: 'AY161'
    },
    sortableDate: '25-12-2019',
    date: '25.12.',
    header: '',
  },
  {
    type: 'non-flight',
    header: 'Ho Chi Mihn City',
    sortableDate: '26-12-2019',
    date: '26.12.',
    previewText:
      'Ho Chi Mhin city (Tunnettiin aijemmin Saigon:na) on Vietnamin siirun kaupunki 8.4 miljoonalla asukkaallaan. ' +
      'Kyseessä on matkamme ensimmäinen kohde, joka sijaitsee eteläisessä vietnamissa. ' +
      'Tärkeimpiin nähtävyyksiin sisältyvät Cu Chui tunnelit ja Ben Than Market.',
    stayInfo: {
      street: '132 Bến Vân Đồn, Phường 6, Quận 4, Hồ Chí Minh, Vietnam',
      name: 'Thai Anh Millennium Celtran',
      mapUri: 'https://www.google.fi/maps/place/Thai+Anh+Millennium+Celtran/@10.7635078,106.6988989,19z/data=!4m8!3m7!1s0x31752f683c98dcf7:0xa4c6f8b241c69247!5m2!4m1!1i2!8m2!3d10.7635078!4d106.6994461?shorturl=1'
    }
  },
  // Ho chi imhn phu quoc
  {
    type: 'flight',
    flightInfo: {
      from: {
        name: 'SGN',
        time: '15:40'
      },
      to: {
        name: 'PQC',
        time: '16:35'
      },
      duration: '55min',
      flightNumber: 'VJ327'
    },
    sortableDate: '29-12-2019',
    date: '29.12.',
    header: '',
  },
  {
    type: 'non-flight',
    header: 'Phu Quoc',
    sortableDate: '26-12-2019',
    date: '26.12.',
    previewText:
      'Matkamme toinen kohde on Phu Quoc paratiisisaari.',
    stayInfo: {
      street: 'Group 4, Cửa Lấp, tỉnh Kiên Giang, Vietnam',
      name: 'Nadine Phu Quoc Resort',
      mapUri: 'https://www.google.fi/maps/place/Nadine+Phu+Quoc+Resort/@10.1909191,103.9682541,17z/data=!3m1!4b1!4m8!3m7!1s0x31a78c51b884ed1f:0x49a7e895212f444a!5m2!4m1!1i2!8m2!3d10.1909191!4d103.9704428'
    }
  },
  // Phu quoc da nang
  {
    type: 'flight',
    flightInfo: {
      from: {
        name: 'PQC',
        time: '19:00'
      },
      to: {
        name: 'DAD',
        time: '20:50'
      },
      duration: '1h 50min',
      flightNumber: 'BL840'
    },
    sortableDate: '03-01-2020',
    date: '3.1.',
    header: '',
  },
  {
    type: 'non-flight',
    header: 'Da Nang',
    sortableDate: '26-12-2019',
    date: '26.12.',
    previewText:
      'Lentomme saapuu Da Nang suurkaupunkiin, josta kuljetukset Hoi An:iin',
  },
  {
    type: 'non-flight',
    header: 'Hoi An',
    sortableDate: '26-12-2019',
    date: '26.12.',
    previewText:
      'Hoi An on maailmanperintökohde',
    stayInfo: {
      street: 'Sơn Phong, Hội An, Quang Nam Province, Vietnam',
      name: 'Gem Hoi An Villa',
      mapUri: 'https://www.google.fi/maps/place/Gem+Hoi+An+Villa/@15.8863012,108.333255,18.47z/data=!4m8!3m7!1s0x0:0xc12909a0a877b0b7!5m2!4m1!1i2!8m2!3d15.8868775!4d108.3340151'
    }
  },
  // da nang hanoi
  {
    type: 'flight',
    flightInfo: {
      from: {
        name: 'DAD',
        time: '7:00'
      },
      to: {
        name: 'HAN',
        time: '8:20'
      },
      duration: '1h 20min',
      flightNumber: 'VJ534'
    },
    sortableDate: '07-01-2020',
    date: '7.1.',
    header: '',
  },
  {
    type: 'non-flight',
    header: 'Pikapysähdys Hanoissa',
    sortableDate: '07-01-2020',
    date: '7.1.',
    previewText:
      'Välipysähdys Hanoissa. Jatkamme matkaa bussikuljetuksella seuraavaan kohteeseen.'
  },
  {
    type: 'non-flight',
    header: 'Ha Long Bay',
    sortableDate: '07-01-2020',
    date: '7.1.',
    previewText:
      'Ha Long Bay on kaunis paikka täynnä saaria. Vietämme yhden yön näillä saarilla.',
    stayInfo: {
      street: 'xxxx',
      name: 'xxxxx',
      mapUri: 'https://www.google.fi/maps/place/51+H%C3%A0ng+B%C3%A8,+H%C3%A0ng+B%E1%BA%A1c,+Ho%C3%A0n+Ki%E1%BA%BFm,+H%C3%A0+N%E1%BB%99i,+Vietnam/@21.0324095,105.8518956,1117m/data=!3m1!1e3!4m13!1m7!3m6!1s0x3135abc067c50781:0x3fa66f024d5a018d!2zNTEgSMOgbmcgQsOoLCBIw6BuZyBC4bqhYywgSG_DoG4gS2nhur9tLCBIw6AgTuG7mWksIFZpZXRuYW0!3b1!8m2!3d21.032545!4d105.853855!3m4!1s0x3135abc067c50781:0x3fa66f024d5a018d!8m2!3d21.032545!4d105.853855'
    }

  },
  {
    type: 'non-flight',
    header: 'Hanoi',
    sortableDate: '08-01-2020',
    date: '8.1.',
    previewText:
      'Hanoi on matkamme viimenen kohde ja Vietnamin pääkaupunki.' +
      'Hanoissa asustaa 7.7 miljoonaa ihmistä ',
    stayInfo: {
      street: '51 Hàng Bè',
      name: 'xxxxx',
      mapUri: 'https://www.google.fi/maps/place/51+H%C3%A0ng+B%C3%A8,+H%C3%A0ng+B%E1%BA%A1c,+Ho%C3%A0n+Ki%E1%BA%BFm,+H%C3%A0+N%E1%BB%99i,+Vietnam/@21.0324095,105.8518956,1117m/data=!3m1!1e3!4m13!1m7!3m6!1s0x3135abc067c50781:0x3fa66f024d5a018d!2zNTEgSMOgbmcgQsOoLCBIw6BuZyBC4bqhYywgSG_DoG4gS2nhur9tLCBIw6AgTuG7mWksIFZpZXRuYW0!3b1!8m2!3d21.032545!4d105.853855!3m4!1s0x3135abc067c50781:0x3fa66f024d5a018d!8m2!3d21.032545!4d105.853855'
    }
  },
  // Takas Helsinkiin
  {
    type: 'flight',
    flightInfo: {
      from: {
        name: 'HAN',
        time: '19:10'
      },
      to: {
        name: 'HKG',
        time: '22:00'
      },
      duration: '1h 50min',
      flightNumber: 'HX529'
    },
    sortableDate: '11-01-2020',
    date: '11.1.',
    header: '',
  },
  {
    type: 'non-flight',
    header: 'Hong Kong',
    sortableDate: '11-01-2020',
    date: '11.1.',
    previewText:
      'Välipys mielenosoituksistaan tunnetussa Hong Kong:ssa. ' +
      'Hong Kong itsehallintoalue Kiinassa. ' +
      'Hong Kong oli myös Englannin viimeinen siirtomaa-alue ennen luovutustaan Kiinalle 1970+luvulla.'
  },
  {
    type: 'flight',
    flightInfo: {
      from: {
        name: 'HKG',
        time: '00:45'
      },
      to: {
        name: 'HEL',
        time: '5:25'
      },
      duration: '10h 40min',
      flightNumber: 'AY100'
    },
    sortableDate: '12-01-2020',
    date: '12.1.',
    header: '',
  },
  {
    type: 'non-flight',
    header: 'Helsinki',
    sortableDate: '12-01-2020',
    date: '12.1.',
    previewText: 'Paluu harmaaseen arkeen'
  },
];


const InfoModal: React.FC<{isVisible: boolean, item: any, setVisible: (visible: boolean) => {}}> = ({isVisible, item, setVisible}) => {
  return <Modal
    animationType="fade"
    transparent={false}
    visible={isVisible}
    onRequestClose={() => {
      setVisible(false);
    }}
  >
    <View style={modalStyles.wrapper}>
      <Button title={'Close'} onPress={() => {
        setVisible(false);
      }}/>
      <Text>Jee modaali!!</Text>
      {item.mapLink &&
      <Button title={'Majoitus kartta sijainti'} onPress={() => {
        Linking.openURL(item.mapLink);
      }}/>
      }
    </View>
  </Modal>;
};


const modalStyles = StyleSheet.create({
  wrapper: {
    margin: 10
  }
});


const FlightInfo: React.FC<{flightInfo: IFlightInfo, past: boolean}> = ({flightInfo, past}) => {
  return <View style={flightInfoStyles.wrapper}>
    <View style={flightInfoStyles.innerWrapper}>
      <View style={flightInfoStyles.cityContainer}>
        <Text style={{...flightInfoStyles.city, color: past ? pastColor : '#000'}}>{flightInfo.from.name}</Text>
        <Text style={flightInfoStyles.cityTime}>{flightInfo.from.time}</Text>
      </View>
      <Ionicons style={flightInfoStyles.arrow} name={'ios-airplane'} size={26} color={past ? pastColor : '#000'}/>
      <View style={flightInfoStyles.cityContainer}>
        <Text style={{...flightInfoStyles.city, color: past ? pastColor : '#000'}}>{flightInfo.to.name}</Text>
        <Text style={flightInfoStyles.cityTime}>{flightInfo.to.time}</Text>
      </View>
    </View>
    <Text style={flightInfoStyles.durationText}>{flightInfo.duration}</Text>
  </View>;
};


const flightInfoStyles = StyleSheet.create({
  innerWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  wrapper: {
    alignItems: 'center'
  },
  durationText: {
    marginTop: -30,
    fontSize: 10,
    color: '#bababa'
  },
  arrow: {
    alignSelf: 'center',
    paddingHorizontal: 20
  },
  city: {
    // fontWeight: 'bold',
    fontSize: 26,
    // flex: 1,
    alignSelf: 'center'
  },
  cityTime: {
    fontSize: 12,
    color: '#acacac',
    alignSelf: 'center',
    marginTop: -5
  },
  cityContainer: {
    //   justifyContent: 'center'
  }
});


const pastColor = '#c8c8c8';
const hilightColor = primaryColor;


export const InfoScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(undefined);

  const insets = useSafeArea();

  const currentIndex = 2;

  return (
    <ScrollView style={{
      marginTop: insets.top,
      marginBottom: insets.bottom,
      backgroundColor: backgroundColor
    }}>
      <React.Fragment>
        <View style={styles.header}>
          <Text style={{...commonStyles.title, width: 100}}>Info</Text>
        </View>
        <View
          style={{paddingTop: 10}}
        >
          {listItems.map((item: IListItem, index) => {
            const thisColor = index === currentIndex ? hilightColor : (index < currentIndex ? pastColor : '#000000');

            return <View
              style={styles.listItem}
            >
              <View style={index !== listItems.length - 1 ? styles.dateTextContainer : {}}>
                <Text
                  style={{...styles.dateText, color: thisColor}}
                >{item.date}</Text>
                {currentIndex === index && <View
                    style={styles.circleThing}
                />}
                <View
                  style={{...styles.circleThingInner, backgroundColor: thisColor}}
                />
              </View>
              <View
                style={{...styles.listItemContent, ...(index === currentIndex ? {backgroundColor: '#EEE3FE'} : {})}}>
                <View style={{...styles.arrowThing, ...(index === currentIndex ? {borderRightColor: '#EEE3FE'} : {})}}/>
                {item.type === 'flight' && <FlightInfo flightInfo={item.flightInfo} past={index <  currentIndex}/>}
                {item.type !== 'flight' &&
                <React.Fragment>
                    <Text style={{...styles.infoHeader, color: thisColor}}>{item.header}</Text>
                  {
                    item.stayInfo && <TouchableNativeFeedback
                      onPress={() => {
                        Linking.openURL(item.stayInfo.mapUri);
                      }}
                    >
                        <View style={styles.homeIconContainer}>
                            <FontAwesome name={'home'} size={24} color={thisColor}/>
                            <View style={styles.homeIconInfoContainer}>
                                <Text style={{...styles.homeIconHeader, color: thisColor}}>{item.stayInfo.name}</Text>
                                <Text style={{...styles.homeIconAddress, color: index <  currentIndex ? pastColor : grayDark}}>{item.stayInfo.street}</Text>
                            </View>
                        </View>
                    </TouchableNativeFeedback>
                  }
                    <Text style={{color: index <  currentIndex ? pastColor : grayDark}}>
                      {item.previewText}
                    </Text>
                </React.Fragment>
                }
              </View>
            </View>;
          })}
        </View>
      </React.Fragment>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  homeIconHeader: {
    fontSize: 14,
  },
  homeIconAddress: {
    fontSize: 10,
    textDecorationLine: 'underline',
    textDecorationColor: grayDark,
  },
  homeIconInfoContainer: {
    paddingLeft: 5
  },
  homeIconContainer: {
    flexDirection: 'row',
    paddingTop: 5,
    paddingBottom: 5
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 30,
  },
  arrowThing: {
    position: 'absolute',
    left: -10,
    top: 15,
    width: 0,
    height: 0,
    borderRightColor: '#fff',
    borderRightWidth: 10,
    borderTopColor: 'transparent',
    borderTopWidth: 10,
    borderBottomColor: 'transparent',
    borderBottomWidth: 10,
  },
  dateTextContainer: {
    borderRightColor: 'black',
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  dateText: {
    padding: 15,
    fontSize: 14,
    fontWeight: 'bold',
    width: 80,
    textAlign: 'right',
    marginTop: -7 - 15 + 2
  },
  topView: {
  },
  circleThingInner: {
    height: 10,
    width: 10,
    margin: 5,
    borderRadius: 5,
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: hilightColor,
  },
  circleThing: {
    height: 20,
    width: 20,
    borderRadius: 10,
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: hilightColor,
    opacity: 0.3
  },
  bordered: {
    borderColor: '#000000',
  },
  listItem: {
    flexDirection: 'row',
    // backgroundColor: 'red',
    marginBottom: -1
  },
  listItemIcon: {
    margin: 20,
    width: 24,
    flex: 0,
  },
  listItemContent: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    // borderLeftWidth: 5,
    flex: 1,
    // borderColor: 'black',
    borderRadius: 10,
    // borderWidth: 1,
    marginRight: 20,
    marginLeft: 30,
    marginTop: -20,
    marginBottom: 40,
    backgroundColor: '#fff',
    elevation: 5,
  },
  dateInfo: {
    fontSize: 14,
    paddingBottom: 10,
    color: '#6a6a6a',
    // alignSelf: 'center'
  },
  infoHeader: {
    fontSize: 22,
    fontWeight: '400',
    flex: 1
  },
  headerBlock: {
    flexDirection: 'row'
  }
});
