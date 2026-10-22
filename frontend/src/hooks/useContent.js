import { useState, useEffect, useCallback } from 'react';
import { getHeroSlides, getPageContent, getProtection } from '../services/cmsService';
import { getReviews } from '../services/reviewService';
import { getFaqs } from '../services/faqService';
import { errorMessage } from '../lib/unwrap';

export const useHeroSlides = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHeroSlides();
      setSlides(Array.isArray(data) ? data : data?.slides ?? []);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refetch(); }, [refetch]);
  return { slides, loading, error, refetch };
};

export const useReviews = (params = {}) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const key = JSON.stringify(params);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getReviews(params);
      setReviews(Array.isArray(data) ? data : data?.reviews ?? []);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => { refetch(); }, [refetch]);
  return { reviews, loading, error, refetch };
};

export const useFaqs = (params = {}) => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const key = JSON.stringify(params);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFaqs(params);
      setFaqs(Array.isArray(data) ? data : data?.faqs ?? []);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => { refetch(); }, [refetch]);
  return { faqs, loading, error, refetch };
};

export const usePageContent = (pageKey) => {
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(!!pageKey);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!pageKey) return;
    setLoading(true);
    setError(null);
    getPageContent(pageKey)
      .then(setPageContent)
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, [pageKey]);

  return { pageContent, loading, error };
};

export const useProtection = () => {
  const [protection, setProtection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getProtection()
      .then(setProtection)
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return { protection, loading, error };
};
