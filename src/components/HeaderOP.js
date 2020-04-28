import React from "react";
import { Text, StatusBar, View } from "react-native";
import { Header, Icon } from "react-native-elements";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const HeaderOP = ({ title, onPress, folio }) => {
  return (
    <View>
      <StatusBar backgroundColor="#ab000d" barStyle="light-content" />
      <Header
        containerStyle={{
          backgroundColor: "#E5E6EA",
          justifyContent: "center",
          borderBottomColor: "black",
        }}
        rightContainerStyle={{ flex: 1 }}
        leftContainerStyle={{ flex: 1 }}
        centerContainerStyle={{ flex: 1.5 }}
      >
        <Icon
          name="menu"
          type="ionicons"
          color="#ab000d"
          size={40}
          onPress={onPress}
          iconStyle={{ height: hp("8%"), width: wp("10%") }}
        />
        <Text
          style={{
            justifyContent: "center",
            fontSize: hp("3.5%"),
            fontWeight: "bold",
            color: "#ab000d",
          }}
        >
          {title}
        </Text>
        {folio ? (
          <Text
            style={{
              justifyContent: "center",
              fontSize: wp('4.5%'),
              fontWeight: "bold",
              color: "#0012AB",
              textDecorationLine: 'underline',
              textDecorationColor: '#ab000d',
              letterSpacing: 1.2,
              alignSelf: 'flex-start'
            }}
          >
            #{folio}
          </Text>
        ) : null}
      </Header>
    </View>
  );
};

export default HeaderOP;
