import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  NativeModules,
} from 'react-native';

const DEVICE_WIDTH = Dimensions.get('screen').width;
const hexToRGBA = (hex, opacity) => {
  const rgb = hex
    .replace('#', '')
    .split(/(?=(?:..)*$)/)
    .map(x => parseInt(x, 16));
  return `rgba(${rgb.at(0)}, ${rgb.at(1)}, ${rgb.at(2)}, ${opacity})`;
};

const Button = ({ text, onPress, disabled }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        width: DEVICE_WIDTH / 1.2,
        height: '10%',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        margin: 20,
        borderWidth: 2,
        borderRadius: 4,
        borderColor: 'gray',
      }}
    >
      <Text>{text}</Text>
    </TouchableOpacity>
  );
};

const CONSTANTS = NativeModules.MyNativeModule.getConstants();

export default function App() {
  const [nativeValue, setNativeValue] = useState({
    value: null,
    actionType: null,
  });

  const handleNativeCallbackFN = () => {
    NativeModules.MyNativeModule.salute(value => {
      console.log(value); // 'Hello World'
      setNativeValue({ value, actionType: 'Callback Action' });
    });
  };

  const handleNativeAsyncFN = async value => {
    try {
      const nativeResponse = await NativeModules.MyNativeModule.saluteAsync();
      console.log(value); // 'This is an async message: Hello World'
      setNativeValue({ value: nativeResponse, actionType: 'Async Action' });
    } catch (error) {
      console.log({
        code: error.code, // "ERROR_CODE_1"
        message: error.message, // "The greetings message is invalid"
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>MyNativeModules - All Actions are handled via native code</Text>
      <View style={{ flex: 1 }}>
        <Button text="Callback Action" onPress={handleNativeCallbackFN} />
        <Button text="Async Action" onPress={handleNativeAsyncFN} />
        <Button text="Emit Event" />
        <Button
          text="Reset state"
          onPress={() => setNativeValue({ value: null, actionType: null })}
        />
      </View>

      <View
        style={{
          borderColor: 'orange',
          borderRadius: 2,
          borderWidth: 1,
          width: '80%',
          padding: 20,
          height: '20%',
          justifyContent: 'space-around',
        }}
      >
        <Text>
          Action Result:{' '}
          <Text style={{ backgroundColor: hexToRGBA('#7FFFD4', 0.2) }}>
            {nativeValue.value ?? '----'}
          </Text>
        </Text>
        <Text>
          Action Type:{' '}
          <Text style={{ backgroundColor: hexToRGBA('#FFC300', 0.2) }}>
            {nativeValue.actionType ?? '----'}
          </Text>
        </Text>
        <Text>Constants from native code: {JSON.stringify(CONSTANTS)}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
