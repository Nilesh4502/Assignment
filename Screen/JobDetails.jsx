import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';

const JobDetails = ({ route, navigation }) => {
  const { job } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>{job.title}</Title>
          <Paragraph>Place: {job.primary_details?.Place || "N/A"}</Paragraph>
          <Paragraph>Job Type: {job.primary_details?.Job_Type || "N/A"}</Paragraph>
          <Paragraph>Salary: {job.primary_details?.Salary || "Not Disclosed"}</Paragraph>
          <Paragraph>Description: {job.primary_details?.Description || "No description available."}</Paragraph>
          {/* Add more job details as needed */}
        </Card.Content>
        <Card.Actions>
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
