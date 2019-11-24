import React, { useState, useEffect } from 'react';
import { Text, View, TouchableWithoutFeedback, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Packing, Category } from '../interfaces';
import firebase from 'firebase';

export const TodoScreen: React.FC = () => {

    const [ packings, setPackings ] = useState<Packing[]>([]);

    const userUid = firebase.auth().currentUser.uid;

    const updatePackings = async () => {
        firebase.database().ref(`packings/${userUid}`).on('value', (snapshot) => {
            const result = snapshot.val();
            if (result) {
                const packingList = Object.keys(result).map(key => {
                    return result[key];
                });
                setPackings(packingList);
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
        <ScrollView style={styles.view}>
            <Text style={styles.title}>Ota mukaan</Text>
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
                                <FontAwesome style={styles.icon} name={item.completed ===  true ? 'check-square-o' : 'square-o'} />
                                <Text>{item.name}</Text>
                            </View>
                        </TouchableWithoutFeedback>;
                    })}
                </React.Fragment>;
            })}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    view: {
        paddingVertical: 30,
        paddingHorizontal: 20,
    },
    itemView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 20,
    },
    title: {
        textAlign: 'center',
        marginTop: 10,
        fontSize: 18,
    },
    category: {
        fontSize: 18,
        textTransform: 'uppercase',
        marginTop: 10,
    },
    icon: {
        marginRight: 20,
        fontSize: 20,
    }
});
