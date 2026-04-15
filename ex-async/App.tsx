import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './src/screens/Home';
import Exercicio1 from './src/screens/Exercicio1';
import Exercicio2 from './src/screens/Exercicio2';
import Exercicio3 from './src/screens/Exercico3';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{ title: 'Menu Principal' }} 
        />
        
        <Stack.Screen 
          name="Exercicio1" 
          component={Exercicio1} 
          options={{ title: 'Exercício 1' }} 
        />

        <Stack.Screen 
          name="Exercicio2" 
          component={Exercicio2} 
          options={{ title: 'Exercício 2' }} 
        />

        <Stack.Screen 
          name="Exercicio3" 
          component={Exercicio3} 
          options={{ title: 'Exercício 3' }} 
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
