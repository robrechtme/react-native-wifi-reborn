import React, {useEffect, useState} from 'react';
import {
  Button,
  PermissionsAndroid,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import WifiManager, {WifiEntry} from 'react-native-wifi-reborn';

const Colors = {
  neutral100: '#FFFFFF',
  neutral200: '#F2F2F7',
  neutral300: '#E5E5EA',
  neutral600: '#718096',
  neutral900: '#1A202C',
};

const App = () => {
  const [connected, setConnected] = useState({
    connected: false,
    ssid: 'S4N',
    error: '',
  });
  const [ssid, setSsid] = useState('');
  const [wiFiList, setWiFiList] = useState<WifiEntry[]>([]);
  const password = 'tanenbaum-1981';

  const initWifi = async () => {
    try {
      const ssid = await WifiManager.getCurrentWifiSSID();
      setSsid(ssid);
      console.log('Your current connected wifi SSID is ' + ssid);
    } catch (error) {
      setSsid('Cannot get current SSID!' + (error as Error).message);
      console.log('Cannot get current SSID!', {error});
    }
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'React Native Wifi Reborn App Permission',
          message:
            'Location permission is required to connect with or scan for Wifi networks. ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        initWifi();
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const connectWithWifi = async () => {
    try {
      const data = await WifiManager.connectToProtectedSSID(
        ssid,
        password,
        false,
        false,
      );
      console.log('Connected successfully!', {data});
      setConnected({connected: true, ssid, error: ''});
    } catch (error) {
      setConnected({
        connected: false,
        ssid: '',
        error: (error as Error).message,
      });
      console.log('Connection failed!', {error});
    }
  };

  const scanExample = async () => {
    try {
      setWiFiList([]);
      const data = await WifiManager.reScanAndLoadWifiList();
      console.log(data);
      setWiFiList(data);
    } catch (error) {
      setWiFiList([]);
      console.log(error);
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}>
      <View style={styles.section}>
        <Text style={styles.title}>Current SSID</Text>
        <Text style={styles.body}>{ssid}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Connect to SSID</Text>
        <Text style={styles.body}>{JSON.stringify(connected)}</Text>
        <Button onPress={connectWithWifi} title="Connect" />
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Wi-Fi List</Text>
        {wiFiList
          // Strongest signal first
          .sort((a, b) => b.level - a.level)
          .map(wifi => (
            <Text key={wifi.BSSID} style={styles.body}>
              {wifi.SSID}
            </Text>
          ))}
        <Button onPress={scanExample} title="Scan Wi-Fi List" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.neutral200,
  },
  contentContainer: {
    paddingVertical: 12,
    gap: 12,
  },
  section: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderColor: Colors.neutral300,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    gap: 2,
    backgroundColor: Colors.neutral100,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.neutral900,
  },
  body: {
    color: Colors.neutral600,
  },
});

export default App;
