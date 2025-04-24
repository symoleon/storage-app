import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { Button, TextInput } from 'react-native-paper';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';

type Props = {
  hideModal: () => void;
  setItems: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function NewItemForm({ hideModal, setItems }: Props) {
  const [newProductName, setNewProductName] = useState('');
  const router = useRouter();
  return (
    <View>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Dodaj nowy produkt</Text>
      <TextInput
        label="Nazwa produktu"
        value={newProductName}
        onChangeText={text => setNewProductName(text)}
        mode="flat"
        style={{ marginBottom: 10 }}
        placeholder="Nazwa produktu"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="done"
      />
      <Button mode='contained' onPress={() => {
        submitHandler(newProductName).then(item => {
          setItems(prevItems => [...prevItems, item]);
          hideModal();
          setNewProductName('');
        });
      }}>
        Dodaj
      </Button>
    </View>
  );
}

async function submitHandler(productName: string) {
  if (!productName) {
    console.error('Product name is required');
    return;
  }
  const { data, error } = await supabase
    .from('item')
    .insert({ name: productName })
    .select()
    .single();
  if (error) {
    console.error('Error adding item:', error);
  }
  if (data) {
    return data;
  }
} 