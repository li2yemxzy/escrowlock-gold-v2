import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';

export default function App() {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');

  const handleSecure = () => {
    if (!email || !amount) {
      Alert.alert('Missing', 'Enter email and amount');
      return;
    }
    Alert.alert('✅ Secured', `₦${amount} secured for ${email}. Paystack will hold funds until buyer confirms delivery.`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingTop: 60 }}>
      <Text style={styles.logo}>🛡️ EscrowLock Gold V2</Text>
      <Text style={styles.sub}>Secure Paystack Escrow - Build Test OK</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Buyer Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="buyer@gmail.com" />
        
        <Text style={styles.label}>Amount (₦)</Text>
        <TextInput style={styles.input} value={amount} onChangeText={setAmount} placeholder="50000" keyboardType="numeric" />
        
        <TouchableOpacity style={styles.btn} onPress={handleSecure}>
          <Text style={styles.btnText}>Test App - Should Open Now</Text>
        </TouchableOpacity>

        <Text style={styles.ok}>✅ If you see this, app opened successfully!</Text>
        <Text style={styles.hint}>Next: We will add AsyncStorage, WebView & withdrawal after this opens</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f9f6' },
  logo: { fontSize: 26, fontWeight: 'bold', color: '#0F7A4A', textAlign: 'center' },
  sub: { textAlign: 'center', color: '#666', marginBottom: 25, marginTop: 5 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 15, elevation: 3 },
  label: { fontWeight: '600', marginTop: 12, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, backgroundColor: '#fafafa' },
  btn: { backgroundColor: '#0F7A4A', padding: 16, borderRadius: 10, marginTop: 20, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  ok: { color: '#0F7A4A', fontWeight: 'bold', textAlign: 'center', marginTop: 20, fontSize: 16 },
  hint: { fontSize: 12, color: '#888', textAlign: 'center', marginTop: 10 }
});
