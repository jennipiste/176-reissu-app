import React, { useState, useEffect } from 'react';
import { Text, View, TouchableWithoutFeedback, AsyncStorage, StyleSheet } from 'react-native';
import Emoji from 'react-native-emoji';

const packingItems = [{
    id: 0,
    label: 'Passi',
    completed: false,
}, {
    id: 1,
    label: 'Hammasharja',
    completed: false,
}, {
    id: 2,
    label: 'Uikkarit',
    completed: false,
}];

interface Items {
    [key: string]: boolean;
}

export const TodoScreen: React.FC = () => {

    const [ completedItems, setCompletedItems ] = useState<Items>({});

    useEffect(() => {
        console.log("fetchCompleted");
        fetchCompleted()
            .then(result => {
                console.log("items", result);
                setCompletedItems(result || {});
            });
    }, []);

    const storeCompleted = async (completedItems: Items) => {
        try {
            await AsyncStorage.setItem('completedItems', JSON.stringify(completedItems));
        } catch (error) {
            // Error saving data
        }
    };

    const fetchCompleted = async () => {
        try {
            return JSON.parse(await AsyncStorage.getItem('completedItems'));
        } catch (error) {
            // Error retrieving data
        }
    };

    const toggleItem = async (id: number) => {
        console.log("toggleItem");
        const completed = completedItems;
        console.log("completed", completedItems);
        completed[id] = !completed[id];
        console.log("new", completed);
        setCompletedItems(completed);
        await storeCompleted(completed);
    };

    return (
        <View>
            <Text>Pakkaa nää messiin:</Text>
            {packingItems.map(item =>
                <TouchableWithoutFeedback
                    key={item.id}
                    onPress={() => toggleItem(item.id)}
                >
                    <View style={styles.view}>
                        {completedItems[item.id] ===  true
                            ? <Emoji
                                name='heavy_check_mark'
                            />
                            : <Emoji
                                name='black_square_button'
                            />
                        }
                        <Text>{item.label}</Text>
                    </View>
                </TouchableWithoutFeedback>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    view: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
    }
});
