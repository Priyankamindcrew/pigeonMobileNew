import styled from 'styled-components';
import { Dimensions } from 'react-native';
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export const Container = styled.View`
	flex:1
   backgroundColor:#FFFFFF
`;
 
export const HeaderContainer = styled.View`
  
`;

export const HeadingContainer = styled.View`
   backgroundColor:#fae6e6
   paddingTop:20px
   paddingBottom:20px
   marginTop:${HEIGHT*0.05}px
`;

export const HeadingText = styled.Text`
	marginLeft:${WIDTH*0.1}px
	fontSize:20px
	fontWeight:bold
	color:grey
`;
export const OrderContainer = styled.View`
   backgroundColor:#fffcfc
   height:84%
   marginTop:${HEIGHT*0.01}px
`;
export const ContentContainer = styled.View`
	borderBottomWidth:3px
   borderLeftWidth:1px
   borderRightWidth:1px
	borderColor:#c7c7c7
	paddingLeft:10px
   paddingBottom:15px
   paddingTop:15px
   marginTop:${HEIGHT*0.02}px 
   borderRadius:30px
   
   width:${WIDTH*0.9}px
   alignSelf:center
`;

export const DayHeadingText = styled.Text`
fontSize:18px
fontWeight:bold
`;
export const TodayText = styled.Text`
   
`
export const ServiceHeadingText = styled.Text`
fontSize:18px
fontWeight:bold
`

export const ServiceText = styled.Text`
   
 `
export const LocationFromHeading = styled.Text`
fontSize:15px
fontFamily:${props => props.fontFamily}

`
export const LocationFromText = styled.Text`
fontFamily:${props => props.fontFamily}
`
export const LocationToHeading = styled.Text`
fontSize:15px
paddingLeft:10px
fontFamily:${props => props.fontFamily}
`
export const LocationToText = styled.Text`
fontFamily:${props => props.fontFamily} 
`
export const DeliveryDateHeading = styled.Text`
fontSize:18px
fontWeight:bold
`
export const DeliveryDateText = styled.Text`
  
`
export const ROWContainerONE = styled.View`
   flexDirection:row
   
   
`
export const RowContainerTwo = styled.View`
   flexDirection:row
   alignItems:center
`
export const RowOne = styled.View`
   width:20%
   padding:7px
`
export const RowTwo = styled.View`
   width:30%
   padding:7px
`
export const RowThree = styled.View`
width:40%
padding:7px
`
export const RowFour = styled.View`

flexDirection:row
alignItems:center
`

//======
export const RowFive = styled.View`
  flexDirection:row
  alignItems:center
`


export const RowFourContainer1 = styled.View`
  width:${WIDTH*0.22}px
  
`
export const RowFourContainer2 = styled.View`
  flexDirection:row
  
`
//=========
export const RowFourSubContainer1 = styled.View`
  
  justifyContent:center

`
export const RowFourSubContainer2 = styled.View`
  width:${WIDTH*0.52}px
  paddingLeft:8px
`
export const RowFiveInnerContainer1 = styled.View`
marginLeft:${WIDTH*0.013}px
width:${WIDTH*0.22}px
justifyContent:center


`
export const RowFiveInnerContainer2 = styled.TouchableOpacity`
marginLeft:${WIDTH*0.04}px
width:${WIDTH*0.55}px


`
export const RowFiveInnerContainer3 = styled.TouchableOpacity`
marginLeft:${WIDTH*0.04}px
width:${WIDTH*0.21}px
flexDirection:row

borderBottomWidth:1px
`
export const StatusContainer = styled.View`
  justifyContent:center
  
  
`
export const StatusDownImgContainer = styled.View`
justifyContent:center
marginLeft:${WIDTH*0.01}px


`


