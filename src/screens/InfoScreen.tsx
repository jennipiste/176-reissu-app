import {useSafeArea} from 'react-native-safe-area-context';
import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Modal,
  Button,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import {Linking} from 'expo';
import {FontAwesome, Ionicons} from "@expo/vector-icons";
import {commonStyles, backgroundColor, primaryColor, grayDark} from "../styles";
import moment from "moment";


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
  previewText?: string;
  flightInfo?: IFlightInfo;
  stayInfo?: IStayInfo;
}


const listItems: IListItem[] = [
  {
    type: 'non-flight',
    header: 'Helsinki',
    sortableDate: '2019-12-25 14:00',
    previewText: 'Tavataan Helsinki Vantaan lentokentällä. Etkot Oak Barrelissa tai Finnair loungessa klo 14.00.'
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
    sortableDate: '2019-12-25 16:00',
    header: '',
  },
  {
    type: 'non-flight',
    header: 'Ho Chi Minh City',
    sortableDate: '2019-12-26 08:00',
    previewText:
      'Ho Chi Minh City (Tunnettiin aijemmin Saigonina) on Vietnamin suurin kaupunki 8.4 miljoonalla asukkaallaan. ' +
      'Kyseessä on matkamme ensimmäinen kohde, joka sijaitsee eteläisessä Vietnamissa. ' +
      'Tärkeimpiin nähtävyyksiin sisältyvät Cu Chui tunnelit ja Ben Than Market.',
    stayInfo: {
      street: '132 Bến Vân Đồn, Phường 6, Quận 4, Hồ Chí Minh, Vietnam',
      name: 'Thai Anh Millennium Central',
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
    sortableDate: '2019-12-29 15:00',
    header: '',
  },
  {
    type: 'non-flight',
    header: 'Phu Quoc',
    sortableDate: '2019-12-29 16:30',
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
    sortableDate: '2020-01-03 19:00',
    header: '',
  },
  {
    type: 'non-flight',
    header: 'Da Nang',
    sortableDate: '2020-01-03 21:00',
    previewText:
      'Lentomme saapuu Da Nang suurkaupunkiin, josta kuljetukset Hoi Aniin.',
  },
  {
    type: 'non-flight',
    header: 'Hoi An',
    sortableDate: '2020-01-03 23:00',
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
    sortableDate: '2020-01-07 07:00',
    header: '',
  },
  {
    type: 'non-flight',
    header: 'Pikapysähdys Hanoissa',
    sortableDate: '2020-01-07 09:00',
    previewText:
      'Välipysähdys Hanoissa. Jatkamme matkaa bussikuljetuksella seuraavaan kohteeseen.'
  },
  {
    type: 'non-flight',
    header: 'Ha Long Bay',
    sortableDate: '2020-01-07 15:00',
    previewText:
      'Ha Long Bay on kaunis paikka täynnä saaria. Vietämme yhden yön näillä saarilla.',
    stayInfo: {
      street: 'Cat Ba, TT. Cát Bà, Cát Hải, Hai Phong, Vietnam',
      name: 'Dhome homestay',
      mapUri: "https://www.google.com/maps/place/D'home+Homestay+C%C3%A1t+B%C3%A0/@20.7333416,107.0427888,17z/data=!4m11!1m2!2m1!1sDhome+homestay!3m7!1s0x314a454b8fba614b:0x5a96dfc27b8516ce!5m2!4m1!1i2!8m2!3d20.731898!4d107.0477086"
    }

  },
  {
    type: 'non-flight',
    header: 'Hanoi',
    sortableDate: '2020-01-08 21:00',
    previewText:
      'Hanoi on matkamme viimeinen kohde ja Vietnamin pääkaupunki.' +
      'Hanoissa asustaa 7.7 miljoonaa ihmistä ',
    stayInfo: {
      street: '51 Hang Be, Hoan Kiem Hanoi',
      name: 'KemKay Old Quarter',
      mapUri: 'https://www.google.fi/maps/place/Kemkay+Old+Quarter/@21.032545,105.8516663,17z/data=!3m1!4b1!4m8!3m7!1s0x3135abc067c50781:0xab7ab796b27bcc4a!5m2!4m1!1i2!8m2!3d21.032545!4d105.853855'
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
    sortableDate: '2020-01-12 19:00',
    header: '',
  },
  {
    type: 'non-flight',
    header: 'Hong Kong',
    sortableDate: '2020-01-12 22:00',
    previewText:
      'Välipysähdys mielenosoituksistaan tunnetussa Hong Kongissa. ' +
      'Hong Kong on itsehallintoalue Kiinassa. ' +
      'Hong Kong oli myös Englannin viimeinen siirtomaa-alue ennen luovutustaan Kiinalle 1970-luvulla.'
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
    sortableDate: '2020-01-13 01:00',
    header: '',
  },
  {
    type: 'non-flight',
    header: 'Helsinki',
    sortableDate: '2020-01-13 06:00',
    previewText: 'Paluu harmaaseen arkeen'
  },
];
//
//
// const InfoModal: React.FC<{isVisible: boolean, item: any, setVisible: (visible: boolean) => {}}> = ({isVisible, item, setVisible}) => {
//   return <Modal
//     animationType="fade"
//     transparent={false}
//     visible={isVisible}
//     onRequestClose={() => {
//       setVisible(false);
//     }}
//   >
//     <View style={modalStyles.wrapper}>
//       <Button title={'Close'} onPress={() => {
//         setVisible(false);
//       }}/>
//       <Text>Jee modaali!!</Text>
//       {item.mapLink &&
//       <Button title={'Majoitus kartta sijainti'} onPress={() => {
//         Linking.openURL(item.mapLink);
//       }}/>
//       }
//     </View>
//   </Modal>;
// };
//
//
// const modalStyles = StyleSheet.create({
//   wrapper: {
//     margin: 10
//   }
// });


const FlightInfo: React.FC<{ flightInfo: IFlightInfo, past: boolean }> = ({flightInfo, past}) => {
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
    color: '#bababa',
    fontFamily: 'futuramedium',
  },
  arrow: {
    alignSelf: 'center',
    paddingHorizontal: 20
  },
  city: {
    // fontWeight: 'bold',
    fontSize: 26,
    // flex: 1,
    alignSelf: 'center',
    fontFamily: 'futuramedium',
  },
  cityTime: {
    fontSize: 12,
    color: '#acacac',
    alignSelf: 'center',
    // marginTop: -5,
    fontFamily: 'futuramedium',
  },
  cityContainer: {
    //   justifyContent: 'center'
  }
});


