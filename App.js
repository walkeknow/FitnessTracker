import React, {useEffect, useState} from 'react';
import type {Node} from 'react';
import qs from 'qs';
import config from './config.js';
import {
  Button,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import moment from 'moment';

function OAuth(client_id, getData, setDataObj) {
  const subscription = Linking.addEventListener('url', handleUrl);
  function handleUrl(event) {
    console.log('event URL', event.url);
    subscription.remove();
    const [, query_string] = event.url.match(/\#(.*)/);
    console.log('query string', query_string);
    const query = qs.parse(query_string);
    console.log(`query: ${JSON.stringify(query)}`);
    getData(query.access_token, setDataObj);
  }

  const oauthurl = `https://www.fitbit.com/oauth2/authorize?${qs.stringify({
    client_id,
    response_type: 'token',
    scope: 'heartrate activity profile sleep weight',
    redirect_uri: 'fitbit://fit',
    expires_in: '31536000',
  })}`;
  console.log('oAuth URL', oauthurl);
  Linking.openURL(oauthurl).catch(err =>
    console.error('Error processing linking', err),
  );
}

async function getData(access_token, setDataObj) {
  const urlParameter = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  };

  const today = moment().format('YYYY-MM-DD');

  const urls = [
    `https://api.fitbit.com/1/user/-/activities/heart/date/${today}/7d.json`,
    `https://api.fitbit.com/1/user/-/activities/date/${today}.json`,
    `https://api.fitbit.com/1/user/-/body/log/weight/date/${today}/30d.json`,
    `https://api.fitbit.com/1.2/user/-/sleep/date/${today}.json`,
    `https://api.fitbit.com/1/user/-/body/log/weight/goal.json`,
  ];

  try {
    const responses = await Promise.all(
      urls.map(url => fetch(url, urlParameter)),
    );
    const responsesJson = await Promise.all(responses.map(resp => resp.json()));
    console.log('RESPONSE', responsesJson);
    console.log('HEARTRESP', responsesJson[3]?.sleep?.[0]?.levels);
    setDataObj({
      'Daily Step Goal': responsesJson[1]?.goals?.steps ?? 0,
      'Steps Taken Today': responsesJson[1]?.summary?.steps ?? 0,
      'Total Calories Burnt': responsesJson[1]?.goals?.caloriesOut ?? 0,
      'Calories Burnt Today': responsesJson[1]?.summary?.caloriesOut ?? 0,
      'Weight Goal (kg)': responsesJson[4]?.goal?.weight ?? 0,
      'Weight (kg)': responsesJson[2]?.weight?.[0]?.weight ?? 0,
      'Total Hours in Bed Today':
        (responsesJson[3]?.sleep?.[0]?.timeInBed / 60).toFixed(1) ?? 0,
      'Minutes Awake':
        responsesJson[3]?.sleep?.[0]?.levels?.summary?.wake?.minutes ?? 0,
      'Minutes of Light Sleep':
        responsesJson[3]?.sleep?.[0]?.levels?.summary?.light?.minutes ?? 0,
      'Minutes of Deep Sleep':
        responsesJson[3]?.sleep?.[0]?.levels?.summary?.deep?.minutes ?? 0,
      'Minutes of Rem Sleep':
        responsesJson[3]?.sleep?.[0]?.levels?.summary?.rem?.minutes ?? 0,
    });
  } catch (error) {
    console.error('Error: ', error);
  }
}

const Section = ({children, title}): Node => {
  return (
    <View style={styles.sectionContainer}>
      <Text>{title}</Text>
      <Text>{children}</Text>
    </View>
  );
};

const HealthStats = ({parameter, value}) => {
  return (
    <View>
      <Text>{`${parameter}: `}</Text>
      <Text>{value}</Text>
    </View>
  );
};

const App: () => Node = () => {
  const backgroundStyle = {
    backgroundColor: Colors.lighter,
  };
  const [dataObj, setDataObj] = useState();

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.white,
          }}>
          <Section title="Fitbit Demo">Fitbit stats fetched from API:</Section>
          <Pressable
            onPress={() => OAuth(config.client_id, getData, setDataObj)}>
            <Text>Integrate Fitbit</Text>
          </Pressable>
          <View>
            {dataObj &&
              Object.entries(dataObj).map(([k, v]) => (
                <HealthStats key={k} parameter={k} value={v} />
              ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
});

export default App;
