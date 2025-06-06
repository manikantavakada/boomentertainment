import React, { useState } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ToastAndroid
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../services/api';

const RegisterScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [secureText, setSecureText] = useState(true);

    const handleRegister = async () => {
        try {
            setError('');
            if (!email || !password) {
                setError('Please enter both email and password');
                return;
            }
            const response = await api.register(email, password);
            
            ToastAndroid.show('Registration successful! Please log in.', ToastAndroid.SHORT);
            
            navigation.navigate('Login');
        } catch (err) {
            console.error('Register Error:', err.message);
            setError(err.message || 'Registration failed');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <View style={styles.logoContainer}>
                        <Text style={styles.appName}>BoomEntertainment</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Sign up to get started</Text>

                        <View style={styles.inputContainer}>
                            <Icon name="email" size={24} color="#666" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                placeholderTextColor="#999"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Icon name="lock" size={24} color="#666" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor="#999"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={secureText}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                onPress={() => setSecureText(!secureText)}
                                style={styles.eyeIcon}
                            >
                                <Icon
                                    name={secureText ? 'visibility-off' : 'visibility'}
                                    size={24}
                                    color="#666"
                                />
                            </TouchableOpacity>
                        </View>

                        {error ? <Text style={styles.error}>{error}</Text> : null}

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={handleRegister}
                            style={styles.buttonContainer}
                        >
                            <LinearGradient
                                colors={['#636363', '#a2ab58']}
                                style={styles.button}
                            >
                                <Text style={styles.buttonText}>Register</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <View style={styles.signInContainer}>
                            <Text style={styles.signInText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.signInLink}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#a2ab58',
        marginTop: 10,
    },
    formContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#636363',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#333',
    },
    eyeIcon: {
        padding: 10,
    },
    error: {
        color: '#D32F2F',
        fontSize: 14,
        marginBottom: 15,
        textAlign: 'center',
    },
    buttonContainer: {
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 20,
    },
    button: {
        paddingVertical: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    signInContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    signInText: {
        color: '#666',
        fontSize: 14,
    },
    signInLink: {
        color: '#94BBE9',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default RegisterScreen;