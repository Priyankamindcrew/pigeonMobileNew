import React, { useState, useEffect, useRef } from "react";
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
import { Dimensions, Image } from "react-native";
import {
  Container,
  HeaderContainer,
  HeadingTextContainer,
  HeadingText,
  ImageLogoContainer,
} from "./style";

export default function Splash({ navigation }) {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace("DriverLogin");
    }, 2000);
  }, []);
  return (
    <Container>
      <HeaderContainer>
        <ImageLogoContainer>
          <Image
            source={require("../../image/favicon.png")}
            style={{
              width: WIDTH * 0.08,
              height: HEIGHT * 0.06,
              alignSelf: "center",
            }}
          />
        </ImageLogoContainer>
        <HeadingTextContainer>
          <HeadingText fontFamily="Poppins-Bold">Gale Delivery</HeadingText>
        </HeadingTextContainer>
      </HeaderContainer>
    </Container>
  );
}
