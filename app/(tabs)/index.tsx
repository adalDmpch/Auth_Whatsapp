import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


// Función para generar un código de verificación aleatorio de 6 dígitos
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export default function AuthScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSendCode = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Por favor ingresa un número de teléfono');
      return;
    }

    const code = generateVerificationCode();
    setGeneratedCode(code);

    const message = `Tu código de verificación es: ${code}`;

    setLoading(true);
    try {
      const result = await sendMessage(phoneNumber.trim(), message);

      if (result.error) {
        Alert.alert('Error', result.error);
        return;
      }

      if (result.sid) {
        Alert.alert('Código Enviado', 'Revisa tu teléfono');
        setCodeSent(true);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Hubo un problema al enviar el mensaje');
    } finally {
      setLoading(false);
    }
  };

  // Verificar el código ingresado
  const handleVerifyCode = () => {
    if (verificationCode === generatedCode) {
      Alert.alert('Éxito', 'Sesión iniciada correctamente');
      setIsAuthenticated(true); // Usuario autenticado
    } else {
      Alert.alert('Error', 'Código incorrecto. Intenta de nuevo.');
    }
  };

  // Volver al inicio para intentar con otro número o código
  const handleReset = () => {
    setPhoneNumber('');
    setVerificationCode('');
    setGeneratedCode('');
    setCodeSent(false);
    setIsAuthenticated(false);
  };


  if (isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.successText}>¡Bienvenido! Haz Iniciado Sesion.</Text>
        <TouchableOpacity style={styles.button} onPress={handleReset}>
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>
        Welcome Back!
      </Text>
      <Text style={styles.description}>
        Porfavor registrate con tu numero de telefono iniciando de esta forma (+52)
      </Text>
      {!codeSent ? (
        <>
          <TextInput
            placeholder="Número de teléfono"
            placeholderTextColor="#abaaaa"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            style={styles.input}
            editable={!loading}
          />
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSendCode}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Comenzar</Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            placeholder="Ingresa el código de verificación"
            placeholderTextColor="#666"
            value={verificationCode}
            onChangeText={setVerificationCode}
            keyboardType="number-pad"
            style={styles.input}
            editable={!loading}
          />
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleVerifyCode}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Verificar Código</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleReset}>
            <Text style={styles.buttonText}>Regresar</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  welcomeText: {
    color: "#7562ce",
    fontSize: 85,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: 'bold',
  },
  description: {
    color: "#8379b2",
    fontSize: 15,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    color: 'white',
    fontSize: 16,
  },
  button: {
    width: '30%',
    backgroundColor: '#03276e',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#004c94',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});