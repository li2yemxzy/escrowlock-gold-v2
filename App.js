import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');
  const [seller, setSeller] = useState('');
  const [deals, setDeals] = useState([]);

  const createDeal = () => {
    if(!item || !amount || !seller){
      Alert.alert("Fill all fields", "Item, Amount and Seller is required");
      return;
    }
    const newDeal = { id: Date.now(), item, amount, seller };
    setDeals([...deals, newDeal]);
    setItem(''); setAmount(''); setSeller('');
    Alert.alert("🔒 Deal Created!", `${item} - ₦${amount} secured`);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scroll}>
        
        {/* LOGO HEADER - GOLD LION */}
        <View style={styles.header}>
          <Image source={require('./icon.png')} style={styles.logo} />
          <Text style={styles.title}>EscrowLock Gold</Text>
          <Text style={styles.subtitle}>Secure deals, no scam 🦁</Text>
        </View>

        {/* INPUTS */}
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Item name e.g Phone 11"
            placeholderTextColor="#999"
            value={item}
            onChangeText={setItem}
          />
          <TextInput
            style={styles.input}
            placeholder="Amount e.g 1000"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <TextInput
            style={styles.input}
            placeholder="Seller phone/email"
            placeholderTextColor="#999"
            value={seller}
            onChangeText={setSeller}
          />

          <TouchableOpacity style={styles.goldButton} onPress={createDeal}>
            <Text style={styles.goldButtonText}>Create Deal 🔒</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.outlineButton}>
            <Text style={styles.outlineText}>View My Deals ({deals.length})</Text>
          </TouchableOpacity>
        </View>

        {/* DEALS LIST */}
        {deals.map(d => (
          <View key={d.id} style={styles.dealBox}>
            <Text style={styles.dealText}>🦁 {d.item} - ₦{d.amount}</Text>
            <Text style={styles.dealSub}>{d.seller}</Text>
          </View>
        ))}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  scroll: { padding: 20, paddingTop: 60 },
  header: { alignItems: 'center', marginBottom: 30 },
  logo: { width: 90, height: 90, borderRadius: 20, borderWidth: 2, borderColor: '#D4AF37' },
  title: { color: '#D4AF37', fontSize: 28, fontWeight: 'bold', marginTop: 15, letterSpacing: 1 },
  subtitle: { color: '#00A651', fontSize: 14, marginTop: 5, fontWeight: '600' },
  card: { backgroundColor: '#111', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#222' },
  input: { backgroundColor: '#1A1A1A', color: '#fff', borderWidth: 1, borderColor: '#333', borderRadius: 12, padding: 16, marginBottom: 15, fontSize: 16 },
  goldButton: { backgroundColor: '#D4AF37', borderRadius: 14, padding: 18, alignItems: 'center', marginTop: 10 },
  goldButtonText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  outlineButton: { borderWidth: 1, borderColor: '#D4AF37', borderRadius: 14, padding: 18, alignItems: 'center', marginTop: 15 },
  outlineText: { color: '#D4AF37', fontWeight: 'bold', fontSize: 16 },
  dealBox: { backgroundColor: '#1A1A1A', borderLeftWidth: 4, borderLeftColor: '#D4AF37', padding: 15, borderRadius: 10, marginTop: 15 },
  dealText: { color: '#fff', fontWeight: 'bold' },
  dealSub: { color: '#888', marginTop: 4 }
});
