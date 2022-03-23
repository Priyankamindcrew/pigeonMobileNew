import React, { useState, useEffect, useRef } from "react";
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast, { DURATION } from "react-native-easy-toast";
import { Avatar } from 'react-native-elements';
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
  View
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
  StaticTextBlock
} from "./style";
import Spinner from "react-native-loading-spinner-overlay";

export default function Profile({ navigation }) {
  const [storageEmail, setStorageEmail] = useState("");
  const [Name, setName] = useState("");
  const [cardName, setCardName] = useState("");
  const [HedingName, setHedingName] = useState("");
  const [Email, setEmail] = useState("");
  const [ContactNo, setContactNo] = useState("");
  const [Licence_details, setLicence_details] = useState("");
  const [Licence_plate, setLicence_plate] = useState("");
  const [Password, setPassword] = useState("");
  const [loader, setLoader] = useState(true);
  const [loader1, setLoader1] = useState(false);
  const [btnStatus, setBtnStatus] = useState(false)

  const inputname = useRef();

  useEffect(() => {
    AsyncStorage.getItem('loginData').then(data => {
      data = JSON.parse(data);
      setStorageEmail(data['driverEmail']);
      axios(
        `https://pigeon-dev2.herokuapp.com/driver/driverInfo/${data['driverEmail']}`
      )
        .then((response) => {
          setLoader(false);
          console.log("dataDatadata", response.data.data[0].contact);
          setName(response.data.data[0].driver_name);
          setCardName(response.data.data[0].driver_name.split(" ").map((n,i,a)=> i === 0 || i+1 === a.length ? n[0] : null).join(""))
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

      // AsyncStorage.getItem("driverEmail").then((driverEmail) => {
      //   axios({
      //     method: "POST",
      //     url: `https://pigeon-dev2.herokuapp.com/driver/Update-driverInfo/${driverEmail}`,
      //     data: datanew,
      //   })
      //     .then((response) => {
      //       console.log('onLogin......',response.data)
      //       if (response.data.status === 0) {
      //         setLoader1(false);
      //         setBtnStatus(false)
      //         invalidtoast.show("Can not change password", 1000);
      //       } else {
      //         setTimeout(() => {
      //           setHedingName(datanew.Name)
      //           loginSuccess.show("Data updated successfully", 1000);
      //         }, 1000);
      //         setTimeout(() => {
      //           setBtnStatus(false)
      //           setLoader1(false);
      //         }, 1000);
      //         AsyncStorage.removeItem("driverEmail");
      //         AsyncStorage.setItem("driverEmail", Email);
      //         console.log("res========>", response.data);
      //       }
      //     })
      //     .catch((err) => {
      //       console.log("failed", err.message);
      //     });
      // });
      AsyncStorage.getItem('loginData').then(data => {
        data = JSON.parse(data);
        axios({
          method: "POST",
          url: `https://pigeon-dev2.herokuapp.com/driver/Update-driverInfo/${data['driverEmail']}`,
          data: datanew,
        })
          .then((response) => {
            console.log('onLogin......',response.data)
            if (response.data.status === 0) {
              setLoader1(false);
              setBtnStatus(false)
              invalidtoast.show("Can not change password", 1000);
            } else {
              setTimeout(() => {
                setHedingName(datanew.Name)
                loginSuccess.show("Data updated successfully", 1000);
              }, 1000);
              setTimeout(() => {
                setBtnStatus(false)
                setLoader1(false);
              }, 1000);

              var toPassIntoLocal = {
                driverId: JSON.stringify(data['driverId']),
                driverEmail: Email,
                drivername: data['drivername'],
              };

              AsyncStorage.removeItem("loginData");
              AsyncStorage.setItem("loginData", JSON.stringify(toPassIntoLocal));
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
        <HeaderContainer>
          <Header
            navProp="MapScreen"
            navigation={navigation}
            HeadingText="My Profile"
            showBackBTN={true}
          />
        </HeaderContainer>

      <ScrollView
        style={{
          marginBottom:
            Platform.OS === "ios" ? HEIGHT * 0.04 : HEIGHT * 0.043,
        }}
      >
      <Container>
      <Spinner visible={loader1} textStyle={{ color: "black" }} />
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
              {btnStatus ? (
                <EditContainer
                  onPress={handleEditSubmit}
                >
                  <ContainerOne>
                    <Image
                      source={require("../../image/saveIMG.jpeg")}
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
                      Save
                    </Text>
                  </ContainerTwo>
                </EditContainer>
              ) : (
                <EditContainer
                  onPress={() => {
                    blanktoast.show("Edit your profile", 1000);
                    setBtnStatus(true)
                    //inputname.current.focus();
                  }}
                >
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
              )}
              <RoundIMGContainer>
                {/* <Image
                  source={require("../../image/Ellipse.png")}
                  style={{
                    alignSelf: "center",
                    marginTop: HEIGHT * 0.06,
                  }}
                /> */}
                <View style={{
                  width:60,
                  height:60,
                  backgroundColor:'white',
                  alignSelf:'center',
                  borderRadius:30,
                  justifyContent:'center'
                }}>
                  <Text
                    style={{
                      alignSelf:'center',    
                    }}
                  >{cardName}</Text>
                </View>
                {/* <Avatar rounded title="MD" 
                  containerStyle={{backgroundColor:'red'}}
                /> */}
                <ProfileText>{HedingName}</ProfileText>
              </RoundIMGContainer>
            </ProfileImgContainer>
            <FormContainer>
              {/* <ScrollView
                style={{
                  marginBottom:
                    Platform.OS === "ios" ? HEIGHT * 0.4 : HEIGHT * 0.43,
                }}
              > */}
                <Text
                  style={{
                    marginLeft: WIDTH * 0.06,
                    marginTop: HEIGHT * 0.04,
                    color: "#989898",
                  }}
                >
                  Full Name
                </Text>
                {btnStatus ?
                  <TextInput
                    placeholder="Enter Name"
                    autoCapitalize="none"
                    value={Name}
                    //ref={inputname}
                    autoFocus={true}
                    onChangeText={(text) => {
                      setName(text);
                      setCardName(text.split(" ").map((n,i,a)=> i === 0 || i+1 === a.length ? n[0] : null).join(""));
                    }}
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
                  :
                  <StaticTextBlock>
                    <Text>{Name}</Text>
                  </StaticTextBlock>
                }

                <Text
                  style={{
                    marginLeft: WIDTH * 0.06,
                    marginTop: HEIGHT * 0.04,
                    color: "#989898",
                  }}
                >
                  Email
                </Text>
                {btnStatus ?
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
                  :
                  <StaticTextBlock>
                    <Text>{Email}</Text>
                  </StaticTextBlock>
                }

                <Text
                  style={{
                    marginLeft: WIDTH * 0.06,
                    marginTop: HEIGHT * 0.04,
                    color: "#989898",
                  }}
                >
                  Contact Number
                </Text>

                {btnStatus ?
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
                  :
                  <StaticTextBlock>
                    <Text>{ContactNo}</Text>
                  </StaticTextBlock>
                }

                <Text
                  style={{
                    marginLeft: WIDTH * 0.06,
                    marginTop: HEIGHT * 0.04,
                    color: "#989898",
                  }}
                >
                  License Details
                </Text>

                {btnStatus ?
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
                  :
                  <StaticTextBlock>
                    <Text>{Licence_details}</Text>
                  </StaticTextBlock>
                }

                <Text
                  style={{
                    marginLeft: WIDTH * 0.06,
                    marginTop: HEIGHT * 0.04,
                    color: "#989898",
                  }}
                >
                  License Plate
                </Text>

                {btnStatus ?
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
                  :
                  <StaticTextBlock>
                    <Text>{Licence_plate}</Text>
                  </StaticTextBlock>
                }

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
              {/* </ScrollView> */}
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
      </ScrollView>
    </SafeAreaView>
  );
}

