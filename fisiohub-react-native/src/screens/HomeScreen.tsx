import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define a type for the root stack navigator's parameter list
type RootStackParamList = {
  Home: undefined; // Home screen does not take any parameters
  Registration: undefined; // Registration screen does not take any parameters yet
  Success: undefined; // Success screen does not take any parameters yet
};

// Define the type for the navigation prop of the Home screen
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

function HomeScreen({ navigation }: HomeScreenProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>FisioHub</Text>
        <Text style={styles.subtitle}>Sua Reabilitação em um só lugar</Text>

        <Text style={styles.introText}>
          Bem-vindo ao FisioHub, sua plataforma completa para acompanhamento de
          reabilitação fisioterápica online.
        </Text>

        <View style={styles.bulletPointsContainer}>
          <Text style={styles.bulletPoint}>• Acompanhamento personalizado</Text>
          <Text style={styles.bulletPoint}>• Exercícios guiados</Text>
          <Text style={styles.bulletPoint}>• Evolução do tratamento</Text>
          <Text style={styles.bulletPoint}>• Comunicação direta com seu fisioterapeuta</Text>
        </View>

        <Text style={styles.infoText}>
          Olá! O aplicativo FisioHub ainda está em construção. A função de
          cadastro já está funcionando! Ao fazer o cadastro, nossa equipe entrará
          em contato via WhatsApp. Para acessar de forma imediata, acesse a
          aplicação pelo computador na URL: www.fisiohub.org.br
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Registration')}
        >
          <Text style={styles.buttonText}>Cadastra-se aqui</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 20,
  },
  introText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  bulletPointsContainer: {
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  bulletPoint: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  button: {
    backgroundColor: '#0a84ff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen; 