const pastColor = '#c8c8c8';
const hilightColor = primaryColor;


export const InfoScreen: React.FC = () => {

  const nowString = moment(
    // '2020-01-04T20:48:00.000'
    // '2019-12-25'
  ).format('YYYY-MM-DD HH:mm')
  let currentIndex = -1

  for (let i = 0; i < listItems.length - 2; i++) {
    if (listItems[i].sortableDate > listItems[i + 1].sortableDate) {
      alert(`NOTE: Incorrectly sorted listItems ${listItems[i].sortableDate} ${listItems[i + 1].sortableDate}`)
    }
  }
  for (let i = 0; i < listItems.length - 1; i++) {
    if (
      nowString >= listItems[i].sortableDate &&
      (
        currentIndex < 0 ||
        listItems[currentIndex].sortableDate !== listItems[i].sortableDate
      )
    ) {
      currentIndex = i
    }
  }

  const insets = useSafeArea();

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
            const dateString = moment(item.sortableDate, 'YYYY-MM-DD HH:mm').format('DD.MM.')

            return <View
              style={styles.listItem}
              key={index}
            >
              <View style={index !== listItems.length - 1 ? styles.dateTextContainer : {}}>
                <Text
                  style={{...styles.dateText, color: thisColor}}
                >{dateString}</Text>
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
                {item.type === 'flight' && <FlightInfo flightInfo={item.flightInfo} past={index < currentIndex}/>}
                {item.type !== 'flight' &&
                <React.Fragment>
                    <Text style={{...styles.infoHeader, color: thisColor}}>{item.header}</Text>
                  {
                    item.stayInfo && <TouchableOpacity
                        onPress={() => {
                          Linking.openURL(item.stayInfo.mapUri);
                        }}
                    >
                        <View style={styles.homeIconContainer}>
                            <FontAwesome name={'home'} size={24} color={thisColor}/>
                            <View style={styles.homeIconInfoContainer}>
                                <Text style={{...styles.homeIconHeader, color: thisColor}}>{item.stayInfo.name}</Text>
                                <Text style={{
                                  ...styles.homeIconAddress,
                                  color: index < currentIndex ? pastColor : grayDark
                                }}>{item.stayInfo.street}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                  }
                    <Text style={{color: index < currentIndex ? pastColor : grayDark, fontFamily: 'futuramedium'}}>
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
    fontFamily: 'futuramedium',
  },
  homeIconAddress: {
    fontSize: 10,
    textDecorationLine: 'underline',
    textDecorationColor: grayDark,
    fontFamily: 'futuramedium',
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
    fontFamily: 'futuramedium',
    width: 80,
    textAlign: 'right',
    marginTop: -7 - 15 + 2
  },
  topView: {},
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
    flex: 1,
    borderRadius: 10,
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
  },
  infoHeader: {
    fontSize: 22,
    fontFamily: 'futuramedium',
    fontWeight: '400',
    flex: 1
  },
  headerBlock: {
    flexDirection: 'row'
  }
});
