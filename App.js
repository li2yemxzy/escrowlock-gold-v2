import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [txs, setTxs] = useState([]);

  useEffect(() => { 
    AsyncStorage.getItem('txs').then(v => v && setTxs(JSON.parse(v)));
  }, []);

  const save = async (list) => {
    setTxs(list);
    await AsyncStorage.setItem('txs', JSON.stringify(list));
  };

  const create = async () => {
    if(!email || !amount) return Alert.alert('Enter email and amount');
    const newTx = { id: Date.now().toString(), email, amount, status: 'Secured - Awaiting Delivery' };
    const updated = [newTx, ...txs];
    await save(updated);
    Alert.alert('Secured', `₦${amount} secured for ${email}`);
    setEmail(''); setAmount('');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🛡️ EscrowLock Gold V2</Text>
      <View style={styles.card}>
        <TextInput placeholder="Buyer email" value={email} onChangeText={setEmail} style={styles.input} />
        <TextInput placeholder="Amount" value={amount} onChangeText={setAmount} keyboardType="numeric" style={styles.input} />
        <TouchableOpacity onPress={create} style={styles.btn}><Text style={styles.btnText}>Secure with Paystack</Text></TouchableOpacity>
      </View>
      {txs.map(t => <View key={t.id} style={styles.card}><Text>₦{t.amount} - {t.email}</Text><Text style={{color:'#0F7A4A'}}>{t.status}</Text></View>)}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#f5f9f6', padding:20, paddingTop:50 },
  title: { fontSize:22, fontWeight:'bold', color:'#0F7A4A', textAlign:'center', marginBottom:20 },
  card: { backgroundColor:'white', padding:15, borderRadius:10, marginBottom:10 },
  input: { borderWidth:1, borderColor:'#ddd', borderRadius:8, padding:12, marginBottom:10 },
  btn: { backgroundColor:'#0F7A4A', padding:15, borderRadius:8, alignItems:'center' },
  btnText: { color:'white', fontWeight:'bold' }
});
