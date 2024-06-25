import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert, Linking, StyleSheet, Platform } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Job = ({ navigation }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [noMoreJobs, setNoMoreJobs] = useState(false);
  const fetchedJobIds = useRef(new Set());

  const fetchJobs = async () => {
    if (loading || loadingMore) return;

    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      console.log('Fetching jobs...');
      const response = await fetch(`https://testapi.getlokalapp.com/common/jobs?page=${page}`);
      const textData = await response.text();

      let data;
      try {
        data = JSON.parse(textData);
      } catch (parseError) {
        console.error('Failed to parse JSON', parseError);
        throw new Error('Failed to parse JSON');
      }

      if (Array.isArray(data.results)) {
        const newJobs = data.results.filter(job => {
          const isNewJob = !fetchedJobIds.current.has(job.id) && job.primary_details;
          if (isNewJob) {
            fetchedJobIds.current.add(job.id);
          }
          return isNewJob;
        });

        if (newJobs.length === 0) {
          setNoMoreJobs(true);
          Alert.alert("No More Jobs", "There are no more jobs to load.");
        } else {
          setNoMoreJobs(false);
        }

        setJobs(prevJobs => (page === 1 ? newJobs : [...prevJobs, ...newJobs]));
      } else {
        console.error('Data is not an array');
        throw new Error('Data is not an array');
      }

      setLoading(false);
      setLoadingMore(false);
    } catch (err) {
      console.error('Error fetching jobs', err);
      setError(err);
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchJobs(page);
  }, [page]);

  useEffect(() => {
    setPage(1); // Trigger initial fetch
  }, []);

  const bookmarkJob = async (job) => {
    try {
      const jsonValue = JSON.stringify(job);
      await AsyncStorage.setItem(`@job_${job.id}`, jsonValue);
      Alert.alert("Success", "Job bookmarked successfully!");
    } catch (e) {
      console.error(e);
    }
  };

  const openDial = (phone) => {
    if (Platform.OS === 'android') {
      Linking.openURL(`tel:${phone}`);
    } else {
      Linking.openURL(`telprompt:${phone}`);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('JobDetails', { job: item })}>
      <Card style={styles.card}>
        <Title style={styles.title}>{item.title}</Title>
        {item.creatives?.[0]?.file ? (
          <Card.Cover style={styles.cover} source={{ uri: item.creatives[0].file }} />
        ) : null}
        <Card.Content>
          <Paragraph>Place: {item.primary_details?.Place || "N/A"}</Paragraph>
          <Paragraph>Job Type: {item.primary_details?.Job_Type || "N/A"}</Paragraph>
          <Paragraph>Salary: {item.primary_details?.Salary || "Not Disclosed"}</Paragraph>
        </Card.Content>
        <Card.Actions>
          {item.whatsapp_no ? <Button onPress={() => openDial(item.whatsapp_no)}>Call HR</Button> : null}
          <Button onPress={() => bookmarkJob(item)}>Bookmark</Button>
        </Card.Actions>
      </Card>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (loadingMore) {
      return <ActivityIndicator />;
    } else if (noMoreJobs) {
      return <Text style={styles.noMoreJobs}>No more jobs available</Text>;
    } else {
      return (
        <Button onPress={() => setPage(prevPage => prevPage + 1)} style={styles.loadMoreButton}>
          Load More
        </Button>
      );
    }
  };

  if (loading) return <ActivityIndicator />;
  if (error) return <Text style={styles.errorText}>Error loading jobs: {error.message}. You can check your bookmarked jobs.</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Jobs</Text>
      <FlatList
        data={jobs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.flatListContentContainer}
        ListEmptyComponent={() => <Text>No jobs found</Text>}
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
  loadMoreButton: {
    margin: 20,
  },
  noMoreJobs: {
    textAlign: 'center',
    margin: 20,
    color: "black",
  },
  errorText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 20,
    fontStyle: "italic",
    color: "black",
  },
});

export default Job;
