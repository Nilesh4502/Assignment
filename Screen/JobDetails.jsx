import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet,Linking } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';

const JobDetails = ({ route, navigation }) => {
  const { job } = route.params;

  useEffect(() => {
    console.log(job)
}, []);
const openDial = (phone) => {
    if (Platform.OS === 'android') {
      Linking.openURL(`tel:${phone}`);
    } else {
      Linking.openURL(`telprompt:${phone}`);
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
          <Title>{job.title}</Title>
          <Card.Cover style={{ height: 250, aspectRatio: 13/9 }}  source={{ uri: job.creatives[0].file }} />
        <Card.Content>
         
          <Paragraph>Place: {job.primary_details?.Place || "N/A"}</Paragraph>
          <Paragraph>Job Type: {job.primary_details?.Job_Type || "N/A"}</Paragraph>
          <Paragraph>Salary: {job.primary_details?.Salary || "Not Disclosed"}</Paragraph>
          <Paragraph>Vacancies: {job.job_tags[0]?.value || "N/A"}</Paragraph>
          <Paragraph>WhatsApp : {job.whatsapp_no || "N/A"}</Paragraph>
          <Paragraph>Working Hour : {job.job_hours || "N/A"}</Paragraph>
          <Paragraph >Job Category : {job.job_category || "N/A"}</Paragraph>
          <Paragraph>Job Role : {job.job_role || "N/A"}</Paragraph>
          <Paragraph>Call Time: {job.contact_preference?.preferred_call_start_time || "N/A"}</Paragraph>
          <Paragraph>End Time : {job.contact_preference?.preferred_call_end_time || "N/A"}</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => openDial(job.whatsapp_no)}>Call HR</Button>
          <Button onPress={() => navigation.goBack()}>Go Back</Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  card: {
    margin: 10,
  },
});

export default JobDetails;
