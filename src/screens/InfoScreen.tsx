import {useSafeArea} from 'react-native-safe-area-context';
import React from 'react';
import {Text, View, StyleSheet, FlatList, TouchableNativeFeedback, Modal, Image, TextInput, Button} from 'react-native';
import {Linking} from 'expo';
import {FontAwesome} from "@expo/vector-icons";


const listItems = [
  {
    type: 'non-flight',
    header: 'Helsinki',
    icon: 'map-marker',
    date: '25-12-2019',
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
    date: '25-12-2019',
    header: '',
    icon: 'plane'
  },
  {
    type: 'non-flight',
    header: 'Ho Chi Mihn City',
    icon: 'home',
    date: '26-12-2019',
    previewText:
      'Ho Chi Mhin city (Tunnettiin aijemmin Saigon:na) on Vietnamin siirun kaupunki 8.4 miljoonalla asukkaallaan. ' +
      'Kyseessä on matkamme ensimmäinen kohde, joka sijaitsee eteläisessä vietnamissa. ' +
      'Tärkeimpiin nähtävyyksiin sisältyvät Cu Chui tunnelit ja Ben Than Market.',
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
    date: '29-12-2019',
    header: '',
    icon: 'plane'
  },
  {
    type: 'non-flight',
    header: 'Phu Quoc',
    icon: 'home',
    date: '26-12-2019',
    previewText:
      'Matkamme toinen kohde on Phu Quoc paratiisisaari.',
    mapLink: 'https://www.google.fi/maps/place/Nadine+Phu+Quoc+Resort/@10.1909191,103.9682541,17z/data=!3m1!4b1!4m8!3m7!1s0x31a78c51b884ed1f:0x49a7e895212f444a!5m2!4m1!1i2!8m2!3d10.1909191!4d103.9704428'
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
    date: '03-01-2020',
    header: '',
    icon: 'plane'
  },
  {
    type: 'non-flight',
    header: 'Da Nang',
    icon: 'home',
    date: '26-12-2019',
    previewText:
      'Lentomme saapuu Da Nang suurkaupunkiin, josta kuljetukset Hoi An:iin'
  },
  {
    type: 'non-flight',
    header: 'Hoi An',
    icon: 'home',
    date: '26-12-2019',
    previewText:
      'Hoi An on maailmanperintökohde',
    mapLink: 'https://www.google.fi/maps/place/Gem+Hoi+An+Villa/@15.8868775,108.3318211,17z/data=!3m1!4b1!4m8!3m7!1s0x31420dd869e6f2ef:0xc12909a0a877b0b7!5m2!4m1!1i2!8m2!3d15.8868775!4d108.3340151'
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
    date: '07-01-2020',
    header: '',
    icon: 'plane'
  },
  {
    type: 'non-flight',
    header: 'Pikapysähdys Hanoissa',
    icon: 'bus',
    date: '07-01-2020',
    previewText:
      'Välipysähdys Hanoissa. Jatkamme matkaa bussikuljetuksella seuraavaan kohteeseen.'
  },
  {
    type: 'non-flight',
    header: 'Ha Long Bay',
    icon: 'home',
    date: '07-01-2020',
    previewText:
      'Ha Long Bay on kaunis paikka täynnä saaria. Vietämme yhden yön näillä saarilla.'
  },
  {
    type: 'non-flight',
    header: 'Hanoi',
    icon: 'home',
    date: '08-01-2020',
    previewText:
      'Hanoi on matkamme viimenen kohde ja Vietnamin pääkaupunki.' +
      'Hanoissa asustaa 7.7 miljoonaa ihmistä '
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
    date: '11-01-2020',
    header: '',
    icon: 'plane'
  },
  {
    type: 'non-flight',
    header: 'Hong Kong',
    icon: 'home',
    date: '11-01-2020',
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
    date: '12-01-2020',
    header: '',
    icon: 'plane'
  },
  {
    type: 'non-flight',
    header: 'Helsinki',
    icon: 'map-marker-alt',
    date: '12-01-2019',
    previewText: 'Paluu harmaaseen arkeen'
  },
]


