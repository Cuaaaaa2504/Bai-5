import React,{useEffect,useState} from 'react';
import {ActivityIndicator,Text,View} from 'react-native';
import {useVideoPlayer,VideoView} from 'expo-video';
import {Button,s} from './ui';
export default function Trailer({url,onClose}){
  const [status,setStatus]=useState('loading');
  const player=useVideoPlayer(url,p=>p.play());
  useEffect(()=>{setStatus(player.status);const sub=player.addListener('statusChange',event=>setStatus(event.status));return ()=>sub.remove();},[player]);
  return <View style={s.page}><Text style={s.heading}>Trailer khóa học</Text>{status==='loading'&&<ActivityIndicator/>}<VideoView player={player} style={{width:'100%',height:250}} nativeControls fullscreenOptions={{enable:true}}/>{status==='error'&&<Text style={s.error}>Không phát được video. Kiểm tra URL MP4 trực tiếp và mạng.</Text>}<Button title="Đóng trailer" onPress={onClose}/></View>;
}
