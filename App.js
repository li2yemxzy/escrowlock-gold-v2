import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert, StatusBar, ScrollView } from 'react-native';

const OPAY_ACCOUNT = {
  bank: "OPay",
  number: "7042498421",
  name: "Adeyemi David Adesida"
};

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('buyer');
  const [isLogin, setIsLogin] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', pass: '', seller: '', product: '', amount: '', address: '' });
  const [escrows, setEscrows] = useState([]);
  const [tab, setTab] = useState('wallet');

  const doRegister = () => {
    if (!form.name ||!form.email ||!form.phone ||!form.pass) {
      Alert.alert('Error', 'Fill all fields');
      return;
    }
    setUser({ name: form.name, email: form.email, phone: form.phone, role: role });
  };

  const doLogin = () => {
    if (!form.email ||!form.pass) {
      Alert.alert('Error', 'Enter email and password');
      return;
    }
    setUser({ name: form.email.split('@')[0], email: form.email, phone: '080', role: role });
  };

  const createDeal = () => {
    if (!form.product ||!form.amount ||!form.seller) {
      Alert.alert('Error', 'Enter product, amount and seller email');
      return;
    }
    const newDeal = {
      id: Date.now().toString(),
      product: form.product,
      amount: form.amount,
      buyer: user.email,
      seller: form.seller,
      buyerName: user.name,
      address: form.address,
      status: 'pending_payment',
      date: new Date().toLocaleDateString(),
      ref: 'ESL' + Date.now()
    };
    setEscrows([newDeal].concat(escrows));
    setTab('wallet');
    Alert.alert('Deal Created', 'Pay NGN ' + newDeal.amount + ' to OPay ' + OPAY_ACCOUNT.number + ' to lock. Ref: ' + newDeal.ref);
  };

  const confirmBuyerPaid = (id) => {
    const updated = escrows.map(function(e) {
      if (e.id === id) {
        return { id: e.id, product: e.product, amount: e.amount, buyer: e.buyer, seller: e.seller, buyerName: e.buyerName, address: e.address, status: 'locked', date: e.date, ref: e.ref };
      }
      return e;
    });
    setEscrows(updated);
    Alert.alert('Payment Confirmed', 'Funds locked in your OPay. Seller has been notified to ship.');
  };

  const changeStatus = (id, next) => {
    const updated = escrows.map(function(e) {
      if (e.id === id) {
        return { id: e.id, product: e.product, amount: e.amount, buyer: e.buyer, seller: e.seller, buyerName: e.buyerName, address: e.address, status: next, date: e.date, ref: e.ref };
      }
      return e;
    });
    setEscrows(updated);
    if (next === 'delivered') {
      const esc = escrows.find(function(x){return x.id===id;});
      Alert.alert('Delivery Confirmed', 'Buyer confirmed! Now open OPay app and transfer NGN ' + esc.amount + ' to seller ' + esc.seller);
      setTimeout(function(){
        setEscrows(function(prev){
          return prev.map(function(e){ if(e.id===id){return { id: e.id, product: e.product, amount: e.amount, buyer: e.buyer, seller: e.seller, buyerName: e.buyerName, address: e.address, status: 'released', date: e.date, ref: e.ref }; } return e; });
        });
      }, 1200);
    }
  };

  if (!user) {
    return (
      <ScrollView contentContainerStyle={S.container}>
        <StatusBar barStyle="light-content" />
        <Text style={S.shield}>SHIELD</Text>
        <Text style={S.title}>EscrowLock Gold V2</Text>
        <Text style={S.gold}>Manual Escrow - OPay Secured</Text>
        <View style={S.row}>
          <TouchableOpacity style={[S.roleBtn, role==='buyer' && S.roleOn]} onPress={function(){setRole('buyer');}}><Text style={S.roleT}>BUYER</Text></TouchableOpacity>
          <TouchableOpacity style={[S.roleBtn, role==='seller' && S.roleOn]} onPress={function(){setRole('seller');}}><Text style={S.roleT}>SELLER</Text></TouchableOpacity>
        </View>
        {!isLogin && <TextInput style={S.input} placeholder="Full Name" placeholderTextColor="#777" value={form.name} onChangeText={function(t){setForm({ name: t, email: form.email, phone: form.phone, pass: form.pass, seller: form.seller, product: form.product, amount: form.amount, address: form.address });}} />}
        <TextInput style={S.input} placeholder="Email" placeholderTextColor="#777" value={form.email} onChangeText={function(t){setForm({ name: form.name, email: t, phone: form.phone, pass: form.pass, seller: form.seller, product: form.product, amount: form.amount, address: form.address });}} autoCapitalize="none" />
        <TextInput style={S.input} placeholder="Phone" placeholderTextColor="#777" value={form.phone} onChangeText={function(t){setForm({ name: form.name, email: form.email, phone: t, pass: form.pass, seller: form.seller, product: form.product, amount: form.amount, address: form.address });}} />
        <TextInput style={S.input} placeholder="Password" placeholderTextColor="#777" secureTextEntry value={form.pass} onChangeText={function(t){setForm({ name: form.name, email: form.email, phone: form.phone, pass: t, seller: form.seller, product: form.product, amount: form.amount, address: form.address });}} />
        <TouchableOpacity style={S.btnGold} onPress={isLogin? doLogin : doRegister}><Text style={S.btnDark}>{isLogin? 'LOGIN' : 'REGISTER AS ' + role.toUpperCase()}</Text></TouchableOpacity>
        <TouchableOpacity onPress={function(){setIsLogin(!isLogin);}}><Text style={S.link}>{isLogin? 'No account? Register' : 'Have account? Login'}</Text></TouchableOpacity>
        <Text style={S.ver}>Build 32 - OPay 7042498421 - Manual Escrow</Text>
      </ScrollView>
    );
  }

  const totalLocked = escrows.filter(function(e){return e.status!=='released' && e.status!=='pending_payment';}).reduce(function(s,e){return s+parseInt(e.amount||0);},0);
  const walletBalance = 50000 - totalLocked;

  return (
    <View style={S.dash}>
      <View style={S.header}><View><Text style={S.hi}>Hi, {user.name}</Text><Text style={S.badge}>{user.role.toUpperCase()} - {user.email}</Text></View><TouchableOpacity onPress={function(){setUser(null);}}><Text style={S.logout}>Logout</Text></TouchableOpacity></View>
      <View style={S.balCard}><Text style={S.bLab}>Escrow Wallet</Text><Text style={S.bAmt}>NGN {walletBalance}</Text><Text style={S.bSm}>Locked: NGN {totalLocked} | Escrow Account: OPay {OPAY_ACCOUNT.number}</Text></View>
      <View style={S.opayCard}><Text style={S.opayTitle}>PAY HERE TO LOCK FUNDS</Text><Text style={S.opayText}>Bank: {OPAY_ACCOUNT.bank}</Text><Text style={S.opayText}>Account No: {OPAY_ACCOUNT.number}</Text><Text style={S.opayText}>Name: {OPAY_ACCOUNT.name}</Text><Text style={S.opayNote}>After transfer, tap "I Have Paid" below</Text></View>
      <View style={S.tabs}><TouchableOpacity style={[S.tab, tab==='wallet' && S.tabOn]} onPress={function(){setTab('wallet');}}><Text style={S.tabT}>Deals</Text></TouchableOpacity><TouchableOpacity style={[S.tab, tab==='create' && S.tabOn]} onPress={function(){setTab('create');}}><Text style={S.tabT}>Buy Now</Text></TouchableOpacity><TouchableOpacity style={[S.tab, tab==='sales' && S.tabOn]} onPress={function(){setTab('sales');}}><Text style={S.tabT}>Sales</Text></TouchableOpacity></View>
      {tab==='create'? (
        <ScrollView style={{width:'100%'}}><View style={S.card}><Text style={S.cardTi}>Create Escrow Deal</Text><TextInput style={S.input} placeholder="Product Name" placeholderTextColor="#777" value={form.product} onChangeText={function(t){setForm({ name: form.name, email: form.email, phone: form.phone, pass: form.pass, seller: form.seller, product: t, amount: form.amount, address: form.address });}} /><TextInput style={S.input} placeholder="Amount NGN" placeholderTextColor
