import styled from 'styled-components';
import { Dimensions } from 'react-native';
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export const HeaderContainer = styled.View`
	  flexDirection:row
    paddingTop:${HEIGHT*0.015}px
    paddingBottom:${HEIGHT*0.015}px
    borderBottomWidth:3px
    borderLeftWidth:1px
    borderRightWidth:1px
    borderColor:#a6a6a6 
    backgroundColor:#FFFFFF
    paddingLeft:7px
    paddingRight:7px
`;
  
export const ContainerOne = styled.TouchableOpacity`
  width:10%
  alignItems:center
  justifyContent:center
  
  
`;

export const ContainerTwo = styled.View`
width:80%
justifyContent:center
paddingTop:${HEIGHT*0.005}px


`
export const ContainerThree = styled.TouchableOpacity`
width:10%
alignItems:center
justifyContent:center

`;
    
export const HeadingText = styled.Text`
  fontSize:18px
  fontFamily:${props => props.fontFamily}
  marginBottom:4px
`;

export const ImageIconOne = styled.Image`
	
`
export const ImageIconThree = styled.Image`
	
`;


export const ContainerTwoNoBackBtn = styled.View`
width:85%
justifyContent:center
paddingTop:${HEIGHT*0.005}px


`
export const ContainerThreeNoBackBtn = styled.TouchableOpacity`
width:15%
alignItems:center
justifyContent:center

`;
export const HeadingTextNoBackBtn = styled.Text`
  fontSize:18px
  fontFamily:${props => props.fontFamily}
  marginBottom:4px
  marginLeft:20px
`;
