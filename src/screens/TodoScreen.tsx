import React, {useState, useEffect} from 'react';
import {useSafeArea} from 'react-native-safe-area-context';
import {Text, View, TouchableWithoutFeedback, StyleSheet, ScrollView} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {Packing, Category, Todo} from '../interfaces';
import firebase from 'firebase';
import {commonStyles, backgroundColor, primaryColor} from '../styles';
import moment from 'moment';
import {START_TIME} from '../constants';

export const TodoScreen: React.FC = () => {

  const [packings, setPackings] = useState<Packing[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [checkedItems, setCheckedItems] = useState<number>(0);

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
  const tripStarted = moment().diff(moment(START_TIME)) > 0;

  const updateTodos = async () => {
    firebase.database().ref(`todos/${userUid}`).on('value', (snapshot) => {
      const result = snapshot.val();
      if (result) {
        const todoList: Packing[] = Object.keys(result).map(key => {
          return result[key];
        });
        setTodos(todoList);
        setTotalItems(todoList.length);
        setCheckedItems(todoList.filter(todo => todo.completed).length);
      }
    });
  };

  useEffect(() => {
    if (tripStarted) {
      updateTodos();
    } else {
      updatePackings();
    }
  }, []);

  const togglePacking = (id: number) => {
    firebase.database().ref(`packings/${userUid}/${id}`).update({
      completed: !packings.find(packing => packing.id === id).completed,
    }).then(() => {
      updatePackings();
    });
  };

  const toggleTodo = (id: number) => {
    firebase.database().ref(`todos/${userUid}/${id}`).update({
      completed: !todos.find(todo => todo.id === id).completed,
    }).then(() => {
      updateTodos();
    });
  };

  return (
    <View style={{
      flex: 1,
      marginTop: insets.top,
      marginBottom: insets.bottom,
      backgroundColor: backgroundColor,
    }}>
      <View style={styles.header}>
        <Text style={commonStyles.title}>{tripStarted ? 'Matkan aikana' : 'Pakkaa mukaan'}</Text>
        <Text style={{...commonStyles.title, textAlign: 'right'}}>{`${checkedItems}/${totalItems}`}</Text>
      </View>
      <View style={styles.view}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          {tripStarted
            ? <>
              {todos.map((item, index) => {
                return <TouchableWithoutFeedback
                  key={item.id}
                  onPress={() => toggleTodo(item.id)}
                >
                  <View style={styles.itemView}>
                    <Ionicons style={{
                      ...styles.icon,
                      color: item.completed === true ? primaryColor : 'lightgray',
                      fontSize: item.completed === true ? 24 : 28,
                    }}
                              name={item.completed === true ? 'ios-checkbox' : 'ios-square-outline'}
                    />
                    <Text style={styles.itemText}>{item.name}</Text>
                  </View>
                </TouchableWithoutFeedback>;
              })}
            </>
            : <>{Object.values(Category).map((category, index) => {
              const filteredPackings = packings.filter(packing => packing.category === category);
              return <React.Fragment key={index}>
                <Text style={styles.category}>{category}</Text>
                {filteredPackings.map(item => {
                  return <TouchableWithoutFeedback
                    key={item.id}
                    onPress={() => togglePacking(item.id)}
                  >
                    <View style={styles.itemView}>
                      <Ionicons style={{
                        ...styles.icon,
                        color: item.completed === true ? primaryColor : 'lightgray',
                        fontSize: item.completed === true ? 24 : 28,
                      }}
                                name={item.completed === true ? 'ios-checkbox' : 'ios-square-outline'}
                      />
                      <Text style={styles.itemText}>{item.name}</Text>
                    </View>
                  </TouchableWithoutFeedback>;
                })}
              </React.Fragment>;
            })}</>
          }
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
    elevation: 10,
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
    height: 24,
    marginTop: 10,
    marginBottom: 10,
  },
  category: {
    ...commonStyles.title,
    marginVertical: 20,
  },
  icon: {
    width: 40,
  },
  itemText: {
    fontSize: 18,
    fontFamily: 'futuramedium',
  }
});
