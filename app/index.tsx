import React, { useState, useEffect } from 'react';
import { Text, FlatList, StyleSheet, SafeAreaView, Platform, StatusBar, Alert, View } from 'react-native';
import { Button, Card, Modal, Portal, TextInput } from 'react-native-paper';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { supabase } from '@/lib/supabase';
import { Link, useRouter } from 'expo-router';
import { useUser } from '@/lib/context/UserContext';
import NewItemForm from '@/components/NewItemForm';
import type { Item } from '@/lib/types';
import { fetchAllItems, fetchItemsByUserId } from '@/lib/item';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function HomeScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const user = useUser();

  const [addProductModalVisible, setAddProductModalVisible] = useState(false);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  useEffect(() => {
    fetchItems();
    const cleanup = setupSupabaseSubscription();
    return cleanup;
  }, [user]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const items = await fetchItemsByUserId(user);
      setItems(items || []);
    } catch (error) {
      console.error('Wystąpił wyjątek:', error);
      Alert.alert('Błąd', 'Wystąpił nieoczekiwany błąd');
    } finally {
      setLoading(false);
    }
  };

  const setupSupabaseSubscription = () => {
    const subscription = supabase
      .channel('table-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'item',
          filter: `send_notification=eq.true`,
        },
        (payload: any) => {
          if (payload.new && payload.old && payload.new.stock !== payload.old.stock) {
            if (payload.new.stock <= payload.old.stock) {
              sendLocalNotification(
                `Brakuje ${payload.new.name}!`,
                `Produkt się kończy! Obecny stan: ${payload.new.stock}`
              );
            }
            
            setItems(prevItems => 
              prevItems.map(item => 
                item.id === payload.new.id ? payload.new : item
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  };

  const sendLocalNotification = async (title: string, body: string) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
      },
      trigger: null,
    });
  };

  const renderItem = ({ item }: { item: Item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardContent}>
          <View>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemStock}>Stan magazynowy: {item.stock}</Text>
          </View>
          <Link href={{pathname: "/product/[productId]", params: {productId: item.id}}} asChild>
            <Button mode="contained">Edytuj</Button>
          </Link>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Portal>
        <Modal visible={addProductModalVisible} onDismiss={() => setAddProductModalVisible(false)} contentContainerStyle={{ backgroundColor: 'white', padding: 20 }}>
          <NewItemForm hideModal={() => setAddProductModalVisible(false)} setItems={setItems} />
        </Modal>
      </Portal>
      <View style={styles.accountButtonContainer}>
        <Link href="/account" asChild>
          <Button mode="contained">Konto</Button>
        </Link>
      </View>
      <Text style={styles.header}>Lista przedmiotów</Text>
      {loading ? (
        <Text style={styles.loading}>Ładowanie...</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
      <View style={{ borderTopColor: '#ccc', borderTopWidth: 1, display: 'flex', flexDirection: 'column', gap: 10, padding: 10 }}>
        <Button mode="contained" onPress={() => setAddProductModalVisible(true)}>
          Dodaj produkt
        </Button>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
          <Link href={"/consumption"} asChild>
            <Button mode="contained">
              Edytuj zużycia
            </Button>
          </Link>
          <Link href={"/order"} asChild>
            <Button mode="contained">
              Edytuj zamówienia
            </Button>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

async function registerForPushNotificationsAsync() {
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      Alert.alert('Uwaga', 'Nie udało się uzyskać uprawnień do wysyłania powiadomień');
      return;
    }
  } else {
    console.log('Powiadomienia wymagają fizycznego urządzenia');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 16,
    color: '#333',
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#fff',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  itemStock: {
    fontSize: 16,
    color: '#555',
  },
  loading: {
    textAlign: 'center',
    fontSize: 18,
    margin: 24,
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});