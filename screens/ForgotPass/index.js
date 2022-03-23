import React, { useState, useEffect, useRef } from "react";
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
import axios from "axios";
import {
  ScrollView,
  Dimensions,
  TextInput,
  Image,
  Keyboard,
} from "react-native";
import {
  Container,
  HeaderContainer,
  HeadingTextContainer,
  HeadingText,
  ImageLogoContainer,
  FormContainer,
  InputFieldContainer,
  Separator,
  ButtonContainer,
  ButtonText,
  BacktoLoginContainer,
  ArrowContainer,
  BackTextContainer,
  BackToLoginText,
} from "./style";
import Toast, { DURATION } from "react-native-easy-toast";
import Spinner from "react-native-loading-spinner-overlay";

export default function ForgotPass({ navigation }) {
  const [email, setEmail] = useState("");
  const [loader, setLoader] = useState(false);

  const handleChangePassword = () => {
    Keyboard.dismiss();
    if (email === "") {
      blanktoast.show("Please enter email", 1000);
      return false;
    } else {
      setLoader(true);
      const datanew = {
        email,
      };
      console.log("hello dear", datanew);
      axios({
        method: "POST",
        url: "https://pigeon-dev2.herokuapp.com/driver/driver-forgotPassword",
        data: datanew,
      })
        .then((response) => {
          console.log("helllllllllo", response);
          if (response.data.status === 0) {
            setTimeout(() => {
              invalidtoast.show("Can not change password", 1000);
            }, 500);
            setTimeout(() => {
              setLoader(false);
            }, 1000);
          } else if (response.data.status === 2) {
            setTimeout(() => {
              invalidtoast.show("Plzz provide valid email", 1000);
            }, 500);
            setTimeout(() => {
              setLoader(false);
            }, 1000);
          } else {
            console.log("hello from forgot password", response.data);
            setTimeout(() => {
              loginSuccess.show("Password send on your mail", 1000);
            }, 500);
            setTimeout(() => {
              setLoader(false);
            }, 1000);
            setTimeout(() => {
              navigation.navigate("DriverLogin");
            }, 1000);
          }
        })
        .catch((err) => {
          console.log("failed", err.message);
        });
    }
  };

  return (
    <Container>
      <Spinner visible={loader} textStyle={{ color: "black" }} />
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
          <HeadingText fontFamily="Poppins-Bold">Forgot Password ?</HeadingText>
        </HeadingTextContainer>
      </HeaderContainer>
      <ScrollView>
        <FormContainer>
          <InputFieldContainer>
            <Image
              source={require("../../image/emailIcon.png")}
              style={{
                position: "absolute",
                top: HEIGHT * 0.041,
                left: WIDTH * 0.06,
              }}
            />
            <TextInput
              placeholder="Enter email"
              onChangeText={(text) => setEmail(text)}
              value={email}
              autoCapitalize="none"
              style={{
                borderWidth: 2,
                marginTop: HEIGHT * 0.013,
                borderRadius: 50,
                paddingLeft: WIDTH * 0.12,
                borderColor: "grey",
                height: HEIGHT * 0.07,
                color: "black",
              }}
            />
          </InputFieldContainer>
          <Separator />
          <Separator />
          <Separator />
          <Separator />
          <Separator />
          <Separator />
          <BacktoLoginContainer
            onPress={() => navigation.navigate("DriverLogin")}
          >
            <ArrowContainer>
              <Image
                source={require("../../image/backarrow4.jpeg")}
                style={{
                  width: 20,
                  height: 20,
                }}
              />
            </ArrowContainer>
            <BackTextContainer>
              <BackToLoginText>Back To Login</BackToLoginText>
            </BackTextContainer>
          </BacktoLoginContainer>
          <Separator />
          <Separator />
          <Separator />
          <Separator />
          <ButtonContainer onPress={handleChangePassword}>
            <ButtonText fontFamily="Poppins-Bold">Send</ButtonText>
          </ButtonContainer>
        </FormContainer>
      </ScrollView>
      <Toast
        position="center"
        ref={(ref) => {
          emailtoast = ref;
        }}
        style={{ backgroundColor: "black" }}
      />
      <Toast
        position="center"
        ref={(ref) => {
          blanktoast = ref;
        }}
        style={{ backgroundColor: "black" }}
      />
      <Toast
        position="center"
        ref={(ref) => {
          invalidtoast = ref;
        }}
        style={{ backgroundColor: "black" }}
      />
      <Toast
        position="center"
        ref={(ref) => {
          loginSuccess = ref;
        }}
        style={{ backgroundColor: "black" }}
      />
    </Container>
  );
}
