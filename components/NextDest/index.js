import React from 'react'
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
  Separator,
  RowFiveLocation,
  RowFiveInnerContainer1Location,
  LocationToHeadingLocation,
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
  DetailsButtonContainer1,
  DetailButtonContainerInner1,
  DetailButtonContainerInner2,
  RowFiveInnerContainer3, 
  StatusContainer,
  StatusDownImgContainer,
} from "./style";


const NextDest = (props) => {
    return (
    <View>
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
                                      Next Order to pick :
                                    </LocationToHeading>
                                  </RowFiveInnerContainer1>
                                  <RowFiveInnerContainer2>
                                    <LocationToText fontFamily="Poppins-Regular">
                                      {item.order_id}
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
                                <Separator />
                                <RowFive>
                                  <RowFiveInnerContainer1>
                                    <LocationToHeading fontFamily="Poppins-Bold">
                                      Status:
                                    </LocationToHeading>
                                  </RowFiveInnerContainer1>

                                  <RowFiveInnerContainer3
                                    onPress={() => handlePress(index)}
                                  >
                                    <StatusContainer>
                                      <LocationToText fontFamily="Poppins-Regular">
                                        {item.status}
                                      </LocationToText>
                                    </StatusContainer>
                                    <StatusDownImgContainer>
                                      <Image
                                        source={require("../../image/DownArrowIcon.png")}
                                      />
                                    </StatusDownImgContainer>
                                  </RowFiveInnerContainer3>
                                </RowFive>
                                {select === index ? (
                                  <View
                                    style={{
                                      borderWidth: 1,
                                      backgroundColor: "#FFFFFF",
                                      width: WIDTH * 0.28,
                                      marginLeft: WIDTH * 0.26,
                                      paddingBottom: 4,
                                      borderColor: "#d9dbda",
                                      borderRadius: 10,
                                    }}
                                  >
                                    {DropDownData.map((item1, index1) => (
                                      <TouchableOpacity
                                        key={index1}
                                        onPress={() =>
                                          handleRowPress(
                                            item1.value,
                                            item.order_id,
                                            item.user_status
                                          )
                                        }
                                      >
                                        <Text
                                          style={{
                                            padding: 4,
                                            textAlign: "center",
                                            fontWeight: "bold",
                                            color: "black",
                                          }}
                                        >
                                          {item1.value}
                                        </Text>
                                      </TouchableOpacity>
                                    ))}
                                  </View>
                                ) : null}
                                <Separator />
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
                                  <DetailsButtonContainer1>
                                    <DetailButtonContainerInner1>
                                      <Image
                                        source={require("../../image/DirectiionIMG.png")}
                                      />
                                    </DetailButtonContainerInner1>
                                    <DetailButtonContainerInner2>
                                      <DetaiButtonText fontFamily="Poppins-Bold">
                                        Get Directions
                                      </DetaiButtonText>
                                    </DetailButtonContainerInner2>
                                  </DetailsButtonContainer1>
                                </BtnContainer>
    </View>
  )
}

export default NextDest