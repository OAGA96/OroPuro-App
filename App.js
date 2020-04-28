import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Button,
  StatusBar,
  StyleSheet,
  View,
  AsyncStorage
} from "react-native";
import {
  AntDesign,
  Ionicons,
  FontAwesome,
  Entypo,
  Feather,
  MaterialIcons,
  EvilIcons
} from "@expo/vector-icons";

//NAVEGADORES NECESARIOS PARA TENER UN FLUJO DE AUTENTICACION CON DRAWER.
import { createSwitchNavigator, createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator } from "react-navigation-drawer";

//AQUI SE IMPORTAN TODAS LAS PANTALLAS DE LA APLICACION.
import Inicio from "./src/screens/Inicio";
import Login from "./src/screens/Login";
import Other from "./src/screens/Other";
import Camara from "./src/screens/Camara";
import Clientes from "./src/screens/Clientes";
import Configuracion from "./src/screens/Configuracion";
import Inventario from "./src/screens/Inventario";
import Venta from "./src/screens/Venta";
import Historial from "./src/screens/Historial";
import Liquidacion from "./src/screens/Liquidacion";
import ClientesPorVisitar from "./src/screens/ClientesPorVisitar";
import CamaraPicture from "./src/screens/CamaraPicture";
import PictureEvidence from "./src/screens/PictureEvidence";
import CameraQR from './src/screens/CameraQR';
import EditarVenta from './src/screens/EditarVenta';

//VISTA QUE CHECA SI EXISTE EL TOKEN 'userSignedIn', SI EXISTE REDIRIGE A 'App'.
const AuthLoadingScreen = ({ navigation }) => {
  checkLogin = async () => {
    const userToken = await AsyncStorage.getItem("userSignedIn");

    navigation.navigate(userToken ? "App" : "Auth");
  };

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator />
      <StatusBar barStyle="default" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});

//NAVEGADOR QUE CONTIENE LAS PANTALLAS DE LA APLICACION EN UN DRAWER
const AppStack = createDrawerNavigator(
  {
    Inicio: {
      screen: Inicio,
      navigationOptions: {
        drawerLabel: "Inicio",
        drawerIcon: ({ tintColor }) => (
          <FontAwesome name="address-book-o" size={18} />
        )
      }
    },
    // Other: {
    //   screen: Other,
    //   navigationOptions: {
    //     drawerLabel: "Other",
    //     drawerIcon: ({ tintColor }) => (
    //       <Feather name="map-pin" size={18} />
    //     )
    //   }
    // },
    // Camara: {
    //   screen: Camara,
    //   navigationOptions: {
    //     drawerLabel: () => null
    //   }
    // },
    Clientes: {
      screen: Clientes,
      navigationOptions: {
        drawerLabel: "Clientes",
        drawerIcon: ({ tintColor }) => <FontAwesome name="users" size={18} />
      }
    },
    PorVisitar: {
      screen: ClientesPorVisitar,
      navigationOptions: {
        drawerLabel: "Por Visitar",
        drawerIcon: ({ tintColor }) => <Feather name="user-check" size={18} />
      }
    },
    // Inventario: {
    //   screen: Inventario,
    //   navigationOptions: {
    //     drawerLabel: "Inventario",
    //     drawerIcon: ({ tintColor }) => <Feather name="box" size={18} />
    //   }
    // },
    Historial: {
      screen: Historial,
      navigationOptions: {
        drawerLabel: "Historial",
        drawerIcon: ({ tintColor }) => <FontAwesome name="history" size={18} />
      }
    },
    PictureEvidence: {
      screen: PictureEvidence,
      navigationOptions: {
        drawerLabel: "Evidencia",
        drawerIcon: ({ tintColor }) => <EvilIcons name='archive' size={18} />
      }
    },
    Liquidacion: {
      screen: Liquidacion,
      navigationOptions: {
        drawerLabel: "Liquidacion",
        drawerIcon: ({ tintColor }) => (
          <MaterialIcons name="money-off" size={18} />
        )
      }
    },
    Configuracion: {
      screen: Configuracion,
      navigationOptions: {
        drawerLabel: "Configuracion",
        drawerIcon: ({ tintColor }) => <AntDesign name="setting" size={18} />
      }
    },
    CameraQR: {
      screen: CameraQR,
      navigationOptions: {
        drawerLabel: () => null
      }
    },
    Venta: {
      screen: Venta,
      navigationOptions: {
        drawerLabel: () => null
      }
    },
    CamaraPicture: {
      screen: CamaraPicture,
      navigationOptions: {
        drawerLabel: () => null
      }
    },
    EditarVenta : {
      screen: EditarVenta,
      navigationOptions:{
        drawerLabel: () => null
      }
    }
  },
  {
    initialRouteName: "Inicio",
    contentOptions: {
      activeTintColor: "#e91e63"
    }
  }
);

//NAVEGADOR QUE CONTIENE SOLO EL LOGIN DE LA APLICACION
const AuthStack = createStackNavigator({
  Login: {
    screen: Login,
    navigationOptions: {
      headerShown: false
    }
  }
});

//SE EXPORTA UN NAVEGADOR SWITCH PARA EL FLUJO DE AUTENTICACION. PRIMERO PASA POR 'AuthLoadingScreen'
export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack
    },
    {
      initialRouteName: "AuthLoading"
    }
  )
);
