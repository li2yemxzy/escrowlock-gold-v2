import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert, StatusBar, ScrollView, Linking } from 'react-native';

// REPLACE WITH YOUR PAYSTACK PUBLIC KEY
const PAYSTACK_PUBLIC_KEY = "pk_test_xxxxxxxxxxxxxxxxxxxx";

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('buyer'); // buyer or seller
  const [authMode, setAuthMode] = useState('register'); // register | login
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'', sellerEmail:'', product:'', amount:'', address:'' });
  const [escrows, setEscrows] = useState([]);
  const [tab, setTab] = useState('wallet');

  const register = () => {
    if (!form.name ||!form.email ||!form.phone ||!form.password) return Alert.alert('Fill all fields');
    setUser({ name: form.name, email: form.email, phone: form.phone, role });
    Alert.alert('Welcome', `${form.name} registered as ${role.toUpperCase()}`);
  };

  const login = () => {
    if (!form.email ||!form.password) return Alert.alert('Enter email & password');
    // For demo, any login works - in production check backend
    setUser({ name: form.email.split('@')[0], email: form.email, phone: '080...', role });
  };

  const payWithPaystack = () => {
    if (!form.product ||!form.amount ||!form.sellerEmail) return Alert.alert('Fill product, amount, seller email');
    const amountKobo = parseInt(form.amount) * 100;
    // Open Paystack Checkout
    const paystackUrl = `https://paystack.com/pay/escrowlock?amount=${amountKobo}`;
    // Simulate payment success for now - replace with real Paystack integration
    Alert.alert('Paystack', `Pay ₦${form.amount} for ${form.product}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Pay Now', onPress: () => {
          const newEscrow = {
            id: Date.now().toString(),
            product: form.product,
            amount: form.amount,
            buyer: user.email,
            seller: form.sellerEmail,
            buyerName: user.name,
            address: form.address,
            status: 'locked', // locked -> shipped -> delivered -> released
            date: new Date().toLocaleString(),
            paystackRef: 'PSK_'+Date.now()
          };
          setEscrows([newEscrow,...escrows]);
          setForm({...form, product:'', amount:'', sellerEmail:'', address:'' });
          setTab('wallet');
          Alert.alert('Payment Success', `₦${newEscrow.amount} locked in Escrow. Seller will be notified. Ref: ${newEscrow.paystackRef}`);
        }
      }
    ]);
  };

  const updateStatus = (id, newStatus) => {
    let updated = escrows.map(e => e.id === id? {...e, status: newStatus} : e);
    setEscrows(updated);
    if (newStatus === 'delivered') {
      // Auto pay seller via Paystack Transfer (simulated - in production call your backend /transfer)
      const escrow = escrows.find(e => e.id === id);
      Alert.alert('Delivery Confirmed', `Paystack will now pay ₦${escrow.amount} to seller ${escrow.seller} automatically. Transfer initiated!`);
      setTimeout(() => {
        setEscrows(prev => prev.map(e => e.id === id? {...e, status: 'released'} : e));
      }, 1500);
    }
  };

  // AUTH SCREENS
  if (!user) {
    return (
      <ScrollView contentContainerStyle={S.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <Text style={S.shield}>🛡️</Text>
        <Text style={S.title}>EscrowLock Gold V2</Text>
        <Text style={S.gold}>Secure Escrow with Paystack</Text>

        <View style={S.roleRow}>
          <TouchableOpacity style={[S.roleBtn, role==='buyer'&&S.roleActive]} onPress={()=>setRole('buyer')}><Text style={[S.roleText, role==='buyer'&&S.roleTextActive]}>BUYER</Text></TouchableOpacity>
          <TouchableOpacity style={[S.roleBtn, role==='seller'&&S.roleActive]} onPress={()=>setRole('seller')}><Text style={[S.roleText, role==='seller'&&S.roleTextActive]}>SELLER</Text></TouchableOpacity>
        </View>

        {authMode==='register' && <TextInput style={S.input} placeholder="Full Name" placeholderTextColor="#777" value={form.name} onChangeText={t=>setForm({...form,name:t})} />}
        <TextInput style={S.input} placeholder="Email" placeholderTextColor="#777" value={form.email} onChangeText={t=>setForm({...form,email:t})} autoCapitalize="none" />
        <TextInput style={S.input} placeholder="Phone" placeholderTextColor="#777" value={form.phone} onChangeText={t=>setForm({...form,phone:t})} keyboardType="phone-pad" />
        <TextInput style={S.input} placeholder="Password" placeholderTextColor="#777" value={form.password} onChangeText={t=>setForm({...form,password:t})} secureTextEntry />

        <TouchableOpacity style={S.btnGold} onPress={authMode==='register'?register:login}>
          <Text style={S.btnDark}>{authMode==='register'?`REGISTER AS ${role.toUpperCase()}`:'LOGIN'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>setAuthMode(authMode==='register'?'login':'register')}>
          <Text style={S.link}>{authMode==='register'?'Have account? Login':'No account? Register'}</Text>
        </TouchableOpacity>
        <Text style={S.ver}>Build 30 FINAL • Icon Active • Paystack Integrated</Text>
      </ScrollView>
    );
  }

  // DASHBOARD
  const myEscrows = escrows.filter(e => e.buyer===user.email || e.seller===user.email || user.role==='buyer');
  const totalLocked = escrows.filter(e=>e.status!=='released').reduce((s,e)=>s+parseInt(e.amount||0),0);
  const totalReleased = escrows.filter(e=>e.status==='released').reduce((s,e)=>s+parseInt(e.amount||0),0);

  return (
    <View style={S.dashContainer}>
      <StatusBar barStyle="light-content" />
      <View style={S.header}>
        <View><Text style={S.hi}>Hi, {user.name}</Text><Text style={S.roleBadge}>{user.role.toUpperCase()} • {user.email}</Text></View>
        <TouchableOpacity onPress={()=>setUser(null)}><Text style={S.logout}>Logout</Text></TouchableOpacity>
      </View>

      <View style={S.balanceCard}>
        <Text style={S.bLabel}>Escrow Wallet</Text>
        <Text style={S.bAmount}>₦{(user.role==='buyer'?50000-totalLocked:totalReleased).toLocaleString()}</Text>
        <View style={S.bRow}><Text style={S.bSmall}>Locked: ₦{totalLocked.toLocaleString()}</Text><Text style={S.bSmall}>Released: ₦{totalReleased.toLocaleString()}</Text></View>
      </View>

      <View style={S.tabs}>
        <TouchableOpacity style={[S.tab, tab==='wallet'&&S.tabActive]} onPress={()=>setTab('wallet')}><Text style={[S.tText, tab==='wallet'&&S.tActive]}>My Deals</Text></TouchableOpacity>
        {user.role==='buyer' && <TouchableOpacity style={[S.tab, tab==='create'&&S.tabActive]} onPress={()=>setTab('create')}><Text style={[S.tText, tab==='create'&&S.tActive]}>Buy Now</Text></TouchableOpacity>}
        <TouchableOpacity style={[S.tab, tab==='sales'&&S.tabActive]} onPress={()=>setTab('sales')}><Text style={[S.tText, tab==='sales'&&S.tActive]}>Sales</Text></TouchableOpacity>
      </View>

      {tab==='create' && user.role==='buyer' && (
        <ScrollView style={{width:'100%'}}>
          <View style={S.card}>
            <Text style={S.cardTitle}>Create Escrow Deal - Pay with Paystack</Text>
            <TextInput style={S.input} placeholder="Product Name (e.g. iPhone 15 Pro)" placeholderTextColor="#777" value={form.product} onChangeText={t=>setForm({...form,product:t})} />
            <TextInput style={S.input} placeholder="Amount ₦" placeholderTextColor="#777" value={form.amount} onChangeText={t=>setForm({...form,amount:t})} keyboardType="numeric" />
            <TextInput style={S.input} placeholder="Seller Email" placeholderTextColor="#777" value={form.sellerEmail} onChangeText={t=>setForm({...form,sellerEmail:t})} autoCapitalize="none" />
            <TextInput style={S.input} placeholder="Delivery Address" placeholderTextColor="#777" value={form.address} onChangeText={t=>setForm({...form,address:t})} />
            <TouchableOpacity style={S.btnGold} onPress={payWithPaystack}><Text style={S.btnDark}>PAY ₦{form.amount||'0'} WITH PAYSTACK - LOCK IN ESCROW</Text></TouchableOpacity>
            <Text style={S.note}>Money is held by EscrowLock. Seller is paid automatically after you confirm delivery.</Text>
          </View>
        </ScrollView>
      )}

      {tab!=='create' && (
        <FlatList
          data={tab==='sales'?escrows.filter(e=>e.seller===user.email):myEscrows}
          keyExtractor={i=>i.id}
          style={{width:'100%'}}
          ListEmptyComponent={<Text style={S.empty}>No deals yet. {user.role==='buyer'?'Tap Buy Now to start.':'Waiting for buyers.'}</Text>}
          renderItem={({item})=>(
            <View style={S.dealCard}>
              <Text style={S.dTitle}>{item.product}</Text>
              <Text style={S.dMeta}>₦{item.amount} • {item.status.toUpperCase()} • {item.date}</Text>
              <Text style={S.dMeta}>Buyer: {item.buyerName} ({item.buyer})</Text>
              <Text style={S.dMeta}>Seller: {item.seller}</Text>
              <Text style={S.dMeta}>Ref: {item.paystackRef}</Text>

              <View style={S.actionRow}>
                {item.status==='locked' && user.role==='seller' && (
                  <TouchableOpacity style={S.btnGreen} onPress={()=>updateStatus(item.id,'shipped')}><Text style={S.btnW}>Mark Shipped</Text></TouchableOpacity>
                )}
                {item.status==='shipped' && user.role==='buyer' && (
                  <TouchableOpacity style={S.btnGold} onPress={()=>updateStatus(item.id,'delivered')}><Text style={S.btnDark}>Confirm Delivery - Pay Seller</Text></TouchableOpacity>
                )}
