import styled from 'styled-components';
import { Dimensions } from 'react-native';
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export const Container = styled.View`
	flex:1
`;

export const HeaderContainer = styled.View`
   paddingTop:${HEIGHT * 0.13}px
`;

export const HeadingTextContainer = styled.View`
   paddingTop:${HEIGHT * 0.02}px
   paddingBottom:${HEIGHT * 0.02}px
`;
export const HeadingText = styled.Text`
	fontSize:16px
    color:#556EE6
    fontFamily:${props => props.fontFamily}
    textAlign:center
`;
export const ImageLogoContainer = styled.View`
	backgroundColor:#e3e3e3
   width:${WIDTH * 0.2}px
   height:${HEIGHT * 0.1}px
   justifyContent:center
   alignSelf:center
`;

export const FormContainer = styled.View`
   padding:${WIDTH * 0.06}px
   marginTop:${HEIGHT * 0.02}px
 `
export const InputFieldContainer = styled.View`
  
`

export const Separator = styled.View`
   marginTop:${HEIGHT * 0.015}px
`
export const ButtonContainer = styled.TouchableOpacity`
   backgroundColor:#556EE6
   height:${HEIGHT * 0.07}px
   justifyContent:center
   borderRadius:5px
   elevation:5
   shadowOffset: 0 3px
   shadowColor: black
   shadowOpacity: 0.7
   shadowRadius: 2px
`
export const ButtonText = styled.Text`
   textAlign:center
   color:#FFFFFF
   fontFamily:${props => props.fontFamily}
`
export const CreateAccountContainer = styled.TouchableOpacity`
  marginTop:${HEIGHT * 0.01}px
`
export const CreateAccountLink = styled.Text`
   fontSize:17px
   textAlign:right
   marginRight:${WIDTH * 0.02}px
`
export const ForgotPasswordText = styled.Text`
   fontSize:15px
   color:#556EE6
   textAlign:center
   fontFamily:${props => props.fontFamily}
`
export const ForgotPassContainer = styled.TouchableOpacity`
   width:50%
   alignSelf:center
`