export const DateInnerContainer1 = styled.View`
  
`
export const DateInnerContainer2 = styled.View`

`
export const DateText1 = styled.Text`
fontSize:18px
fontWeight:bold
marginLeft:10px
`
export const DateText2 = styled.Text`
 fontSize:18px
 marginLeft:10px
 fontWeight:bold
`
export const DateContainer = styled.View`
   backgroundColor:#dee3e0
   flexDirection:row
   alignItems:center
   
`
export const DetailsButtonContainer = styled.TouchableOpacity`
   backgroundColor:#183DAD
   width:${WIDTH*0.5}px
   justifyContent:center
   borderRadius:5px
   paddingTop:${HEIGHT*0.008}px
   paddingBottom:${HEIGHT*0.008}px
   marginLeft:${WIDTH*0.01}px
   elevation:5
   shadowOffset: 0px 3px
   shadowColor: black
   shadowOpacity: 0.3
   shadowRadius: 0.7px
`

export const DetailsButtonContainer1 = styled.TouchableOpacity`
   backgroundColor:#556EE6
   flexDirection:row
   width:${WIDTH*0.4}px
   justifyContent:center
   borderRadius:5px
   paddingTop:${HEIGHT*0.008}px
   paddingBottom:${HEIGHT*0.008}px
   elevation:5
   shadowOffset: 0px 3px
   shadowColor: black
   shadowOpacity: 0.3
   shadowRadius: 0.7px
`
export const DetailButtonContainerInner1 = styled.View`
   
   justifyContent:center
   marginRight:10px

`
export const DetailButtonContainerInner2 = styled.View`
  
  justifyContent:center
`

export const DetaiButtonText = styled.Text`
   textAlign:center
   color:#FFFFFF
   fontFamily:${props => props.fontFamily}
`
export const IconImageContainer = styled.TouchableOpacity`
   backgroundColor:#FFFFFF
   width:${WIDTH*0.07}px
   height:${HEIGHT*0.034}px
   position:absolute
   left:${WIDTH*0.055}px
   top:${HEIGHT*0.05}px
   alignItems:center
   justifyContent:center
`

export const BtnContainer = styled.View`
    flexDirection:row
    width:${WIDTH*0.8}px
    alignItems:center
    marginTop:7px
    justifyContent:space-around
    zIndex:-1
`


export const AddressContainer = styled.View`
    flexDirection:row
`
export const AddressContainer1 = styled.View`
   
`
export const AddressContainer2 = styled.View`
   width:${WIDTH*0.512}px
  
   marginLeft:${WIDTH*0.008}px
`



export const UpcomeDeliverContainer = styled.View`
    marginTop:${HEIGHT*0.03}px
    flexDirection:row
    justifyContent:space-around
    paddingLeft:${WIDTH*0.05}px
    paddingRight:${WIDTH*0.05}px
`
export const UpcomeDelInnerContainerOne = styled.TouchableOpacity`
borderBottomWidth:1px
width:${WIDTH*0.28}px
`
export const UpcomInnerTextOne = styled.Text`
   textAlign:center
   fontSize:18px
`
export const UpcomeDelInnerContainerTwo = styled.TouchableOpacity`
borderBottomWidth:2px
width:${WIDTH*0.28}px
borderColor:#556EE6
`
export const UpcomInnerTextTwo = styled.Text`
textAlign:center
fontSize:18px
`
export const UpcomeDelInnerContainerThree = styled.TouchableOpacity`
borderBottomWidth:1px
width:${WIDTH*0.28}px
`
export const UpcomInnerTextThree = styled.Text`
textAlign:center
fontSize:18px
`


export const RowFiveLocation = styled.View`
  flexDirection:row
  marginTop:${HEIGHT*0.008}px
`

export const RowFiveInnerContainer1Location = styled.View`
marginLeft:${WIDTH*0.013}px
width:${WIDTH*0.22}px

`

export const LocationToHeadingLocation = styled.Text`
fontSize:15px
paddingLeft:10px
fontFamily:${props => props.fontFamily}
`
  