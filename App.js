import { Text, View } from 'react-native';

export default function App(){
  return (
    <View style={{flex:1,backgroundColor:'#000',justifyContent:'center',alignItems:'center',padding:20}}>
      <Text style={{fontSize:60, marginBottom:15}}>🛡️</Text>
      <Text style={{color:'#fff',fontSize:24,fontWeight:'bold',textAlign:'center'}}>EscrowLock Gold V2</Text>
      <Text style={{color:'#FFEB3B',marginTop:10,fontWeight:'bold'}}>Build 27 - ICON VERSION</Text>
      <Text style={{color:'#0F7A4A',marginTop:20,fontSize:16,fontWeight:'bold', backgroundColor:'#fff', padding:10, borderRadius:8}}>✓ APP OPENED SUCCESSFULLY</Text>
      <Text style={{color:'#aaa',marginTop:30, textAlign:'center'}}>Package: com.escrowlock.goldv2{"\n"}Icon: Green Shield Active</Text>
    </View>
  );
}
