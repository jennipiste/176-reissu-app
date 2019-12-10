import React, { useState, useEffect } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import { Text, View, TouchableWithoutFeedback, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Packing, Category } from '../interfaces';
import firebase from 'firebase';

export const TodoScreen: React.FC = () => {

    const [ packings, setPackings ] = useState<Packing[]>([]);
    const [ totalItems, setTotalItems ] = useState<number>(0);
    const [ checkedItems, setCheckedItems ] = useState<number>(0);

    const userUid = firebase.auth().currentUser.uid;

    const insets = useSafeArea();

    const updatePackings = async () => {
        firebase.database().ref(`packings/${userUid}`).on('value', (snapshot) => {
            const result = snapshot.val();
            if (result) {
                const packingList: Packing[] = Object.keys(result).map(key => {
                    return result[key];
                });
                setPackings(packingList);
                setTotalItems(packingList.length);
                setCheckedItems(packingList.filter(packing => packing.completed).length);
            }
        });
    };

    useEffect(() => {
        updatePackings();
    }, []);

    const toggleItem = (id: number) => {
        firebase.database().ref(`packings/${userUid}/${id}`).update({
            completed: !packings.find(packing => packing.id === id).completed,
        }).then(() => {
            updatePackings();
        });
    };

    return (
        <View style={{
            flex: 1,
            marginTop: insets.top,
            marginBottom: insets.bottom,
            backgroundColor: '#F1F3FD',
        }}>
            <View style={styles.header}>
                <Text style={styles.title}>Pakkaa mukaan</Text>
                <Text style={styles.title}>{`${checkedItems}/${totalItems}`}</Text>
            </View>
            <View style={styles.view}>
                <ScrollView style={styles.scrollView}>
                    {Object.values(Category).map((category, index) => {
                        const filteredPackings = packings.filter(packing => packing.category === category);
                        return <React.Fragment key={index}>
                            <Text style={styles.category}>{category}</Text>
                            {filteredPackings.map(item => {
                                return <TouchableWithoutFeedback
                                    key={item.id}
                                    onPress={() => toggleItem(item.id)}
                                >
                                    <View style={styles.itemView}>
                                        <Ionicons style={{
                                            ...styles.icon,
                                            color: item.completed ===  true ? '#7800F9' : 'lightgray',
                                            fontSize: item.completed ===  true ? 24 : 28,
                                        }}
                                            name={item.completed ===  true ? 'ios-checkbox' : 'ios-square-outline'}
                                        />
                                        <Text>{item.name}</Text>
                                    </View>
                                </TouchableWithoutFeedback>;
                            })}
                        </React.Fragment>;
                    })}
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 30,
    },
    view: {
        flex: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 5,
        backgroundColor: '#FFF',
    },
    scrollView: {
        paddingHorizontal: 30,
        paddingVertical: 20,
    },
    itemView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    category: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 20,
    },
    icon: {
        marginRight: 20,
    }
});
