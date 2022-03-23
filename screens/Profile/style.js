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

export const ProfileImgContainer = styled.View`
   backgroundColor:#183DAD
   paddingBottom:${HEIGHT*0.06}px
`; 
export const EditContainer = styled.TouchableOpacity`
  flexDirection:row
   marginTop:${HEIGHT*0.03}px
   width:${WIDTH*0.15}px
   padding:2px
   marginLeft:${WIDTH*0.8}px
`;
export const ContainerOne = styled.View`
 justifyContent:center
`;
export const ContainerTwo = styled.View`

`;
export const RoundIMGContainer = styled.View`
  
`;
export const ProfileText = styled.Text`
   textAlign:center
   color:white
   fontSize:18px
   fontWeight:bold
`;
export const FormContainer = styled.View`
  paddingTop:10px
`;

export const StaticTextBlock = styled.View`
   paddingLeft: ${WIDTH * 0.02}px
   width: ${WIDTH * 0.9}px
   alignSelf: center
   borderWidth: 1px
   borderWidth: 0.5px
   borderRadius: 10px
   height: ${HEIGHT * 0.07}px
   marginTop: ${HEIGHT * 0.01}px
   justifyContent:center
`;
