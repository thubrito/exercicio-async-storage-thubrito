import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEY } from '../storage/storageKeys';

export default function Exercicio2() {

  const [texto, setTexto] = useState<string>('');
  const [ultimaAcao, setUltimaAcao] = useState<string>('');
  const [carregando, setCarregando] = useState<boolean>(true);

  useEffect(() => {
    carregarRascunho();
  }, []);

  const carregarRascunho = async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY.RASCUNHO);
      if (raw !== null) {
        const rascunhoSalvo = JSON.parse(raw);
        setTexto(rascunhoSalvo.texto);
        setUltimaAcao(rascunhoSalvo.dataHora);
      }
    } catch (error) {
      console.error("Erro ao carregar rascunho:", error);
    } finally {
      setCarregando(false);
    }
  };

  const salvarRascunhoAutomaticamente = async (caracteresDigitados: string) => {
    setTexto(caracteresDigitados);

    const dataHoraAtual = new Date().toLocaleString('pt-BR');
    setUltimaAcao(dataHoraAtual);

    try {
      const informacoes = {
        texto: caracteresDigitados,
        dataHora: dataHoraAtual
      };
      await AsyncStorage.setItem(STORAGE_KEY.RASCUNHO, JSON.stringify(informacoes));
    } catch (error) {
      console.error("Erro ao salvar rascunho:", error);
    }
  };

  const apagarRascunho = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY.RASCUNHO);
      setTexto('');
      setUltimaAcao('');
    } catch (error) {
      console.error("Erro ao apagar:", error);
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
      <Text style={styles.titulo}>Bloco de Notas</Text>

      <TextInput
        style={styles.input}
        multiline={true}
        placeholder="Escreva algo aqui... Seu rascunho é salvo automaticamente."
        placeholderTextColor="#BDBDBD"
        value={texto}
        onChangeText={(valorQueFoiDigitado) => salvarRascunhoAutomaticamente(valorQueFoiDigitado)}
      />

      {ultimaAcao !== '' && (
        <Text style={styles.aviso}>Salvo automaticamente em {ultimaAcao}</Text>
      )}

      <View style={styles.areaBotao}>
        <Button title="Limpar Rascunho" onPress={apagarRascunho} color="#E53935" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F0EFF8',
  },
  titulo: {
    fontSize: 26,
    fontWeight: '700',
    fontFamily: 'System',
    color: '#3D3D3D',
    letterSpacing: 0.4,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    textAlignVertical: 'top',
    fontSize: 16,
    fontFamily: 'System',
    color: '#3D3D3D',
    lineHeight: 24,
    borderWidth: 1,
    borderColor: '#D1CCF0',
  },
  aviso: {
    fontSize: 12,
    color: '#6C63FF',
    marginTop: 10,
    fontStyle: 'italic',
    fontFamily: 'System',
    textAlign: 'right',
  },
  areaBotao: { marginTop: 20 },
});