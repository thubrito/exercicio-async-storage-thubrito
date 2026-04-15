import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEY } from '../storage/storageKeys';

export default function Exercico3() {
  const [nome, setNome] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [idade, setIdade] = useState<string>('');

  const [temPerfilSalvo, setTemPerfilSalvo] = useState<boolean>(false);
  const [carregando, setCarregando] = useState<boolean>(true);

  useEffect(() => {
    carregarPerfil();
  }, []);

  const carregarPerfil = async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY.PERFIL);
      if (raw !== null) {
        const dados = JSON.parse(raw);
        setNome(dados.nome);
        setEmail(dados.email);
        setIdade(dados.idade);
        setTemPerfilSalvo(true);
      }
    } catch (error) {
      console.error("Erro ao carregar o perfil:", error);
    } finally {
      setCarregando(false);
    }
  };

  const salvarPerfil = async () => {
    try {
      const meuPerfilCompilado = { nome, email, idade };
      await AsyncStorage.setItem(STORAGE_KEY.PERFIL, JSON.stringify(meuPerfilCompilado));
      setTemPerfilSalvo(true);
      Alert.alert("Tudo certo!", "Suas informações foram salvas com sucesso.");
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  const limparPerfil = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY.PERFIL);
      setNome('');
      setEmail('');
      setIdade('');
      setTemPerfilSalvo(false);
    } catch (error) {
      console.error("Erro ao limpar:", error);
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
      <Text style={styles.titulo}>Meu Perfil</Text>

      {temPerfilSalvo && (
        <Text style={styles.avisoSucesso}>Dados carregados do seu dispositivo</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Nome completo"
        placeholderTextColor="#BDBDBD"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="Endereço de e-mail"
        placeholderTextColor="#BDBDBD"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Sua idade"
        placeholderTextColor="#BDBDBD"
        value={idade}
        onChangeText={setIdade}
        keyboardType="numeric"
      />

      <View style={styles.botoesContainer}>
        <Button title="Salvar Perfil" onPress={salvarPerfil} color="#6C63FF" />
        <View style={{ marginTop: 15 }}>
          <Button title="Limpar Dados" onPress={limparPerfil} color="#E53935" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F0EFF8',
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 26,
    fontWeight: '700',
    fontFamily: 'System',
    color: '#3D3D3D',
    letterSpacing: 0.4,
    marginBottom: 20,
    textAlign: 'center',
  },
  avisoSucesso: {
    alignSelf: 'center',
    backgroundColor: '#EDE9FC',
    padding: 8,
    borderRadius: 8,
    color: '#4B3FCB',
    marginBottom: 20,
    fontWeight: '600',
    overflow: 'hidden',
    fontSize: 13,
    fontFamily: 'System',
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    fontFamily: 'System',
    color: '#3D3D3D',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#D1CCF0',
  },
  botoesContainer: { marginTop: 10 },
});