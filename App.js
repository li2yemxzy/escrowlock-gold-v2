import React, { useState, useEffect, createContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EscrowContext = createContext();

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const saved = await AsyncStorage.getItem('escrow_tx');
      if (saved) setTransactions(JSON.parse(saved));
    } catch (e) {}
  };

  const createEscrow = async () => {
    if (!email || !amount) {
      Alert.alert('Error', 'Enter email and amount');
      return;
    }
    const newTx = {
      id: Date.now().toString(),
      buyer: email,
      amount: parseFloat(amount),
      status: 'Funds Secured - Awaiting Delivery',
      date: new Date().toLocaleString()
    };
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    await AsyncStorage.setItem('escrow_tx', JSON.stringify(updated));
    Alert.alert('Success', `₦${amount} secured for ${email}. Seller notified. Buyer will confirm delivery to release.`);
    setEmail(''); setAmount('');
  };

  const confirmDelivery = async (id) => {
    const updated = transactions.map(tx => 
      tx.id === id ? {...tx, status: 'Delivered - Funds Released to Seller'} : tx
    );
    setTransactions(updated);
    await AsyncStorage.setItem('escrow_tx', JSON.stringify(updated));
    Alert.alert('Released', 'Funds released to seller!');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{padding: 20}}>
      <Text style={styles.logo}>🛡️ EscrowLock Gold V2</Text>
      <Text style={styles.sub}>Secure Paystack Escrow</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Buyer Email (to notify)</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="buyer@email.com" keyboardType="email-address" />
        <Text style={styles.label}>Amount (₦)</Text>
        <TextInput style={styles.input} value={amount} onChangeText={setAmount} placeholder="50000" keyboardType="numeric" />
        <TouchableOpacity style={styles.button} onPress={createEscrow}>
          <Text style={styles.buttonText}>Secure Funds with Paystack</Text>
        </TouchableOpacity>
        <Text style={styles.hint}>Flow: Buyer pays → We hold → Seller delivers → Buyer taps Delivered → Auto release</Text>
      </View>

      {transactions.map(tx => (
        <View key={tx.id} style={styles.txCard}>
          <Text style={styles.txAmount}>₦{tx.amount}</Text>
          <Text>{tx.buyer}</Text>
          <Text style={styles.status}>{tx.status}</Text>
          {tx.status.includes('Awaiting Delivery') && (
            <TouchableOpacity style={styles.deliveredBtn} onPress={() => confirmDelivery(tx.id)}>
              <Text style={styles.buttonText}>Buyer: Confirm Delivered & Release</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f9f6' },
  logo: { fontSize: 24, fontWeight: 'bold', color: '#0F7A4A', textAlign: 'center', marginTop: 40 },
  sub: { textAlign: 'center', color: '#666', marginBottom: 20 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 15, elevation: 2, marginBottom: 20 },
  label: { fontWeight: '600', marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, marginTop: 5 },
  button: { backgroundColor: '#0F7A4A', padding: 15, borderRadius: 10, marginTop: 20, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold' },
  hint: { fontSize: 11, color: '#888', marginTop: 10, textAlign: 'center' },
  txCard: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 10 },
  txAmount: { fontSize: 18, fontWeight: 'bold' },
  status: { color: '#0F7A4A', marginTop: 5, fontWeight: '600' },
  deliveredBtn: { backgroundColor: '#0F7A4A', padding: 12, borderRadius: 8, marginTop: 10, alignItems: 'center' }
});
