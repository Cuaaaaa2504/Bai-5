import React from 'react';
import {ScrollView,Text,Pressable,StyleSheet} from 'react-native';
export class ErrorBoundary extends React.Component {
  state={error:null};
  static getDerivedStateFromError(error){return {error};}
  componentDidCatch(error,info){console.error('CourseHub render error',error,info.componentStack);}
  render(){if(!this.state.error)return this.props.children;return <ScrollView contentContainerStyle={styles.page}><Text style={styles.title}>Không mở được màn hình</Text><Text selectable>{String(this.state.error?.message||this.state.error)}</Text><Text>Chụp thông báo này và log terminal. Error Boundary không bắt được native crash hoặc lỗi SDK của Expo Go.</Text><Pressable style={styles.button} onPress={()=>this.setState({error:null})}><Text style={{color:'white'}}>Thử lại</Text></Pressable></ScrollView>;}
}
function Boot(){const Root=require('./src/AppRoot').default;return <Root/>;}
export default function App(){return <ErrorBoundary><Boot/></ErrorBoundary>;}
const styles=StyleSheet.create({page:{flexGrow:1,padding:28,paddingTop:70,gap:18,backgroundColor:'#fff'},title:{fontSize:23,fontWeight:'700'},button:{padding:16,backgroundColor:'#315bc5',borderRadius:12}});
