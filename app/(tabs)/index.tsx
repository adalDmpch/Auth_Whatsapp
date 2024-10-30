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

