import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [phone, setPhone] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [escrowId, setEscrowId] = useState('');
  const [screen, setScreen] = useState('dashboard');
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');
  const [seller, setSeller] = useState('');
  const [deals, setDeals] = useState([]);
  const [bank, setBank] = useState('');
  const [account, setAccount] = useState('');

  const register = () => {
    if(phone.length < 11) return Alert.alert("Invalid", "Enter valid phone number");
    setEscrowId(phone);
    setIsRegistered(true);
  };

  const createDeal = () => {
    if(!item || !amount) return Alert.alert("Fill all");
    const newDeal = { id: 'ELNG-' + Date.now().toString().slice(-6), item, amount, seller: escrowId, status: 'PENDING PAYMENT', buyerPhone: '' };
    setDeals([newDeal, ...deals]);
    setItem(''); setAmount('');
    Alert.alert("Deal Created", `Escrow ID: ${newDeal.id} - Share to buyer`);
  };

  const payWithPaystack = (id) => {
    Alert.alert("Paystack", `Pay ₦${deals.find(d=>d.id===id).amount} for ${deals.find(d=>d.id===id).item}?`, [
      {text:'Cancel'}, {text:'Pay Now', onPress:()=>{
        setDeals(deals.map(d=> d.id===id ? {...d, status:'PAID - AWAITING DELIVERY', buyerPhone: escrowId} : d));
        Alert.alert("Paid!", "Money held by EscrowLock. Confirm when you receive goods.");
      }}
    ]);
  };

  const confirmDelivery = (id) => {
    Alert.alert("Confirm", "Have you received goods in good condition?", [
      {text:'No'}, {text:'Yes, Release Money', onPress:()=>{
        setDeals(deals.map(d=> d.id===id ? {...d, status:'DELIVERED - PAY SELLER'} : d));
        Alert.alert("Done!", "Seller has been paid. Seller can now withdraw to bank.");
      }}
    ]);
  };

  const withdraw = () => {
    if(!bank || !account) return Alert.alert("Add bank details");
    Alert.alert("Withdrawal", `₦ sent to ${bank} - ${account}. Deal Completed! No Scam ✅`);
  };

  // 1. REGISTRATION SCREEN
  if(!isRegistered){
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.center}>
          <Image source={require('./icon.png')} style={styles.logoBig} />
          <Text style={styles.title}>EscrowLock Gold</Text>
          <Text style={styles.sub}>Secure deals, no scam 🦁</Text>
          <TextInput style={styles.input} placeholder="Enter phone number" placeholderTextColor="#999" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
          <TouchableOpacity style={styles.goldButton} onPress={register}><Text style={styles.goldText}>Register & Get Escrow ID</Text></TouchableOpacity>
        </View>
      </View>
    );
  }

  // 2. DASHBOARD
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView style={{padding:20, paddingTop:60}}>
        <View style={styles.topBar}>
          <Image source={require('./icon.png')} style={{width:50,height:50,borderRadius:10,borderWidth:1,borderColor:'#D4AF37'}} />
          <View><Text style={{color:'#D4AF37',fontWeight:'bold'}}>Escrow ID: {escrowId}</Text><Text style={{color:'#00A651',fontSize:12}}>Seller Account Active ✅</Text></View>
        </View>

        {screen==='dashboard' && (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Sell Item (Seller)</Text>
              <TextInput style={styles.input} placeholder="Item name" placeholderTextColor="#888" value={item} onChangeText={setItem}/>
              <TextInput style={styles.input} placeholder="Amount ₦" placeholderTextColor="#888" keyboardType="numeric" value={amount} onChangeText={setAmount}/>
              <TouchableOpacity style={styles.goldButton} onPress={createDeal}><Text style={styles.goldText}>Create Escrow Deal 🔒</Text></TouchableOpacity>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>My Deals</Text>
              {deals.length===0 && <Text style={{color:'#666'}}>No deals yet</Text>}
              {deals.map(d=>(
                <View key={d.id} style={styles.deal}>
                  <Text style={{color:'#fff',fontWeight:'bold'}}>{d.item} - ₦{d.amount}</Text>
                  <Text style={{color:'#D4AF37',fontSize:12}}>{d.id} | {d.status}</Text>
                  {d.status==='PENDING PAYMENT' && <TouchableOpacity style={styles.payBtn} onPress={()=>payWithPaystack(d.id)}><Text style={{color:'#000',fontWeight:'bold'}}>Pay with Paystack (Buyer)</Text></TouchableOpacity>}
                  {d.status==='PAID - AWAITING DELIVERY' && <TouchableOpacity style={[styles.payBtn,{backgroundColor:'#00A651'}]} onPress={()=>confirmDelivery(d.id)}><Text style={{color:'#fff',fontWeight:'bold'}}>I Received Goods - Pay Seller</Text></TouchableOpacity>}
                  {d.status==='DELIVERED - PAY SELLER' && <Text style={{color:'#00ff88',marginTop:8}}>✅ Completed - Ready for withdrawal</Text>}
                </View>
              ))}
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Withdraw to Bank</Text>
              <TextInput style={styles.input} placeholder="Bank name e.g GTB" placeholderTextColor="#888" value={bank} onChangeText={setBank}/>
              <TextInput style={styles.input} placeholder="Account number" placeholderTextColor="#888" keyboardType="numeric" value={account} onChangeText={setAccount}/>
              <TouchableOpacity style={styles.outline} onPress={withdraw}><Text style={{color:'#D4AF37',fontWeight:'bold'}}>Withdraw Money</Text></TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#000'},
  center:{flex:1,justifyContent:'center',padding:20,alignItems:'center'},
  logoBig:{width:120,height:120,borderRadius:25,borderWidth:2,borderColor:'#D4AF37'},
  title:{color:'#D4AF37',fontSize:30,fontWeight:'bold',marginTop:15},
  sub:{color:'#00A651',marginBottom:30,fontWeight:'600'},
  topBar:{flexDirection:'row',gap:15,alignItems:'center',marginBottom:20,backgroundColor:'#111',padding:15,borderRadius:15,borderWidth:1,borderColor:'#222'},
  card:{backgroundColor:'#111',borderRadius:20,padding:20,marginBottom:20,borderWidth:1,borderColor:'#222'},
  cardTitle:{color:'#D4AF37',fontWeight:'bold',marginBottom:15,fontSize:16},
  input:{backgroundColor:'#1A1A1A',color:'#fff',borderWidth:1,borderColor:'#333',borderRadius:12,padding:16,marginBottom:12},
  goldButton:{backgroundColor:'#D4AF37',borderRadius:14,padding:18,alignItems:'center'},
  goldText:{color:'#000',fontWeight:'bold',fontSize:15},
  deal:{backgroundColor:'#1A1A1A',padding:15,borderRadius:12,marginTop:12,borderLeftWidth:4,borderLeftColor:'#D4AF37'},
  payBtn:{backgroundColor:'#D4AF37',padding:12,borderRadius:10,marginTop:10,alignItems:'center'},
  outline:{borderWidth:1,borderColor:'#D4AF37',borderRadius:14,padding:18,alignItems:'center',marginTop:5}
});
