import React, { useState, useEffect, createContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';

const EscrowContext = createContext();

export default function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState('auth');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [escrowId, setEscrowId] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [payAmount, setPayAmount] = useState('5000');
  const [sellerId, setSellerId] = useState('EL-1234');
  const [showPaystack, setShowPaystack] = useState(false);

  useEffect(() => { loadData() }, []);
  const loadData = async () => {
    const u = await AsyncStorage.getItem('escrow_user');
    const tx = await AsyncStorage.getItem('escrow_tx');
    if(u){ const parsed = JSON.parse(u); setUser(parsed); setEscrowId(parsed.escrowId); setScreen('home'); }
    if(tx) setTransactions(JSON.parse(tx));
  }

  const generateEscrowId = () => 'EL-' + Math.floor(1000 + Math.random()*9000);
  
  const sendOtp = () => {
    if(phone.length < 11) return Alert.alert('Enter valid phone');
    // TODO: Connect Termii / Firebase Auth here
    setOtpSent(true);
    Alert.alert('OTP Sent', `Mock OTP is 123456 for ${phone}. In production connect Termii API.`);
  }

  const verifyOtp = async () => {
    if(otp !== '123456') return Alert.alert('Invalid OTP');
    const id = generateEscrowId();
    const newUser = { phone, escrowId: id, wallet: 0, bank: '' };
    await AsyncStorage.setItem('escrow_user', JSON.stringify(newUser));
    setUser(newUser); setEscrowId(id); setScreen('home');
  }

  const createEscrowPayment = async () => {
    const newTx = {
      id: 'TX-'+Date.now(),
      buyerId: escrowId,
      sellerId: sellerId,
      amount: parseInt(payAmount),
      status: 'HELD_BY_PAYSTACK', // Paystack holds
      createdAt: new Date().toISOString()
    };
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    await AsyncStorage.setItem('escrow_tx', JSON.stringify(updated));
    setShowPaystack(true);
  }

  const onPaystackSuccess = async () => {
    setShowPaystack(false);
    Alert.alert('Paystack', 'Money held by Paystack. Seller notified of incoming money!');
    // In production: call your backend /paystack/verify
  }

  const confirmDelivery = async (txId) => {
    const updated = transactions.map(t => t.id===txId ? {...t, status:'RELEASED'} : t);
    setTransactions(updated);
    await AsyncStorage.setItem('escrow_tx', JSON.stringify(updated));
    Alert.alert('Deal Successful', 'Paystack credited seller EscrowLock account. Seller can withdraw to bank.');
    // In production: call backend -> paystack transfer to seller
  }

  const withdraw = async () => {
    Alert.alert('Withdrawal', `₦${user?.wallet || payAmount} sent to your bank. Add Paystack Transfer API in backend.`);
  }

  if(showPaystack){
    return <WebView 
      source={{ uri: `https://paystack.com/pay/escrowlock?amount=${payAmount}00&email=test@escrowlock.com` }} 
      onNavigationStateChange={(e)=>{ if(e.url.includes('success')) onPaystackSuccess(); }}
    />
  }

  if(screen==='auth'){
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.logo}>🛡️ EscrowLock Gold V2</Text>
        <Text style={styles.sub}>Register with phone + OTP</Text>
        <TextInput style={styles.input} placeholder="080..." value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        {!otpSent ? (
          <TouchableOpacity style={styles.btn} onPress={sendOtp}><Text style={styles.btnText}>Send OTP</Text></TouchableOpacity>
        ) : (
          <>
            <TextInput style={styles.input} placeholder="Enter OTP 123456" value={otp} onChangeText={setOtp} keyboardType="number-pad" />
            <TouchableOpacity style={styles.btn} onPress={verifyOtp}><Text style={styles.btnText}>Verify & Get EscrowLock ID</Text></TouchableOpacity>
          </>
        )}
      </ScrollView>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.logo}>🛡️ {escrowId}</Text>
      <Text>Phone: {user?.phone} | Wallet: ₦{user?.wallet || 0}</Text>

      <View style={styles.card}>
        <Text style={styles.title}>1. Buyer Pay to Escrow (Paystack Holds)</Text>
        <TextInput style={styles.input} placeholder="Seller Escrow ID e.g EL-1234" value={sellerId} onChangeText={setSellerId} />
        <TextInput style={styles.input} placeholder="Amount" value={payAmount} onChangeText={setPayAmount} keyboardType="numeric" />
        <TouchableOpacity style={styles.btn} onPress={createEscrowPayment}><Text style={styles.btnText}>Pay via Paystack</Text></TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>2 & 3. Transactions</Text>
        {transactions.map(tx=>(
          <View key={tx.id} style={styles.tx}>
            <Text>From {tx.buyerId} to {tx.sellerId} - ₦{tx.amount}</Text>
            <Text>Status: {tx.status === 'HELD_BY_PAYSTACK' ? '🔒 Held by Paystack - Seller notified' : '✅ Released - Deal Successful'}</Text>
            {tx.status==='HELD_BY_PAYSTACK' && tx.buyerId===escrowId && (
              <TouchableOpacity style={[styles.btn,{backgroundColor:'#0F7A4A'}]} onPress={()=>confirmDelivery(tx.id)}>
                <Text style={styles.btnText}>I Received Goods - Click Goods Delivered</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Seller Withdraw</Text>
        <TouchableOpacity style={styles.btn} onPress={withdraw}><Text style={styles.btnText}>Withdraw to My Bank</Text></TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container:{padding:20, paddingTop:60},
  logo:{fontSize:24,fontWeight:'900',color:'#0F7A4A',marginBottom:10},
  sub:{color:'#666',marginBottom:20},
  input:{borderWidth:1,borderColor:'#ddd',padding:14,borderRadius:12,marginBottom:12},
  btn:{backgroundColor:'#D4AF37',padding:15,borderRadius:12,alignItems:'center',marginTop:6},
  btnText:{fontWeight:'700',color:'#fff'},
  card:{backgroundColor:'#f8f8f8',padding:15,borderRadius:16,marginTop:20},
  title:{fontWeight:'700',marginBottom:10},
  tx:{backgroundColor:'#fff',padding:12,borderRadius:12,marginBottom:10}
})
