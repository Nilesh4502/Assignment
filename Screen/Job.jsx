import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
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

  useEffect(() => {
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

    fetchJobs();
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

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('JobDetails', { job: item })}>
      <Card style={{ margin: 10 }}>
        <Card.Content>
          <Title style={{ color: "black" }}>{item.title}</Title>
          <Paragraph>Place: {item.primary_details?.Place || "N/A"}</Paragraph>
          <Paragraph>Job Type: {item.primary_details?.Job_Type || "N/A"}</Paragraph>
          <Paragraph>Salary: {item.primary_details?.Salary || "Not Disclosed"}</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => bookmarkJob(item)}>Bookmark</Button>
        </Card.Actions>
      </Card>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (loadingMore) {
      return <ActivityIndicator />;
    }  else if (noMoreJobs) {
      return <Text style={{ textAlign: 'center', margin: 20 }}>No more jobs available</Text>;
    } else {
      return (
        <Button
          onPress={() => setPage(prevPage => prevPage + 1)}
          style={{ margin: 20 }}
        >
          Load More
        </Button>
      );
    }
  };
  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Error loading jobs: {error.message}</Text>;

  return (
    <FlatList
      data={jobs}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={() => <Text>No jobs found</Text>}
    />
  );
};

export default Job;
