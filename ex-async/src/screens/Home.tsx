import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function Home(props: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Exercícios AsyncStorage</Text>

      <View style={styles.botaoContainer}>
        <Button
          title="1. Contador de Cliques"
          onPress={() => props.navigation.navigate('Exercicio1')}
          color="#6C63FF"
        />
      </View>

      <View style={styles.botaoContainer}>
        <Button
          title="2. Bloco de Notas"
          onPress={() => props.navigation.navigate('Exercicio2')}
          color="#6C63FF"
        />
      </View>

      <View style={styles.botaoContainer}>
        <Button
          title="3. Meu Perfil"
          onPress={() => props.navigation.navigate('Exercicio3')}
          color="#6C63FF"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#F0EFF8',
  },
  titulo: {
    fontSize: 26,
    fontWeight: '700',
    fontFamily: 'System',
    color: '#3D3D3D',
    letterSpacing: 0.4,
    textAlign: 'center',
    marginBottom: 40,
  },
  botaoContainer: { marginBottom: 15 },
});