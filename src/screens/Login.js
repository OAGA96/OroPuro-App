import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  AsyncStorage,
  ActivityIndicator,
  KeyboardAvoidingView,
  StatusBar,
  Image,
  ToastAndroid
} from "react-native";
import { Button, Input, Card, Icon } from "react-native-elements";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import * as Animatable from "react-native-animatable";
import OroPuro from "../API/OroPuro";

const Login = ({ navigation }) => {
  //VARIABLES DE ESTADO.
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [hidden, setHidden] = useState(true);

  //VALIDA LOS DATOS QUE SE TRAJO DE LA FUNCION getData
  const signIn = async () => {
    const user = JSON.parse(await AsyncStorage.getItem("userSignedIn"));
    if (user.Estado === true) {
      navigation.navigate("App");
    } else {
      Alert.alert("Error", "Usuario o contraseña incorrecta", [{ text: "OK" }]);
      setLoading(false);
      await AsyncStorage.removeItem("userSignedIn");
    }
  };

  //INDICA LA VERSION DE LA APLICACION.
  useEffect(() => {
    (() => {
      ToastAndroid.showWithGravityAndOffset(
        "VERSION 0.35",
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
        25,
        50
      );
    })();
  }, []);

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
      Alert.alert("Advertencia", "Ingrese usuario y contraseña.");
      setLoading(false);
    } else {
      try {
        await OroPuro.get(
          `/*?usuario=${name}@oropuro.com.mx&password=${password}`
        )
          .then(result => {
            AsyncStorage.setItem(
              "userSignedIn",
              JSON.stringify(result.data[0])
            );
            signIn();
          })
          .catch(err => {
            alert(err);
          });
      } catch (e) {
        Alert.alert(e);
      }
    }
  };

  return (
    <Animatable.View style={styles.animatedContainer}>
      <View style={styles.container}>
        <StatusBar backgroundColor="#ab000d" barStyle="light-content" />
        <Animatable.View
          style={styles.animatedCardContainer}
          animation="flipInY"
        >
          <KeyboardAvoidingView style={{ flex: 1 }}>
            <View style={styles.imageContainer}>
              <Image
                source={require("../images/logoOroPuro2.png")}
                resizeMode="center"
              />
            </View>
            <View style={styles.inputsContainer}>
              <Input
                onChangeText={name => setName(name)}
                label="Usuario"
                autoCorrect={false}
                autoCompleteType="off"
                returnKeyType="next"
                keyboardType="visible-password"
                labelStyle={styles.labelStyle}
                inputContainerStyle={styles.border}
              />
              <Input
                onChangeText={password => setPassword(password)}
                label="Contraseña"
                autoCapitalize="none"
                autoCorrect={false}
                autoCompleteType="off"
                secureTextEntry={hidden}
                onSubmitEditing={() => getData()}
                labelStyle={styles.labelStyle}
                inputContainerStyle={styles.border}
                rightIcon={
                  <Icon
                    name="eye"
                    type="entypo"
                    color="#0012AB"
                    onPress={() =>
                      hidden ? setHidden(false) : setHidden(true)
                    }
                  />
                }
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title="Iniciar Sesion"
                type="clear"
                titleStyle={styles.titleButton}
                onPress={() => getData()}
              />
              {loading ? <ActivityIndicator color="#ab000d" /> : null}
            </View>
          </KeyboardAvoidingView>
        </Animatable.View>
      </View>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ab000d",
    marginBottom: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: hp("100%")
  },
  boton: {
    backgroundColor: "#e53935",
    marginTop: 20
  },
  titleButton: {
    color: "#ab000d",
    fontSize: hp("2.5%"),
    marginLeft: 15
  },
  cardContainer: {
    backgroundColor: "#E5E6EA",
    width: wp("85%"),
    marginBottom: hp("8%"),
    borderRadius: 10,
    flex: 0.6
  },
  animatedContainer: {
    flex: 1,
    backgroundColor: "#ab000d"
  },
  animatedCardContainer: {
    // flex: 1
    backgroundColor: "#E5E6EA",
    width: wp("85%"),
    marginBottom: hp("8%"),
    borderRadius: 10,
    flex: 0.6
  },
  imageContainer: {
    // backgroundColor: "red",
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center"
  },
  inputsContainer: {
    // backgroundColor: "blue",
    flex: 0.34
  },
  labelStyle: {
    color: "#ab000d",
    fontSize: 18
  },
  border: {
    borderColor: "#ab000d",
    borderBottomWidth: 1
  },
  buttonContainer: {
    // backgroundColor: "green",
    flex: 0.16
  }
});

export default Login;
