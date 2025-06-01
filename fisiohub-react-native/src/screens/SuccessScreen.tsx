import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define a type for the root stack navigator's parameter list
type RootStackParamList = {
  Home: undefined;
  Registration: undefined;
  Success: undefined;
};

// Define the type for the navigation prop of the Success screen
type SuccessScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Success'>;

interface SuccessScreenProps {
  navigation: SuccessScreenNavigationProp;
}

function SuccessScreen({ navigation }: SuccessScreenProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>FisioHub</Text>
        <Text style={styles.subtitle}>Aplicativo em Construção</Text>
        <Text style={styles.message}>
          Obrigado por se cadastrar no FisioHub! Nossa equipe de profissionais
          entrará em contato com você via WhatsApp em breve para dar continuidade.
          Enquanto isso, você pode acessar a versão web em: www.fisiohub.org.br
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.buttonText}>Voltar para o Início</Text>
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
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#4b5563',
    marginBottom: 15,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  button: {
    backgroundColor: '#0a84ff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SuccessScreen; 