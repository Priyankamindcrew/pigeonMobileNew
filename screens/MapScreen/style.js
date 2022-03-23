import styled from 'styled-components';
import { Dimensions } from 'react-native';
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
 
export const HeaderContainer = styled.View`
   position:absolute
`;

export const ImageIconContainer = styled.TouchableOpacity`
   width:${WIDTH*0.08}px
   height:${HEIGHT*0.04}px
   justifyContent:center
   alignItems:center
   position:absolute
   left:${WIDTH*0.89}px
   top:${HEIGHT*0.12}px
`;
