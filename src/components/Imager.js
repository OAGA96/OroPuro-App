import React from "react";
import { View, Image, StyleSheet, Text } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp
} from "react-native-responsive-screen";

const Imager = ({ data }) => {
  return (
    <View style={{ flex: 1, backgroundColor: '#E5E6EA' }}>
      <View style={{justifyContent: 'center', alignItems: 'center'}} >
        <Text style={styles.titles} > Codigo: {data[0].CardCode} </Text>
        <Text style={styles.titles} > Nombre: {data[0].CardName} </Text>
        <Text style={styles.titles} > HORA: {data[0].Fecha} </Text>
      </View>
      <Image style={styles.imageStyle} source={{ uri: data[1].uri }} />
    </View>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    width: wp("100%"),
    height: hp("79%")
  },
  titles: {
    color: "#ab000d",
    fontSize: 20,
    fontWeight: "bold"
  }
});

export default Imager;
