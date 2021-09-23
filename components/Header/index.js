import React, { useState, useEffect, useRef } from "react";
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { ScrollView, Dimensions, Image, View, Text } from "react-native";
import {
  HeaderContainer,
  ContainerOne,
  ContainerTwo,
  ContainerThree,
  HeadingText,
  ImageIconOne,
  ImageIconThree,
  ContainerTwoNoBackBtn,
  ContainerThreeNoBackBtn,
  HeadingTextNoBackBtn,
} from "./style";

export default function Header(props) {
  console.log("nav-props=======>", props);
  return (
    <HeaderContainer>
      {props.showBackBTN ? (
        <>
          <ContainerOne onPress={() => props.navigation.goBack()}>
            <ImageIconOne
              source={require("../../image/backarrow4.jpeg")}
              style={{
                width: 20,
                height: 20,
              }}
            />
          </ContainerOne>
          <ContainerTwo>
            <HeadingText fontFamily="Poppins-Bold">
              {props.HeadingText}
            </HeadingText>
          </ContainerTwo>
          <ContainerThree>
            <ImageIconThree
              source={require("../../image/headerNotification.png")}
            />
          </ContainerThree>
        </>
      ) : (
        <>
          <ContainerTwoNoBackBtn>
            <HeadingTextNoBackBtn fontFamily="Poppins-Bold">
              {props.HeadingText}
            </HeadingTextNoBackBtn>
          </ContainerTwoNoBackBtn>
          <ContainerThreeNoBackBtn>
            <ImageIconThree
              source={require("../../image/headerNotification.png")}
            />
          </ContainerThreeNoBackBtn>
        </>
      )}
    </HeaderContainer>
  );
}
