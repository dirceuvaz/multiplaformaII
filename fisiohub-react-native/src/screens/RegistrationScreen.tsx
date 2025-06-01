import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define a type for the root stack navigator's parameter list
type RootStackParamList = {
  Home: undefined;
  Registration: undefined;
  Success: undefined;
};

// Define the type for the navigation prop of the Registration screen
type RegistrationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Registration'>;

interface RegistrationScreenProps {
  navigation: RegistrationScreenNavigationProp;
}

function RegistrationScreen({ navigation }: RegistrationScreenProps): React.JSX.Element {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [surgeryDate, setSurgeryDate] = useState('');

  const handleRegistration = async () => {
    const registrationData = {
      nome: fullName,
      email: email,
      senha: password,
      perfil: 3,
      cpf: cpf,
      genero: gender,
      cirurgia: surgeryDate,
    };

    try {
      const response = await fetch('http://10.0.2.2:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'GP25apiKEYADS2k25',
        },
        body: JSON.stringify(registrationData),
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log('Cadastro bem-sucedido:', responseData);
        navigation.navigate('Success');
      } else {
        console.error('Erro no cadastro:', response.status, responseData);
        Alert.alert('Erro no Cadastro', responseData.message || 'Ocorreu um erro ao cadastrar. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao conectar com a API:', error);
      Alert.alert('Erro de Conexão', 'Não foi possível conectar com o servidor. Verifique se a API está rodando e a URL (10.0.2.2 para emulador Android).');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Nome Completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome Completo"
          value={fullName}
          onChangeText={setFullName}
        />

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>CPF</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu CPF"
          value={cpf}
          onChangeText={setCpf}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Text style={styles.label}>Confirmar Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirme sua senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <Text style={styles.label}>Gênero</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue, itemIndex) => setGender(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Selecione o gênero" value="" />
            <Picker.Item label="Masculino" value="masculino" />
            <Picker.Item label="Feminino" value="feminino" />
            <Picker.Item label="Outro" value="outro" />
          </Picker>
        </View>

        <Text style={styles.label}>Data da Cirurgia (opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="AAAA-MM-DD"
          value={surgeryDate}
          onChangeText={setSurgeryDate}
          placeholderTextColor="#999"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegistration}
        >
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  pickerContainer: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    justifyContent: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    backgroundColor: '#0a84ff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RegistrationScreen; 