import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
// import * as Permissions from "expo-permissions";
import {Permissions} from 'react-native-unimodules';
import {Button, Input, Icon} from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import * as Animatable from 'react-native-animatable';
import OroPuro from '../../API/OroPuro';
import BluetoothSerial from 'react-native-bluetooth-serial-next';
import styles from './styles.login';

const Login = ({navigation}) => {
  //VARIABLES DE ESTADO.
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [showButton, setShowButton] = useState(true);
  const inputUsuario = useRef(null);
  const inputPsswd = useRef(null);

  // useEffect(() => {
  //   userInput.current.focus();
  // }, []);

  const handleFocus = () => {
    inputPsswd.current.focus();
  };

  const discoverDevices = async () => {
    const devices = await BluetoothSerial.listUnpaired();
    devices.map(async res => {
      if (res.id === '98:07:2D:37:D1:DA') {
        await BluetoothSerial.connect(res.id);
      }
    });
  };

  //VALIDA LOS DATOS QUE SE TRAJO DE LA FUNCION getData
  const signIn = async () => {
    const user = JSON.parse(await AsyncStorage.getItem('userSignedIn'));
    if (user.Estado === true) {
      try {
        await BluetoothSerial.connect('98:07:2D:37:D1:DA')
          .then(() => {
            AsyncStorage.setItem('Bluetooth', 'true');
            navigation.navigate('App');
          })
          .catch(() => {
            AsyncStorage.setItem('Bluetooth', 'true');
            navigation.navigate('App');
          });
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    } else {
      Alert.alert('Error', 'Usuario o contraseña incorrecta', [{text: 'OK'}]);
      setLoading(false);
      await AsyncStorage.removeItem('userSignedIn');
    }
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android') {
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        if (status !== 'granted') {
          const {status} = await Permissions.askAsync(Permissions.CAMERA);
        }
      }

      const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await BluetoothSerial.requestEnable();
    })();
  }, []);

  //INDICA LA VERSION DE LA APLICACION.
  const showVersion = () => {
    ToastAndroid.showWithGravityAndOffset(
      'VERSION 0.35',
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };

  //INDICA LA VERSION DE LA APLICACION.
  // useEffect(() => {
  //   (() => {
  //     ToastAndroid.showWithGravityAndOffset(
  //       'VERSION 0.35',
  //       ToastAndroid.LONG,
  //       ToastAndroid.BOTTOM,
  //       25,
  //       50,
  //     );
  //   })();
  // }, []);

  //GUARDA LOS DATOS EN ASYNCSTORAGE EN LA LLAVE "userSignedIn"
  const getData = async () => {
    setLoading(true);
    if (
      name == undefined ||
      name == null ||
      name.length == 0 ||
      password == undefined ||
      password == null ||
      password.length == 0
    ) {
      Alert.alert('Advertencia', 'Ingrese usuario y contraseña.');
      setLoading(false);
    } else {
      try {
        await OroPuro.get(
          `/Login?usuario=${name}@oropuro.com.mx&password=${password}`,
        )
          .then(result => {
            AsyncStorage.setItem(
              'userSignedIn',
              JSON.stringify(result.data[0]),
            );
            signIn();
          })
          .catch(err => {
            alert(err);
            setLoading(false);
          });
      } catch (e) {
        Alert.alert(e);
        setLoading(false);
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{flex: 1}}>
        <View style={styles.contentContainer}>
          <Animatable.View style={styles.cardContainer} animation="flipInY">
            <View style={styles.imageContainer}>
              <Image
                source={require('../../images/logoOroPuro2.png')}
                resizeMode="center"
                style={styles.imageStyle}
              />
            </View>
            <View style={styles.inputsContainer}>
              <Input
                label="Usuario"
                autoCorrect={false}
                autoCompleteType="off"
                returnKeyType="next"
                keyboardType="visible-password"
                labelStyle={styles.inputLabelStyle}
                inputContainerStyle={styles.inputContainerStyle}
                ref={inputUsuario}
                onFocus={() => setShowButton(false)}
                onBlur={() => setShowButton(true)}
                onChangeText={name => setName(name)}
                onSubmitEditing={handleFocus}
              />
              <Input
                label="Contraseña"
                autoCapitalize="none"
                autoCorrect={false}
                autoCompleteType="off"
                secureTextEntry={hidden}
                labelStyle={styles.inputLabelStyle}
                inputContainerStyle={styles.inputContainerStyle}
                ref={inputPsswd}
                onFocus={() => setShowButton(false)}
                onBlur={() => setShowButton(true)}
                onChangeText={password => setPassword(password)}
                onSubmitEditing={() => getData()}
                rightIcon={
                  <Icon
                    name={hidden ? 'eye' : 'eye-with-line'}
                    type="entypo"
                    color="#0012AB"
                    onPress={() =>
                      hidden ? setHidden(false) : setHidden(true)
                    }
                  />
                }
              />
            </View>
            {showButton && (
              <View style={styles.buttonContainer}>
                <Button
                  title="Iniciar Sesion"
                  type="clear"
                  titleStyle={styles.buttonLabel}
                  onPress={() => getData()}
                />
              </View>
            )}
            {loading ? <ActivityIndicator color="#ab000d" /> : null}
          </Animatable.View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Login;