const InfoModal: React.FC = ({isVisible, item, setVisible}) => {
  return <Modal
    animationType="fade"
    transparent={false}
    visible={isVisible}
    onRequestClose={() => {
      setVisible(false)
    }}
  >
    <View style={modalStyles.wrapper}>
      <Button title={'Close'} onPress={() => {
        setVisible(false)
      }}/>
      <Text>Jee modaali!!</Text>
      {item.mapLink &&
      <Button title={'Majoitus kartta sijainti'} onPress={() => {
        Linking.openURL(item.mapLink)
      }}/>
      }
    </View>
    {/*<View style={styles.modal}>*/}
    {/*  {isSaving*/}
    {/*    ? <Text>Saving...</Text>*/}
    {/*    : <View style={styles.modalContent}>*/}
    {/*      <FontAwesome name='close' size={20} style={styles.closeButton} onPress={() => setIsModalVisible(false)} />*/}
    {/*      <TouchableNativeFeedback onPress={onPickImagePress}>*/}
    {/*        {newAvatarUrl*/}
    {/*          ? <Image source={{ uri: newAvatarUrl }} style={styles.currentUserImage} />*/}
    {/*          : <Image source={{ uri: currentUser.avatarUrl }} style={styles.currentUserImage} />*/}
    {/*        }*/}
    {/*      </TouchableNativeFeedback>*/}
    {/*      <TextInput style={styles.textInput} placeholder="Username" value={username} onChangeText={(text) => setUsername(text)}/>*/}
    {/*      <TextInput style={styles.textInput} placeholder="Description" value={description} onChangeText={(text) => setDescription(text)} multiline={true} numberOfLines={2}/>*/}
    {/*      <Button title='Tallenna' onPress={() => onSaveUserPress()} />*/}
    {/*    </View>*/}
    {/*  }*/}
    {/*</View>*/}
  </Modal>
}


const modalStyles = StyleSheet.create({
  wrapper: {
    margin: 10
  }
})


const FlightInfo: React.FC = ({flightInfo}) => {
  return <View style={flightInfoStyles.wrapper}>
    <View style={flightInfoStyles.innerWrapper}>
      <View style={flightInfoStyles.cityContainer}>
        <Text style={flightInfoStyles.city}>{flightInfo.from.name}</Text>
        <Text style={flightInfoStyles.cityTime}>{flightInfo.from.time}</Text>
      </View>
      <FontAwesome style={flightInfoStyles.arrow} name={'arrow-right'} size={20} color={'#8f8f8f'}/>
      <View style={flightInfoStyles.cityContainer}>
        <Text style={flightInfoStyles.city}>{flightInfo.to.name}</Text>
        <Text style={flightInfoStyles.cityTime}>{flightInfo.to.time}</Text>
      </View>
    </View>
    <Text style={flightInfoStyles.durationText}>{flightInfo.duration}</Text>
  </View>
}


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
})


export const InfoScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState(undefined)

  const insets = useSafeArea();

  return (
    <View style={{
      marginTop: insets.top,
      marginBottom: insets.bottom
    }}>
      <React.Fragment>
        {modalVisible &&
        <InfoModal isVisible={modalVisible} item={selectedItem} setVisible={setModalVisible}/>
        }
        <FlatList
          style={styles.topView}
          data={listItems}
          renderItem={({item}) => {
            return <TouchableNativeFeedback
              onPress={() => {
                setModalVisible(true)
                setSelectedItem(item)
              }}
            >
              <View
                style={styles.listItem}
              >
                <View>
                  <FontAwesome
                    name={item.icon}
                    size={24}
                    color={'#5caf8b'}
                    style={styles.listItemIcon}
                  />
                  <View style={styles.circleThing}></View>
                </View>
                <View style={styles.listItemContent}>
                  <View style={styles.headerBlock}>
                    <Text style={styles.infoHeader}>{item.header}</Text>
                    <Text style={styles.dateInfo}>{item.date}</Text>
                  </View>
                  {item.type === 'flight' && <FlightInfo flightInfo={item.flightInfo}/>}
                  {item.type !== 'flight' &&
                  <React.Fragment>
                      <Text>
                        {item.previewText ? item.previewText :
                          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been ' +
                          'the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type' +
                          'and scrambled it to make a type specimen book. It has survived not only five centuries, but ' +
                          'also'
                        }
                      </Text>
                  </React.Fragment>
                  }
                </View>
              </View>
            </TouchableNativeFeedback>
          }}
        />
      </React.Fragment>
    </View>
  );
};


const styles = StyleSheet.create({
  topView: {
    // paddingTop: 50,
    // paddingBottom: 500,
    // paddingVertical: 100,
    // marginVertical: 100,
  },
  circleThing: {
    height: 0,
    width: 15,
    // borderRadius: 11,
    borderTopWidth: 5,
    borderColor: '#459095',
    position: 'absolute',
    top: 0,
    right: -10,
    backgroundColor: '#FFFFFF'
  },
  bordered: {
    borderColor: '#000000',
  },
  listItem: {
    flexDirection: 'row',
  },
  listItemIcon: {
    margin: 20,
    width: 24,
    flex: 0,
  },
  listItemContent: {
    padding: 20,
    borderLeftWidth: 5,
    borderColor: '#459095',
    flex: 1
  },
  dateInfo: {
    fontSize: 14,
    paddingBottom: 10,
    color: '#6a6a6a',
    // alignSelf: 'center'
  },
  infoHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1
  },
  headerBlock: {
    flexDirection: 'row'
  }
});
