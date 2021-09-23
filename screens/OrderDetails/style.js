import styled from 'styled-components';
import { Dimensions } from 'react-native';
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export const Container = styled.View`
   flex:1
   backgroundColor:#FFFFFF
`;
 
export const HeaderContainer = styled.View`
   position:absolute
`;
 
export const ImageHeaderContainer = styled.View`
   height:40%
   border:1px
`;

export const DropdownContainer = styled.View`
   height:60%
`;
export const DropdownBTN = styled.TouchableOpacity`
   width:90%
   alignSelf:center
   marginTop:${HEIGHT*0.03}px
   paddingTop:${HEIGHT*0.02}px
   paddingBottom:${HEIGHT*0.02}px
   backgroundColor:#E5E5E5
   borderBottomWidth:3px
   borderColor:#C4C4C4
   shadowColor:black
   elevation: 2
   shadowOffset: 0px 3px
   shadowColor: black
   shadowOpacity: 0.3
   shadowRadius: 0.7px
`;
export const DropdownText = styled.Text`
   fontSize:15px
   fontFamily:${props => props.fontFamily}
`;
export const DropdownBTNContentContainer = styled.View`
    width:90%
    alignSelf:center
    paddingTop:${HEIGHT*0.02}px
    paddingBottom:${HEIGHT*0.02}px
    borderWidth:1px
    borderColor:#cfcbca
    borderBottomWidth:3px
`;


export const DropdownInnerContainerOne = styled.View`
  width:90%
  alignSelf:center
  flexDirection:row
  
`;
export const ColumnOne = styled.View`
  width:40%
  paddingTop:${HEIGHT*0.006}px
  paddingBottom:${HEIGHT*0.006}px
`;
export const TextOne = styled.Text`
   fontSize:17px
   fontWeight:bold
`;
export const ColumnTwo = styled.View`
  width:60%
  paddingTop:${HEIGHT*0.006}px
  paddingBottom:${HEIGHT*0.006}px
`;
export const TextTwo = styled.Text`
  fontSize:17px
`;
export const DropDownBtnColumn1 = styled.View`
    justifyContent:center
    width:95%
`;
export const DropDownBtnColumn2 = styled.View`
  justifyContent:center
`;

export const DropDownBtnInner = styled.View`
  flexDirection:row
  width:90%
  alignSelf:center
`;
export const DropdownText2 = styled.Text`
  justifyContent:center
  fontSize:17px
  fontFamily:${props => props.fontFamily}
`;
export const DropDownBtnColumnfirst = styled.View`
  justifyContent:center
  width:60%
`;
export const DropDownBtnColumnsecond = styled.View`
  justifyContent:center
  width:40%
`;

  