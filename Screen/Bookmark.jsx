import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity,StyleSheet, Linking, Alert } from 'react-native';
import { Card, Title, Button, Paragraph } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Bookmark = ({ navigation }) => {
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookmarkedJobs();
  }, [bookmarkedJobs]);

  const fetchBookmarkedJobs = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const jobs = await AsyncStorage.multiGet(keys);
      const parsedJobs = jobs.map(job => {
        try {
          return JSON.parse(job[1]);
        } catch (e) {
          return null;
        }
      }).filter(job => job !== null);
      setBookmarkedJobs(parsedJobs);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  const deleteJob = async (id) => {
    try {
      await AsyncStorage.removeItem(`@job_${id}`);
      setBookmarkedJobs(prevJobs => prevJobs.filter(job => job.id !== id));
      Alert.alert("Success", "Job removed from bookmarks");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to remove job from bookmarks");
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('JobDetails', { job: item })}>
      <Card style={{ margin: 10 }}>
        <Title>{item.title}</Title>
        <Card.Cover style={{ height: 250 }} source={{ uri: item.creatives[0].file }} />
        <Card.Content>
          <Paragraph>Place: {item.primary_details?.Place || "N/A"}</Paragraph>
          <Paragraph>Job Type: {item.primary_details?.Job_Type || "N/A"}</Paragraph>
          <Paragraph>Salary: {item.primary_details?.Salary || "Not Disclosed"}</Paragraph>
        </Card.Content>
        <Button onPress={() => deleteJob(item.id)}>Delete</Button>
      </Card>
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Error loading bookmarked jobs</Text>;
  if (bookmarkedJobs.length === 0) return <Text style={{ textAlign: 'center', padding: 20, fontSize: 20, fontStyle: "italic", color: "black" }}>No bookmarked jobs</Text>;

  if (loading) return <ActivityIndicator />;
  if (error) return <Text style={styles.errorText}>Error loading bookmarked jobs</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bookmarks</Text>
      <FlatList
        data={bookmarkedJobs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()} 
        contentContainerStyle={styles.flatListContentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    textAlign: 'center',
    padding: 20,
    fontSize: 20,
    fontStyle: "italic",
    color: "black",
  },
  card: {
    margin: 10,
    elevation: 5,
  },
  title: {
    color: "black",
  },
  cover: {
    height: 250,
  },
  flatListContentContainer: {
    padding: 20,
  },
  errorText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 20,
    fontStyle: "italic",
    color: "black",
  },
});



export default Bookmark;

