import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEY } from '../storage/storageKeys';

export default function Exercicio1() {
  
  const [contador, setContador] = useState<number>(0);
  const [carregando, setCarregando] = useState<boolean>(true);

  useEffect(() => {
    carregarContador();
  }, []);

  const carregarContador = async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY.CONTADOR); 
      if (raw !== null) {
        setContador(JSON.parse(raw)); 
      }
    } catch (error) {
      console.error('Erro ao carregar contador:', error);
    } finally {
      setCarregando(false);
    }
  };

  const incrementarClick = async () => {
    try {
      const novoValor = contador + 1;
      setContador(novoValor); 
      await AsyncStorage.setItem(STORAGE_KEY.CONTADOR, JSON.stringify(novoValor)); 
    } catch (error) {
      console.error('Erro ao salvar', error);
    }
  };

  const zerarClick = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY.CONTADOR);
      setContador(0);
    } catch (error) {
      console.error('Erro ao zerar', error);
    }
  };

  if (carregando) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Contador de Cliques</Text>
      <Text style={styles.texto}>
        {contador === 0
          ? 'Nenhum clique ainda...'
          : `Total de cliques: ${contador} 🎯`}
      </Text>
      
      <Button title="+ Incrementar" onPress={incrementarClick} color="#6C63FF" />
      
      <View style={{ marginTop: 20 }}>
        <Button title="Reiniciar" onPress={zerarClick} color="#E53935" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    padding: 24,
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  titulo: {
    fontSize: 26,
    fontWeight: '700',
    fontFamily: 'System',
    color: '#3D3D3D',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  texto: {
    fontSize: 18,
    fontFamily: 'System',
    color: '#6C63FF',
    fontWeight: '500',
    marginBottom: 28,
    textAlign: 'center',
  }
});