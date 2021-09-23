import React, { useState, useEffect, useRef } from "react";
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {
  ScrollView,
  Dimensions,
  Image,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import {
  Container,
  HeaderContainer,
  OrderContainer,
  ContentContainer,
  LocationFromText,
  LocationToHeading,
  LocationToText,
  RowFive,
  RowFiveInnerContainer1,
  RowFiveInnerContainer2,
  DetailsButtonContainer,
  DetaiButtonText,
  AddressContainer,
  AddressContainer1,
  AddressContainer2,
  BtnContainer,
  UpcomeDeliverContainer,
  UpcomeDelInnerContainerOne,
  UpcomInnerTextOne,
  UpcomeDelInnerContainerTwo,
  UpcomInnerTextTwo,
  UpcomeDelInnerContainerThree,
  UpcomInnerTextThree,
  LocationToHeadingLocation,
  RowFiveInnerContainer1Location,
  RowFiveLocation,
} from "./style";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Header from "../../components/Header";
import moment from "moment";

export default function PickedUp({ navigation }) {
  const todayDate = new Date().toLocaleString("en-US", {
    timeZone: "America/Toronto",
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  const [date1, setDate1] = useState(moment(todayDate).format("DD/MM/YYYY"));
  const [drEmail, setDrEmail] = useState("");
  const [data, setData] = useState([]);
  const [empty, setEmpty] = useState("");
  const [deliveryDate, setDeliveryDate] = useState([]);
  const [updateData, setUpdateData] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [chooseDate, setChooseDate] = useState("");
  const statusData = "picked-up";
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem("driverEmail").then((driverEmail) => {
      setDrEmail(driverEmail);
      axios(
        `https://pigeon-dev2.herokuapp.com/driver/driver-orders-myRides/${driverEmail}/${statusData}?dateDataurl=${date1}`
      )
        .then((response) => {
          console.log(
            `hcjhsac-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=>>>>>> ${date1} `,
            response.data.data
          );
          if (response.data.data === undefined) {
            setLoading(false);
            setEmpty("No orders found for this day");
          } else {
            setLoading(false);
            setEmpty("");
            setData(response.data.data);
            setDeliveryDate(response.data.deliveryDateArr);
          }
        })
        .catch((err) => {
          console.log("failed", err);
        });
    });
  }, [updateData]);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const datanew1 = date.toLocaleString("en-US", {
      timeZone: "America/Toronto",
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
    const datanewnew = moment(datanew1).format("DD/MM/YYYY");
    setChooseDate(datanewnew);
    setDate1(datanewnew);
    hideDatePicker();
    setUpdateData(!updateData);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <Container>
        <HeaderContainer>
          <Header
            navProp="MapScreen"
            navigation={navigation}
            HeadingText="My Rides"
            showBackBTN={true}
          />
        </HeaderContainer>

        <OrderContainer>
          <View>
            <View
              style={{
                flexDirection: "row",
                borderBottomWidth: 0.5,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  width: WIDTH * 0.79,
                  justifyContent: "space-around",
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingTop: HEIGHT * 0.01,
                  paddingBottom: HEIGHT * 0.01,
                  marginTop: 10,
                }}
              >
                <View
                  style={{
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      color: "black",
                    }}
                  >
                    {date1}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={showDatePicker}
                style={{
                  justifyContent: "center",
                  marginTop: 10,
                }}
              >
                <Image
                  source={require("../../image/calender.png")}
                  style={{
                    width: WIDTH * 0.05,
                    height: HEIGHT * 0.03,
                  }}
                />
              </TouchableOpacity>
            </View>

            <UpcomeDeliverContainer>
              <UpcomeDelInnerContainerOne
                onPress={() => navigation.navigate("MyRides")}
              >
                <UpcomInnerTextOne>Upcoming</UpcomInnerTextOne>
              </UpcomeDelInnerContainerOne>
              <UpcomeDelInnerContainerTwo>
                <UpcomInnerTextTwo>Picked-Up</UpcomInnerTextTwo>
              </UpcomeDelInnerContainerTwo>
              <UpcomeDelInnerContainerThree
                onPress={() => navigation.navigate("Delivered")}
              >
                <UpcomInnerTextThree>Delivered</UpcomInnerTextThree>
              </UpcomeDelInnerContainerThree>
            </UpcomeDeliverContainer>

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>

          {loading ? (
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
              {empty === "" ? (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{ marginTop: 15 }}
                >
                  {data.map((item, index) => (
                    <ContentContainer key={index}>
                      <RowFive>
                        <RowFiveInnerContainer1>
                          <LocationToHeading fontFamily="Poppins-SemiBold">
                            Order Id:
                          </LocationToHeading>
                        </RowFiveInnerContainer1>
                        <RowFiveInnerContainer2>
                          <LocationToText fontFamily="Poppins-Regular">
                            {item.order_id}
                          </LocationToText>
                        </RowFiveInnerContainer2>
                      </RowFive>
                      <RowFive>
                        <RowFiveInnerContainer1>
                          <LocationToHeading fontFamily="Poppins-SemiBold">
                            Name:
                          </LocationToHeading>
                        </RowFiveInnerContainer1>
                        <RowFiveInnerContainer2>
                          <LocationToText fontFamily="Poppins-Regular">
                            {item.from_name}
                          </LocationToText>
                        </RowFiveInnerContainer2>
                      </RowFive>

                      <RowFiveLocation>
                        <RowFiveInnerContainer1Location>
                          <LocationToHeadingLocation fontFamily="Poppins-Bold">
                            Location:
                          </LocationToHeadingLocation>
                        </RowFiveInnerContainer1Location>
                        <AddressContainer>
                          <AddressContainer1>
                            <Image
                              source={require("../../image/smallgreenmarker3.png")}
                              style={{
                                width: WIDTH * 0.053,
                                height: HEIGHT * 0.025,
                                marginLeft: WIDTH * 0.03,
                              }}
                            />
                          </AddressContainer1>
                          <AddressContainer2>
                            <LocationFromText fontFamily="Poppins-Regular">
                              {item.from_order}
                            </LocationFromText>
                          </AddressContainer2>
                        </AddressContainer>
                      </RowFiveLocation>

                      <BtnContainer>
                        <DetailsButtonContainer
                          onPress={() =>
                            navigation.navigate("OrderDetails", {
                              orderId: item.order_id,
                              driverEmail: item.driver_email,
                            })
                          }
                        >
                          <DetaiButtonText fontFamily="Poppins-Bold">
                            Details
                          </DetaiButtonText>
                        </DetailsButtonContainer>
                      </BtnContainer>
                    </ContentContainer>
                  ))}
                </ScrollView>
              ) : (
                <View
                  style={{
                    alignSelf: "center",
                    marginTop: HEIGHT * 0.2,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                    }}
                  >
                    {empty}
                  </Text>
                </View>
              )}
            </>
          )}
        </OrderContainer>
      </Container>
    </SafeAreaView>
  );
}
