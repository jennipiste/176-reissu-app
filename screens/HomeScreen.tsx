import React from 'react';
import { AsyncStorage } from 'react-native';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';

interface AppState {
    userName: string;
    fact: string;
    isRegistered: boolean;
}

export class HomeScreen extends React.Component<{}, AppState> {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            fact: '',
            isRegistered: false,
        };
    }

    async componentDidMount () {
        this.setState({
            userName: await this.getUserName(),
            isRegistered: await this.getUserName() ? true : false,
        });
    }

    getUserName = async () => {
        return await AsyncStorage.getItem('userName');
    }

    storeUserName = async (userName: string) => {
        return await AsyncStorage.setItem('userName', userName);
    }

    clearAsyncStorage = async() => {
        await AsyncStorage.clear();
        this.setState({
            isRegistered: false,
            userName: '',
            fact: '',
        });
    }

    onSignUp = () => {
        console.log(this.state.userName, this.state.fact);
        this.storeUserName(this.state.userName)
            .then(() => this.setState({
                isRegistered: true,
            }));
    }

    updateUserName = (userName: string) => {
        this.setState({ userName });
    }

    updateFact = (fact: string) => {
        this.setState({ fact });
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.isRegistered
                    ? <Text>Tervetuloa {this.state.userName}</Text>
                    : <View style={styles.view}>
                        <Text>Tää on 176 Vietnam äppi!!</Text>
                        <Text>Lisää ittes matkalle:</Text>
                        <TextInput placeholder="Username" value={this.state.userName} onChangeText={(text) => this.updateUserName(text)}/>
                        <TextInput placeholder="Fun fact about yourself" value={this.state.fact} onChangeText={(text) => this.updateFact(text)}/>
                        <View style={styles.button}>
                            <Button title="Lisää" onPress={this.onSignUp}/>
                        </View>
                    </View>
                }
                <View style={styles.button}>
                    <Button title="Clear" onPress={this.clearAsyncStorage}/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 20,
        paddingVertical: 30,
        paddingHorizontal: 20,
    },

    view: {
        borderColor: 'lightgrey',
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
    },

    button: {
        marginTop: 10,
        marginBottom: 10,
    }
});