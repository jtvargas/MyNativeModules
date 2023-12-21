// App.js
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';

const DEVICE_WIDTH = Dimensions.get('screen').width;

// Utility to convert HEX color codes to RGBA format
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
        height: '15%',
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

// Setting up an event emitter for native module events
const MyNativeEvents = new NativeEventEmitter(NativeModules.MyNativeModule);

export default function App() {
  // State to track the value, action type, and event emitted from native code
  const [nativeValue, setNativeValue] = useState({
    value: null,
    actionType: null,
    eventEmitted: null
  });

 // Adding event listeners and cleanup logic for native module events
  useEffect(() => {
    MyNativeEvents.addListener('onSalute', result => {
      setNativeValue(prev => ({...prev, eventEmitted: result}))
      console.log({
        eventName: 'onSalute',
        result, // Returns: ["salute the audience", "Hello World"]
      });
    });
    MyNativeEvents.addListener('onSaluteAsync', result => {
      setNativeValue(prev => ({...prev, eventEmitted: result}))
      console.log({
        eventName: 'onSaluteAsync',
        result, // Returns: ["async salute the audience", "Hello World"]
      });
    });
    MyNativeEvents.addListener('onSaluteAsyncError', result => {
      setNativeValue(prev => ({...prev, eventEmitted: result}))
      console.log({
        eventName: 'onSaluteAsyncError',
        result, // Returns: ["async salute error", { code: "ERROR_CODE_1", message: "The greetings message is invalid"}]
      });
    });

    return () => {
      MyNativeEvents.removeAllListeners("onSalute");
      MyNativeEvents.removeAllListeners("onSaluteAsync");
      MyNativeEvents.removeAllListeners("onSaluteAsyncError");
    };
  }, []);

  
  // Function to handle native callback
  const handleNativeCallbackFN = () => {
    NativeModules.MyNativeModule.salute(value => {
      console.log(value); // Returns: 'Hello World'
      setNativeValue({ value, actionType: 'Callback Action' });
    });
  };

  // Function to handle native asynchronous call
  const handleNativeAsyncFN = async value => {
    try {
      const nativeResponse = await NativeModules.MyNativeModule.saluteAsync();
      console.log(value); // Returns: 'This is an async message: Hello World'
      setNativeValue({ value: nativeResponse, actionType: 'Async Action' });
    } catch (error) {
      console.log({
        code: error.code, // Returns: "ERROR_CODE_1"
        message: error.message, // Returns: "The greetings message is invalid"
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>MyNativeModules - All Actions are handled via native code</Text>
      <View
        style={{
          backgroundColor: 'white',
          borderColor: 'orange',
          borderRadius: 2,
          borderWidth: 1,
          width: '80%',
          padding: 20,
          height: '20%',
          justifyContent: 'space-around',
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <Text>
          Action Result:{' '}
          <Text style={{ backgroundColor: hexToRGBA('#1C86EE', 0.2) }}>
            {nativeValue.value ?? '----'}
          </Text>
        </Text>
        <Text>
          Action Type:{' '}
          <Text style={{ backgroundColor: hexToRGBA('#FFA500', 0.2) }}>
            {nativeValue.actionType ?? '----'}
          </Text>
        </Text>
        <Text>
          Event Emitted Value:{' '}
          <Text style={{ backgroundColor: hexToRGBA('#DC143C', 0.2) }}>
            {nativeValue.eventEmitted ? JSON.stringify(nativeValue.eventEmitted) : '----'}
          </Text>
        </Text>
        <Text>Constants from native code: {JSON.stringify(CONSTANTS)}</Text>
      </View>
      <View style={{ justifyContent: 'center' }}>
        <Button text="Callback Action" onPress={handleNativeCallbackFN} />
        <Button text="Async Action" onPress={handleNativeAsyncFN} />
        <Button
          text="Reset state"
          onPress={() => setNativeValue({ value: null, actionType: null })}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
