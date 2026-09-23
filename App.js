import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert, StatusBar, ScrollView } from 'react-native';

const OPAY_BANK = "OPay";
const OPAY_NUMBER = "7042498421";
const OPAY_NAME = "Adeyemi David Adesida";

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
    Alert.alert('Deal Created', 'Pay NGN ' + newDeal.amount + ' to ' + OPAY_NUMBER + ' Ref ' + newDeal.ref);
  };

  const confirmPaid = (id) => {
    const updated = escrows.map(function(e) {
      if (e.id === id) {
        return { id: e.id, product: e.product, amount: e.amount, buyer: e.buyer, seller: e.seller, buyerName: e.buyerName, address: e.address, status: 'locked', date: e.date, ref: e.ref };
      }
      return e;
    });
    setEscrows(updated);
  };

  const changeStatus = (id, next) => {
    const updated = escrows.map(function(e) {
      if (e.id === id) {
        return { id: e.id, product: e.product, amount: e.amount, buyer: e.buyer, seller: e.seller, buyerName: e.buyerName, address: e.address, status: next, date: e.date, ref: e.ref };
      }
      return e;
    });
    setEscrows(updated);
  };

  if (!user) {
    return (
      <ScrollView contentContainerStyle={S.container}>
        <StatusBar barStyle="light-content" />
        <Text style={S.shield}>SHIELD</Text>
        <Text style={S.title}>EscrowLock Gold V2</Text>
        <Text style={S.gold}>OPay Manual Escrow Live</Text>
        <View style={S.row}>
          <TouchableOpacity style={role === 'buyer'? S.roleOn : S.roleBtn} onPress={() => setRole('buyer')}><Text style={S.roleT}>BUYER</Text></TouchableOpacity>
          <TouchableOpacity style={role === 'seller'? S.roleOn : S.roleBtn} onPress={() => setRole('seller')}><Text style={S.roleT}>SELLER</Text></TouchableOpacity>
        </View>
        {!isLogin && <TextInput style={S.input} placeholder="Full Name" placeholderTextColor="#777" value={form.name} onChangeText={(t) => setForm({ name: t, email: form.email, phone: form.phone, pass: form.pass, seller: form.seller, product: form.product, amount: form.amount, address: form.address })} />}
        <TextInput style={S.input} placeholder="Email" placeholderTextColor="#777" value={form.email} onChangeText={(t) => setForm({ name: form.name, email: t, phone: form.phone, pass: form.pass, seller: form.seller, product: form.product, amount: form.amount, address: form.address })} autoCapitalize="none" />
        <TextInput style={S.input} placeholder="Phone" placeholderTextColor="#777" value={form.phone} onChangeText={(t) => setForm({ name: form.name, email: form.email, phone: t, pass: form.pass, seller: form.seller, product: form.product, amount: form.amount, address: form.address })} />
        <TextInput style={S.input} placeholder="Password" placeholderTextColor="#777" secureTextEntry value={form.pass} onChangeText={(t) => setForm({ name: form.name, email: form.email, phone: form.phone, pass: t, seller: form.seller, product: form.product, amount: form.amount, address: form.address })} />
        <TouchableOpacity style={S.btnGold} onPress={isLogin? doLogin : doRegister}><Text style={S.btnDark}>{isLogin? 'LOGIN' : 'REGISTER'}</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}><Text style={S.link}>{isLogin? 'No account? Register' : 'Have account? Login'}</Text></TouchableOpacity>
        <Text style={S.ver}>Build 32 Fixed - OPay 7042498421</Text>
      </ScrollView>
    );
  }

  const totalLocked = escrows.filter(function(e){return e.status!== 'released' && e.status!== 'pending_payment';}).reduce(function(s,e){return s+parseInt(e.amount||0);},0);

  return (
    <View style={S.dash}>
      <View style={S.header}><View><Text style={S.hi}>Hi, {user.name}</Text><Text style={S.badge}>{user.role} - {user.email}</Text></View><TouchableOpacity onPress={() => setUser(null)}><Text style={S.logout}>Logout</Text></TouchableOpacity></View>
      <View style={S.balCard}><Text style={S.bLab}>Escrow Wallet Balance</Text><Text style={S.bAmt}>NGN {50000 - totalLocked}</Text><Text style={S.bSm}>Locked NGN {totalLocked}</Text></View>
      <View style={S.opayCard}><Text style={S.opayTitle}>PAY TO LOCK FUNDS</Text><Text style={S.opayText}>Bank: {OPAY_BANK}</Text><Text style={S.opayText}>No: {OPAY_NUMBER}</Text><Text style={S.opayText}>Name: {OPAY_NAME}</Text></View>
      <View style={S.tabs}><TouchableOpacity style={tab === 'wallet'? S.tabOn : S.tab} onPress={() => setTab('wallet')}><Text style={S.tabT}>Deals</Text></TouchableOpacity><TouchableOpacity style={tab === 'create'? S.tabOn : S.tab} onPress={() => setTab('create')}><Text style={S.tabT}>Buy Now</Text></TouchableOpacity><TouchableOpacity style={tab === 'sales'? S.tabOn : S.tab} onPress={() => setTab('sales')}><Text style={S.tabT}>Sales</Text></TouchableOpacity></View>
      {tab === 'create'? (
        <ScrollView style={{width:'100%'}}><View style={S.card}><Text style={S.cardTi}>Create Deal</Text><TextInput style={S.input} placeholder="Product" placeholderTextColor="#777" value={form.product} onChangeText={(t) => setForm({ name: form.name, email: form.email, phone: form.phone, pass: form.pass, seller: form.seller, product: t, amount: form.amount, address: form.address })} /><TextInput style={S.input} placeholder="Amount NGN" placeholderTextColor="#777" value={form.amount} onChangeText={(t) => setForm({ name: form.name, email: form.email, phone: form.phone, pass: form.pass, seller: form.seller, product: form.product, amount: t, address: form.address })} keyboardType="numeric" /><TextInput style={S.input} placeholder="Seller Email" placeholderTextColor="#777" value={form.seller} onChangeText={(t) => setForm({ name: form.name, email: form.email, phone: form.phone, pass: form.pass, seller: t, product: form.product, amount: form.amount, address: form.address })} autoCapitalize="none" /><TextInput style={S.input} placeholder="Delivery Address" placeholderTextColor="#777" value={form.address} onChangeText={(t) => setForm({ name: form.name, email: form.email, phone: form.phone, pass: form.pass, seller: form.seller, product: form.product, amount: form.amount, address: t })} /><TouchableOpacity style={S.btnGold} onPress={createDeal}><Text style={S.btnDark}>CREATE DEAL</Text></TouchableOpacity></View></ScrollView>
      ) : (
        <FlatList data={tab === 'sales'? escrows.filter(function(e){return e.seller === user.email;}) : escrows} keyExtractor={(i) => i.id} style={{width:'100%'}} ListEmptyComponent={<Text style={S.empty}>No deals yet</Text>} renderItem={({item}) => (
          <View style={S.deal}><Text style={S.dealTi}>{item.product} - NGN {item.amount}</Text><Text style={S.dealMeta}>{item.status} | Ref {item.ref}</Text><Text style={S.dealMeta}>{item.buyer} to {item.seller}</Text>{item.status === 'pending_payment'? <View><Text style={S.payInfo}>Pay to {OPAY_NUMBER} ({OPAY_NAME})</Text><TouchableOpacity style={S.btnGold} onPress={() => confirmPaid(item.id)}><Text style={S.btnDark}>I Have Paid</Text></TouchableOpacity></View> : null}{item.status === 'locked'? <TouchableOpacity style={S.btnG} onPress={() => changeStatus(item.id, 'shipped')}><Text style={S.btnW}>Mark Shipped</Text></TouchableOpacity> : null}{item.status === 'shipped'? <TouchableOpacity style={S.btnGold} onPress={() => changeStatus(item.id, 'released')}><Text style={S.btnDark}>Confirm Delivery - Pay Seller</Text></TouchableOpacity> : null}{item.status === 'released'? <Text style={S.rel}>Paid to Seller via OPay</Text> : null}</View>
        )} />
      )}
    </View>
  );
}

