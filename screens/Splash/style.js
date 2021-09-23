import styled from 'styled-components';
import { Dimensions } from 'react-native';
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export const Container = styled.View`
	flex:1
`;
    
export const HeaderContainer = styled.View`
  marginTop:${HEIGHT*0.4}px
`;

export const HeadingTextContainer = styled.View`
   
   paddingBottom:${HEIGHT*0.02}px
`;
export const HeadingText = styled.Text`
	fontSize:16px
    color:#556EE6
    fontFamily:${props => props.fontFamily}
    textAlign:center
`;
export const ImageLogoContainer = styled.View`
	backgroundColor:#e3e3e3
   width:${WIDTH*0.2}px
   height:${HEIGHT*0.1}px
   justifyContent:center
   alignSelf:center
`;
