import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Checkbox,
  useTheme,
  Divider,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (email == '' && password == '') {
        navigation.replace('Home');
      } else {
        alert('Email atau password salah!');
      }
    }, 1500);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#198754' }}>
      <LinearGradient
        colors={['#0f5132', '#198754']}
        style={styles.flex}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAwareScrollView
            contentContainerStyle={[
              styles.container,
              {
                paddingTop: insets.top + 32,
                paddingBottom: insets.bottom + 32,
              },
            ]}
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
          >
            {/* Logo */}
            <Image
              source={require('../assets/splash-icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />

            {/* Card */}
            <View style={styles.card}>
              <Text style={styles.header}>Welcome back 👋</Text>

              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                left={<TextInput.Icon icon="email-outline" />}
                style={styles.input}
              />

              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPwd}
                left={<TextInput.Icon icon="lock-outline" />}
                right={
                  <TextInput.Icon
                    icon={showPwd ? 'eye-off-outline' : 'eye-outline'}
                    onPress={() => setShowPwd((p) => !p)}
                  />
                }
                style={styles.input}
              />

              <View style={styles.row}>
                <Checkbox
                  status={remember ? 'checked' : 'unchecked'}
                  onPress={() => setRemember((v) => !v)}
                  color={colors.primary}
                />
                <Text
                  onPress={() => setRemember((v) => !v)}
                  style={styles.remember}
                >
                  Remember me
                </Text>
                <TouchableOpacity style={styles.forgotBtn}>
                  <Text style={styles.forgotTxt}>Forgot password?</Text>
                </TouchableOpacity>
              </View>

              <Button
                mode="contained"
                onPress={handleLogin}
                loading={loading}
                style={styles.loginBtn}
                contentStyle={{ paddingVertical: 6 }}
              >
                Login
              </Button>

              <View style={styles.orWrapper}>
                <Divider style={{ flex: 1 }} />
                <Text style={styles.orTxt}>OR</Text>
                <Divider style={{ flex: 1 }} />
              </View>

              <Button
                icon={() => (
                  <MaterialCommunityIcons
                    name="google"
                    size={20}
                    color="#EA4335"
                  />
                )}
                mode="outlined"
                style={styles.googleBtn}
                onPress={() => alert('Google Sign-In coming soon')}
              >
                Sign in with Google
              </Button>

              <View style={styles.signupRow}>
                <Text>Don’t have an account? </Text>
                <Text
                  style={[styles.signupLink, { color: colors.primary }]}
                  onPress={() => alert('Navigate to Register')}
                >
                  Sign up
                </Text>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: SCREEN_HEIGHT,
  },
  logo: {
    width: 130,
    height: 100,
    alignSelf: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    width: '100%',
    maxWidth: 420,
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  remember: { marginRight: 'auto' },
  forgotBtn: { padding: 4 },
  forgotTxt: {
    textDecorationLine: 'underline',
    fontSize: 13,
    color: '#555',
  },
  loginBtn: { marginTop: 4 },
  orWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  orTxt: {
    marginHorizontal: 10,
    fontWeight: '500',
    color: '#444',
  },
  googleBtn: {
    borderColor: '#EA4335',
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupLink: {
    fontWeight: '600',
  },
});
