import React, {useState, useEffect} from 'react';
import {useSafeArea} from 'react-native-safe-area-context';
import {Text, View, Image, TouchableWithoutFeedback, StyleSheet, ScrollView} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {Packing, Category, Todo, User} from '../interfaces';
import firebase from 'firebase';
import {commonStyles, backgroundColor, primaryColor} from '../styles';
import moment from 'moment';
import {START_TIME} from '../constants';


interface ITodoItem {
  completed: boolean;
  id: number;
  name: string;
}

interface IDoneMap {
  [key: string]: string[];
}

interface IUserMap {
  [key: string]: User;
}

interface ICheckboxItemProps {
  item: Todo;
  doneMap: IDoneMap;
  userMap: IUserMap;
}


const CheckboxItem: React.FC<ICheckboxItemProps> = ({item, doneMap, userMap}: ICheckboxItemProps) => {
  return <View style={styles.itemView}>
    <Ionicons style={{
      ...styles.icon,
      color: item.completed === true ? primaryColor : 'lightgray',
    }}
      name={item.completed === true ? 'ios-checkbox' : 'md-square-outline'}
      size={24}
    />
    <View>
      <Text style={styles.itemText}>{item.name}</Text>
      <View style={styles.faceContainer}>
        {(
          doneMap[item.id] !== undefined
        ) && doneMap[item.id].map((userId) => {
          return <React.Fragment
            key={userId}
          >{
            userMap[userId] === undefined ?
              <Text>?</Text> :
              <Image style={styles.faceItem} source={{uri: userMap[userId].avatarUrl}}/>
          }
          </React.Fragment>;
        })}
      </View>
    </View>
  </View>;

};

export const TodoScreen: React.FC = () => {

  const [packings, setPackings] = useState<Packing[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [checkedItems, setCheckedItems] = useState<number>(0);
  const [doneMap, setDoneMap] = useState<IDoneMap>({});
  const [userMap, setUserMap] = useState<IUserMap>({});

  const userUid = firebase.auth().currentUser.uid;
  const insets = useSafeArea();

  useEffect(() => {
    firebase.database().ref('users').on('value', (snapshot) => {
      const result = snapshot.val();
      if (result) {
        setUserMap(result)
      }
    });
  }, []);

  const handleSnapchot = (snapshot) => {
    const result = snapshot.val();

    let newDoneMap: IDoneMap = {}
    if (result) {
      Object.keys(result).forEach(anotherUserId => {
        result[anotherUserId].forEach((todoItem: ITodoItem) => {
          if (todoItem.completed) {
            if (newDoneMap[todoItem.id] === undefined) {
              newDoneMap[todoItem.id] = []
            }
            newDoneMap[todoItem.id] = [...newDoneMap[todoItem.id], anotherUserId]
          }
        })
      })
      setDoneMap(newDoneMap)

      const todoList: Packing[] = Object.keys(result[userUid]).map(key => {
        return result[userUid][key];
      });
      setTodos(todoList);
      setTotalItems(todoList.length);
      setCheckedItems(todoList.filter(todo => todo.completed).length);
    }
  }

  const updatePackings = async () => {
    firebase.database().ref(`packings`).on('value', (snapshot) => {
      handleSnapchot(snapshot)
    });
  };
  const tripStarted = moment().diff(moment(START_TIME)) > 0;

  const updateTodos = async () => {
    firebase.database().ref(`todos`).on('value', (snapshot) => {
      handleSnapchot(snapshot)
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
    console.log('toggle todo called')
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
                  <View>
                    <CheckboxItem
                      item={item}
                      doneMap={doneMap}
                      userMap={userMap}
                    />
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
                    <View>
                      <CheckboxItem item={item} doneMap={doneMap} userMap={userMap}/>
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
    alignItems: 'flex-start',
    marginTop: 10,
    marginBottom: 5,
  },
  category: {
    ...commonStyles.title,
    marginVertical: 20,
  },
  icon: {
    width: 40,
    height: 24,
    justifyContent: 'flex-start',
    display: 'flex',
    alignItems: 'center'
  },
  itemText: {
    fontSize: 18,
    fontFamily: 'futuramedium',
  },
  faceContainer: {
    flexDirection: 'row',
  },
  faceItem: {
    height: 24,
    width: 24,
    borderRadius: 18,
    marginTop: 5,
    marginRight: 3
  }
});
