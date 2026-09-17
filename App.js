import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, SafeAreaView } from 'react-native';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');
  const [seller, setSeller] = useState('');
  const [deals, setDeals] = useState([]);
  const [currentDeal, setCurrentDeal] = useState(null);

  const createDeal = () => {
    if (!item || !amount) return Alert.alert('Fill item and amount');
    const newDeal = { id: 'ELNG-' + Date.now(), item, amount: parseInt(amount), seller, status: 'pending_payment', date: new Date().toLocaleString() };
    setDeals([newDeal, ...deals]); setCurrentDeal(newDeal); setScreen('pay'); setItem(''); setAmount(''); setSeller('');
  };
  const payNow = () => {
    Alert.alert('Paystack', `Pay ₦${currentDeal.amount + 20} for ${currentDeal.item}?`, [
      { text: 'Cancel' },
      { text: 'Pay Now', onPress: () => {
        setTimeout(() => {
          const updated = deals.map(d => d.id === currentDeal.id ? {...d, status: 'funds_in_escrow'} : d);
          setDeals(updated); setScreen('deals'); Alert.alert('Success ✅', 'Payment confirmed! Funds in Escrow 🔒');
        }, 1500);
      }}
    ]);
  };

  if (screen === 'pay' && currentDeal) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>💳 Pay for {currentDeal.item}</Text>
        <Text style={styles.big}>₦{currentDeal.amount + 20}</Text>
        <Text>Ref: {currentDeal.id}</Text>
        <TouchableOpacity style={styles.btn} onPress={payNow}><Text style={styles.btnText}>Pay with Paystack</Text></TouchableOpacity>
      </SafeAreaView>
    );
  }
  if (screen === 'deals') {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>📦 My Deals</Text>
        <FlatList data={deals} keyExtractor={i => i.id} renderItem={({item}) => (
          <View style={styles.card}><Text style={styles.bold}>{item.item} - ₦{item.amount}</Text><Text>Status: {item.status === 'funds_in_escrow' ? '🔒 In Escrow' : '⏳ Pending'}</Text><Text style={styles.small}>{item.id}</Text></View>
        )} />
        <TouchableOpacity style={styles.btn} onPress={() => setScreen('home')}><Text style={styles.btnText}>Home</Text></TouchableOpacity>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>🔒 EscrowLock Gold</Text>
      <Text style={styles.sub}>Secure deals, no scam</Text>
      <TextInput style={styles.input} placeholder="Item name e.g Phone 11" value={item} onChangeText={setItem} />
      <TextInput style={styles.input} placeholder="Amount e.g 1000" keyboardType="numeric" value={amount} onChangeText={setAmount} />
      <TextInput style={styles.input} placeholder="Seller phone/email" value={seller} onChangeText={setSeller} />
      <TouchableOpacity style={styles.btn} onPress={createDeal}><Text style={styles.btnText}>Create Deal</Text></TouchableOpacity>
      <TouchableOpacity style={styles.btnOutline} onPress={() => setScreen('deals')}><Text style={styles.btnOutlineText}>View My Deals ({deals.length})</Text></TouchableOpacity>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, paddingTop: 70, backgroundColor: '#fff' },
  logo: { fontSize: 32, fontWeight: 'bold', textAlign: 'center' },
  sub: { textAlign: 'center', marginBottom: 30, color: '#666' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  big: { fontSize: 40, fontWeight: 'bold', marginVertical: 20 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 10, marginBottom: 12 },
  btn: { backgroundColor: '#000', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  btnOutline: { borderWidth: 1, borderColor: '#000', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  btnOutlineText: { fontWeight: 'bold' },
  card: { borderWidth: 1, borderColor: '#eee', padding: 15, borderRadius: 12, marginBottom: 10, backgroundColor: '#f9f9f9' },
  bold: { fontWeight: 'bold' },
  small: { fontSize: 10, color: '#888' }
});