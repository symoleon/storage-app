import { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { UserContext } from '@/lib/context/UserContext';

export default function Account() {

  const [userList, setUserList] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const {user, setUser} = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    fetchUsers().then((data) => {
      setUserList(data);
      setLoading(false);
    }
    ).catch((error) => {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
    );
  }, []);

  const selectButtonHandler = (userId: string) => {
    setUser(userId);
    router.navigate('/');
  }

  return (
    <View>
      {loading ? (
        <Text>Ładowanie...</Text>
      ) : (
        <FlatList
          data={userList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>{item.name}</Text>
              <Button mode='contained' onPress={() => selectButtonHandler(item.id)}>Wybierz</Button>
            </View>
          )}
        />
      )}
    </View>
  );
}

async function fetchUsers() {
  const { data, error } = await supabase
    .from('user')
    .select('*')
    .order('id');

  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }
  return [{id: '0', name: 'Admin'}, ...data];
};

const styles = StyleSheet.create({
  item: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 20,
  },
});