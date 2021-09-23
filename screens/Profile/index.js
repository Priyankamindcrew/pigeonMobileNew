import React, { useState, useEffect, useRef } from "react";
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast, { DURATION } from "react-native-easy-toast";
import {
  ScrollView,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  Platform,
} from "react-native";
import Header from "../../components/Header";
import {
  Container,
  HeaderContainer,
  ProfileImgContainer,
  EditContainer,
  ContainerOne,
  ContainerTwo,
  RoundIMGContainer,
  ProfileText,
  FormContainer,
} from "./style";
import Spinner from "react-native-loading-spinner-overlay";

export default function Profile({ navigation }) {
  const [storageEmail, setStorageEmail] = useState("");
  const [Name, setName] = useState("");
  const [HedingName, setHedingName] = useState("");
  const [Email, setEmail] = useState("");
  const [ContactNo, setContactNo] = useState("");
  const [Licence_details, setLicence_details] = useState("");
  const [Licence_plate, setLicence_plate] = useState("");
  const [Password, setPassword] = useState("");
  const [loader, setLoader] = useState(true);
  const [loader1, setLoader1] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("driverEmail").then((driverEmail) => {
      setStorageEmail(driverEmail);
      axios(
        `https://pigeon-dev2.herokuapp.com/driver/driverInfo/${driverEmail}`
      )
        .then((response) => {
          setLoader(false);
          console.log("dataDatadata", response.data.data[0].contact);
          setName(response.data.data[0].driver_name);
          setHedingName(response.data.data[0].driver_name);
          setEmail(response.data.data[0].driver_email);
          setContactNo(response.data.data[0].contact.toString());
          setLicence_details(response.data.data[0].licence_info);
          setLicence_plate(response.data.data[0].licence_plate);
        })
        .catch((err) => {
          console.log("failed", err);
        });
    });
  }, []);

  const handleEditSubmit = () => {
    if (Name === "") {
      blanktoast.show("Please enter name", 1000);
      return false;
    } else if (Email === "") {
      blanktoast.show("Please enter email", 1000);
      return false;
    } else if (ContactNo === "") {
      blanktoast.show("Please enter contact number", 1000);
      return false;
    } else if (Licence_details === "") {
      blanktoast.show("please enter licence details", 1000);
      return false;
    } else if (Licence_plate === "") {
      blanktoast.show("please enter licence plate", 1000);
      return false;
    } else {
      setLoader1(true);
      const datanew = {
        Name,
        Email,
        ContactNo,
        Licence_details,
        Licence_plate,
      };

      AsyncStorage.getItem("driverEmail").then((driverEmail) => {
        axios({
          method: "POST",
          url: `https://pigeon-dev2.herokuapp.com/driver/Update-driverInfo/${driverEmail}`,
          data: datanew,
        })
          .then((response) => {
            if (response.data.status === 0) {
              setLoader1(false);
              invalidtoast.show("Can not change password", 1000);
            } else {
              setTimeout(() => {
                loginSuccess.show("data updated successfully", 1000);
              }, 1000);
              setTimeout(() => {
                setLoader1(false);
              }, 1000);
              AsyncStorage.removeItem("driverEmail");
              AsyncStorage.setItem("driverEmail", Email);
              console.log("res========>", response.data);
            }
          })
          .catch((err) => {
            console.log("failed", err.message);
          });
      });
    }
  };

  const handleChanePassword = () => {
    if (Password === "") {
      blanktoast.show("Please enter new password", 1000);
      return false;
    } else {
      setLoader1(true);
      const datanew = {
        Email,
        Password,
      };
      console.log("hello dear", datanew);
      axios({
        method: "POST",
        url: "https://pigeon-dev2.herokuapp.com/driver/driverChangePassword",
        data: datanew,
      })
        .then((response) => {
          if (response.data.status === 0) {
            setTimeout(() => {
              invalidtoast.show("Can not change password", 1000);
            }, 1000);
            setTimeout(() => {
              setLoader1(false);
            }, 1000);
          } else {
            console.log("hello from forgot password", response.data);
            setTimeout(() => {
              loginSuccess.show("Password Changed", 1000);
            }, 1000);
            setTimeout(() => {
              setLoader1(false);
            }, 1000);
          }
        })
        .catch((err) => {
          console.log("failed", err.message);
        });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <Container>
        <Spinner visible={loader1} textStyle={{ color: "black" }} />
        <HeaderContainer>
          <Header
            navProp="MapScreen"
            navigation={navigation}
            HeadingText="My Profile"
            showBackBTN={true}
          />
        </HeaderContainer>

        {loader ? (
          <ActivityIndicator
            size="large"
            color="blue"
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        ) : (
          <>
            <ProfileImgContainer>
              <EditContainer onPress={handleEditSubmit}>
                <ContainerOne>
                  <Image
                    source={require("../../image/EditImg.png")}
                    style={{
                      width: 11,
                      height: 17,
                    }}
                  />
                </ContainerOne>
                <ContainerTwo>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 18,
                      paddingLeft: 5,
                      fontWeight: "bold",
                    }}
                  >
                    Edit
                  </Text>
                </ContainerTwo>
              </EditContainer>
              <RoundIMGContainer>
                <Image
                  source={require("../../image/Ellipse.png")}
                  style={{
                    alignSelf: "center",
                    marginTop: HEIGHT * 0.06,
                  }}
                />
                <ProfileText>{HedingName}</ProfileText>
              </RoundIMGContainer>
            </ProfileImgContainer>
            <FormContainer>
              <ScrollView
                style={{
                  marginBottom:
                    Platform.OS === "ios" ? HEIGHT * 0.4 : HEIGHT * 0.43,
                }}
              >
                <Text
                  style={{
                    marginLeft: WIDTH * 0.06,
                    marginTop: HEIGHT * 0.04,
                    color: "#989898",
                  }}
                >
                  Full Name
                </Text>
                <TextInput
                  placeholder="Enter Name"
                  autoCapitalize="none"
                  value={Name}
                  onChangeText={(text) => setName(text)}
                  style={{
                    paddingLeft: WIDTH * 0.02,
                    width: WIDTH * 0.9,
                    alignSelf: "center",
                    height: HEIGHT * 0.07,
                    color: "black",
                    marginTop: HEIGHT * 0.01,
                    borderWidth: 1,
                    borderWidth: 0.5,
                    borderRadius: 10,
                  }}
                />
                <Text
                  style={{
                    marginLeft: WIDTH * 0.06,
                    marginTop: HEIGHT * 0.04,
                    color: "#989898",
                  }}
                >
                  Email
                </Text>
                <TextInput
                  placeholder="Enter Email"
                  autoCapitalize="none"
                  value={Email}
                  onChangeText={(text) => setEmail(text)}
                  style={{
                    paddingLeft: WIDTH * 0.02,
                    width: WIDTH * 0.9,
                    alignSelf: "center",
                    height: HEIGHT * 0.07,
                    color: "black",
                    marginTop: HEIGHT * 0.01,
                    borderWidth: 1,
                    borderWidth: 0.5,
                    borderRadius: 10,
                  }}
                />
                <Text
                  style={{
                    marginLeft: WIDTH * 0.06,
                    marginTop: HEIGHT * 0.04,
                    color: "#989898",
                  }}
                >
                  Contact Number
                </Text>
                <TextInput
                  placeholder="Enter Contact Number"
                  value={ContactNo}
                  onChangeText={(text) => setContactNo(text)}
                  style={{
                    paddingLeft: WIDTH * 0.02,
                    width: WIDTH * 0.9,
                    alignSelf: "center",
                    height: HEIGHT * 0.07,
                    color: "black",
                    marginTop: HEIGHT * 0.01,
                    borderWidth: 1,
                    borderWidth: 0.5,
                    borderRadius: 10,
                  }}
                />
                <Text
                  style={{
                    marginLeft: WIDTH * 0.06,
                    marginTop: HEIGHT * 0.04,
                    color: "#989898",
                  }}
                >
                  License Details
                </Text>
                <TextInput
                  placeholder="Enter License Details"
                  autoCapitalize="none"
                  value={Licence_details}
                  onChangeText={(text) => setLicence_details(text)}
                  style={{
                    paddingLeft: WIDTH * 0.02,
                    width: WIDTH * 0.9,
                    alignSelf: "center",
                    height: HEIGHT * 0.07,
                    color: "black",
                    marginTop: HEIGHT * 0.01,
                    borderWidth: 1,
                    borderWidth: 0.5,
                    borderRadius: 10,
                  }}
                />
                <Text
                  style={{
                    marginLeft: WIDTH * 0.06,
                    marginTop: HEIGHT * 0.04,
                    color: "#989898",
                  }}
                >
                  License Plate
                </Text>
                <TextInput
                  placeholder="Enter License Plate"
                  autoCapitalize="none"
                  value={Licence_plate}
                  onChangeText={(text) => setLicence_plate(text)}
                  style={{
                    paddingLeft: WIDTH * 0.02,
                    width: WIDTH * 0.9,
                    alignSelf: "center",
                    height: HEIGHT * 0.07,
                    color: "black",
                    marginTop: HEIGHT * 0.01,
                    borderWidth: 1,
                    borderWidth: 0.5,
                    borderRadius: 10,
                  }}
                />
                <Text
                  style={{
                    marginLeft: WIDTH * 0.06,
                    marginTop: HEIGHT * 0.04,
                    color: "#989898",
                  }}
                >
                  Password
                </Text>
                <TextInput
                  placeholder="Enter Password"
                  autoCapitalize="none"
                  secureTextEntry={true}
                  value={Password}
                  onChangeText={(text) => setPassword(text)}
                  style={{
                    paddingLeft: WIDTH * 0.02,
                    width: WIDTH * 0.9,
                    alignSelf: "center",
                    height: HEIGHT * 0.07,
                    color: "black",
                    marginTop: HEIGHT * 0.01,
                    borderWidth: 0.5,
                    borderRadius: 10,
                  }}
                />
                <TouchableOpacity
                  style={{
                    width: "50%",
                    marginTop: HEIGHT * 0.01,
                  }}
                  onPress={handleChanePassword}
                >
                  <Text
                    style={{
                      color: "blue",
                      fontSize: 15,
                      fontWeight: "bold",
                      marginLeft: WIDTH * 0.055,
                    }}
                  >
                    Change Password
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </FormContainer>
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
          </>
        )}
      </Container>
    </SafeAreaView>
  );
}
