import React, {useState, useEffect} from 'react';
import {useSafeArea} from 'react-native-safe-area-context';
import {Text, View, Image, TouchableWithoutFeedback, StyleSheet, ScrollView, ActivityIndicator, Platform} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {PackingOrTodo, Category, User} from '../interfaces';
import firebase from 'firebase';
import {commonStyles, backgroundColor, primaryColor, grayLight} from '../styles';
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
  item: PackingOrTodo;
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
              <Image style={styles.faceItem} source={{uri: userMap[userId].avatarUrl, cache: 'force-cache'}}/>
          }
          </React.Fragment>;
        })}
      </View>
    </View>
  </View>;

};

export const TodoScreen: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [todos, setTodos] = useState<PackingOrTodo[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [checkedItems, setCheckedItems] = useState<number>(0);
  const [doneMap, setDoneMap] = useState<IDoneMap>({});
  const [userMap, setUserMap] = useState<IUserMap>({});

  const userUid = firebase.auth().currentUser.uid;
  const insets = useSafeArea();

  useEffect(() => {
    const ref = firebase.database().ref('users');
    const handleSnapshot = (snapshot: firebase.database.DataSnapshot) => {
      const result = snapshot.val();
      if (result) {
        setUserMap(result);
      }
    };
    ref.on('value', handleSnapshot);
    return () => ref.off('value', handleSnapshot);
  }, []);

  const handleSnapchot = (snapshot) => {
    const result = snapshot.val();

    const newDoneMap: IDoneMap = {};
    if (result) {
      Object.keys(result).forEach(anotherUserId => {
        let items = result[anotherUserId];
        if (items.forEach === undefined) {
          // WTF WHY IS THIS NEEDED JENNI EXPLAIN!
          items = Object.values(items);
        }
        items.forEach((todoItem: ITodoItem) => {
          if (todoItem.completed) {
            if (newDoneMap[todoItem.id] === undefined) {
              newDoneMap[todoItem.id] = [];
            }
            newDoneMap[todoItem.id] = [...newDoneMap[todoItem.id], anotherUserId];
          }
        });
      });
      setDoneMap(newDoneMap);

      if (result[userUid] === undefined) {
        return;
      }

      const todoList: PackingOrTodo[] = Object.keys(result[userUid]).map(key => {
        return result[userUid][key];
      });
      setTodos(todoList);
      setTotalItems(todoList.length);
      setCheckedItems(todoList.filter(todo => todo.completed).length);
      setLoading(false)
    }
  };

  const tripStarted = moment().diff(moment(START_TIME)) > 0;
  const [showTripStarted, setShowTripStrated] = useState<boolean>(tripStarted)

  useEffect(() => {
    setDoneMap({});
    setTodos([]);
    setTotalItems(0);
    setCheckedItems(0);
    setLoading(true)

    if (showTripStarted) {
      const ref = firebase.database().ref(`todos`)
      const func = (snapshot) => {
        handleSnapchot(snapshot);
      }
      ref.on('value', func)
      return () => ref.off('value', func)
    } else {
      const ref = firebase.database().ref(`packings`)
      const func = (snapshot) => {
        handleSnapchot(snapshot);
      };
      ref.on('value', func)
      return () => ref.off('value', func)
    }
  }, [showTripStarted]);

  const togglePacking = (id: number) => {
    firebase.database().ref(`packings/${userUid}/${id}`).update({
      completed: !todos.find(packing => packing.id === id).completed,
    }).then(() => {
    });
  };

  const toggleTodo = (id: number) => {
    firebase.database().ref(`todos/${userUid}/${id}`).update({
      completed: !todos.find(todo => todo.id === id).completed,
    }).then(() => {
    });
  };

  return (
    <View style={{
      flex: 1,
      marginTop: insets.top,
      marginBottom: Platform.OS === 'ios' ? 0 : insets.bottom,
      backgroundColor: backgroundColor,
    }}>
      <View style={styles.header}>
        <Text style={commonStyles.title}>{showTripStarted ? 'Matkan aikana' : 'Pakkaa mukaan'}</Text>
        <Text style={{...commonStyles.title, textAlign: 'right'}}>{`${checkedItems}/${totalItems}`}</Text>
      </View>
      <View style={styles.view}>
        {loading ?
          <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <ActivityIndicator size={Platform.OS === 'ios' ? 'large' : 60} color={primaryColor} />
          </View> :
          <ScrollView contentContainerStyle={styles.scrollView}>
            {showTripStarted
              ? <>
                <Text style={styles.changeButton} onPress={() => setShowTripStrated(false)}>Näytä pakkauslista</Text>
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
              : <>
                {tripStarted &&
                <Text style={styles.changeButton} onPress={() => setShowTripStrated(true)}>Näytä matkan aikana</Text>}
                {Object.values(Category).map((category, index) => {
                  const filteredPackings = todos.filter(packing => packing.category === category);
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
                })}
              </>
            }
          </ScrollView>
        }

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
    borderRadius: 12,
    marginTop: 5,
    marginRight: 3
  },
  changeButton: {
    marginBottom: 5,
    textDecorationLine: 'underline',
    color: grayLight,
    fontFamily: 'futuramedium',
  }
});