const S = StyleSheet.create({
  container:{flexGrow:1,backgroundColor:'#000',alignItems:'center',padding:20,paddingTop:60},
  dash:{flex:1,backgroundColor:'#000',padding:20,paddingTop:40},
  shield:{fontSize:40,color:'#FFD700',fontWeight:'bold',marginBottom:10},
  title:{color:'#fff',fontSize:24,fontWeight:'bold'},
  gold:{color:'#FFD700',marginBottom:20,marginTop:6},
  row:{flexDirection:'row',width:'100%',marginBottom:12},
  roleBtn:{flex:1,padding:12,backgroundColor:'#111',alignItems:'center',borderRadius:10,marginHorizontal:4},
  roleOn:{flex:1,padding:12,backgroundColor:'#FFD700',alignItems:'center',borderRadius:10,marginHorizontal:4},
  roleT:{color:'#fff',fontWeight:'bold'},
  input:{width:'100%',backgroundColor:'#111',color:'#fff',borderRadius:12,padding:15,marginBottom:10},
  btnGold:{width:'100%',backgroundColor:'#FFD700',padding:16,borderRadius:12,alignItems:'center',marginTop:10},
  btnDark:{color:'#000',fontWeight:'bold',textAlign:'center'},
  btnW:{color:'#fff',fontWeight:'bold',textAlign:'center'},
  btnG:{backgroundColor:'#0F7A4A',padding:10,borderRadius:8,marginTop:8,alignItems:'center'},
  link:{color:'#0F7A4A',marginTop:16,fontWeight:'bold'},
  ver:{color:'#444',fontSize:10,marginTop:20,textAlign:'center'},
  header:{flexDirection:'row',justifyContent:'space-between',width:'100%',marginBottom:12},
  hi:{color:'#fff',fontSize:16,fontWeight:'bold'},
  badge:{color:'#FFD700',fontSize:10,marginTop:2},
  logout:{color:'#ff4444',fontWeight:'bold'},
  balCard:{width:'100%',backgroundColor:'#111',borderRadius:16,padding:16,borderWidth:1,borderColor:'#FFD700',marginBottom:8},
  opayCard:{width:'100%',backgroundColor:'#0F7A4A',borderRadius:14,padding:12,marginBottom:10},
  opayTitle:{color:'#fff',fontWeight:'bold',fontSize:12,marginBottom:4},
  opayText:{color:'#fff',fontSize:13,fontWeight:'600'},
  bLab:{color:'#aaa'},
  bAmt:{color:'#fff',fontSize:28,fontWeight:'bold',marginVertical:4},
  bSm:{color:'#888',fontSize:11},
  tabs:{flexDirection:'row',width:'100%',marginBottom:10},
  tab:{flex:1,padding:10,backgroundColor:'#111',alignItems:'center',marginHorizontal:3,borderRadius:10},
  tabOn:{flex:1,padding:10,backgroundColor:'#FFD700',alignItems:'center',marginHorizontal:3,borderRadius:10},
  tabT:{color:'#fff',fontWeight:'bold',fontSize:12},
  card:{width:'100%',backgroundColor:'#111',borderRadius:14,padding:14},
  cardTi
