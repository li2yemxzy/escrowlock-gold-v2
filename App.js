import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';

export default function App() {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');

  const handleSecure = () => {
    if (!email || !amount) return Alert.alert('Missing', 'Enter buyer email and amount');
    Alert.alert('✅ Escrow Created', `₦${amount} escrowed for ${email}\nItem: ${desc || 'General'}\n\nNext: Paystack will hold funds. Funds release when buyer confirms delivery.`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingTop: 50 }}>
      <Text style={styles.logo}>🛡️ EscrowLock Gold V2</Text>
      <Text style={styles.sub}>Paystack Secured Escrow</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Buyer Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="buyer@gmail.com" keyboardType="email-address" autoCapitalize="none" />
        
        <Text style={styles.label}>Amount (₦)</Text>
        <TextInput style={styles.input} value={amount} onChangeText={setAmount} placeholder="50000" keyboardType="numeric" />
        
        <Text style={styles.label}>Item Description</Text>
        <TextInput style={[styles.input, { height: 80 }]} value={desc} onChangeText={setDesc} placeholder="What is buyer paying for?" multiline />

        <TouchableOpacity style={styles.btn} onPress={handleSecure}>
          <Text style={styles.btnText}>Create Secure Escrow</Text>
        </TouchableOpacity>

        <View style={styles.info}>
          <Text style={styles.infoText}>✅ Paystack holds money</Text>
          <Text style={styles.infoText}>✅ Buyer confirms delivery</Text>
          <Text style={styles.infoText}>✅ You get paid instantly</Text>
          <Text style={styles.infoText}>✅ 2% platform fee</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f9f6' },
  logo: { fontSize: 24, fontWeight: 'bold', color: '#0F7A4A', textAlign: 'center' },
  sub: { textAlign: 'center', color: '#666', marginBottom: 20, marginTop: 4 },
  card: { backgroundColor: 'white', padding: 18, borderRadius: 15, elevation: 2 },
  label: { fontWeight: '600', marginTop: 14, marginBottom: 6, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, backgroundColor: '#fafafa' },
  btn: { backgroundColor: '#0F7A4A', padding: 16, borderRadius: 10, marginTop: 22, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  info: { marginTop: 20, backgroundColor: '#e8f5e9', padding: 12, borderRadius: 10 },
  infoText: { color: '#2e7d32', marginBottom: 4, fontSize: 13 }
});
