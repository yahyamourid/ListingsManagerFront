import { useState, useEffect, useCallback } from 'react';

const CHANGE_LOG_KEY = 'listing_change_log';
const LISTING_SNAPSHOTS_KEY = 'listing_snapshots';

export function useChangeLog() {
  const [changeLog, setChangeLog] = useState([]);
  const [snapshots, setSnapshots] = useState({});

  // Load from localStorage
  useEffect(() => {
    const storedLog = localStorage.getItem(CHANGE_LOG_KEY);
    const storedSnapshots = localStorage.getItem(LISTING_SNAPSHOTS_KEY);
    
    if (storedLog) {
      setChangeLog(JSON.parse(storedLog));
    }
    if (storedSnapshots) {
      setSnapshots(JSON.parse(storedSnapshots));
    }
  }, []);

  // Save to localStorage
  const saveToStorage = useCallback((log, snaps) => {
    localStorage.setItem(CHANGE_LOG_KEY, JSON.stringify(log));
    localStorage.setItem(LISTING_SNAPSHOTS_KEY, JSON.stringify(snaps));
  }, []);

  // Save initial snapshot when listing is first tracked
  const saveInitialSnapshot = useCallback((listing) => {
    setSnapshots(prev => {
      if (prev[listing.id]) return prev; // Already have initial snapshot
      
      const newSnapshots = {
        ...prev,
        [listing.id]: {
          initial: { ...listing },
          createdAt: new Date().toISOString(),
        }
      };
      saveToStorage(changeLog, newSnapshots);
      return newSnapshots;
    });
  }, [changeLog, saveToStorage]);

  // Log a change
  const logChange = useCallback((listingId, field, oldValue, newValue, editorEmail, listingAddress) => {
    const change = {
      id: Date.now().toString(),
      listingId,
      listingAddress,
      field,
      oldValue,
      newValue,
      editorEmail,
      timestamp: new Date().toISOString(),
    };

    setChangeLog(prev => {
      const newLog = [change, ...prev];
      saveToStorage(newLog, snapshots);
      return newLog;
    });

    return change;
  }, [snapshots, saveToStorage]);

  // Get changes for a specific listing
  const getChangesForListing = useCallback((listingId) => {
    return changeLog
      .filter(change => change.listingId === listingId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [changeLog]);

  // Get initial snapshot for a listing
  const getInitialSnapshot = useCallback((listingId) => {
    return snapshots[listingId]?.initial || null;
  }, [snapshots]);

  // Get all changes sorted by date
  const getAllChanges = useCallback(() => {
    return [...changeLog].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [changeLog]);

  // Get changes grouped by listing
  const getChangesGroupedByListing = useCallback(() => {
    const grouped = {};
    changeLog.forEach(change => {
      if (!grouped[change.listingId]) {
        grouped[change.listingId] = {
          listingId: change.listingId,
          listingAddress: change.listingAddress,
          changes: [],
          initial: snapshots[change.listingId]?.initial || null,
        };
      }
      grouped[change.listingId].changes.push(change);
    });
    
    // Sort changes within each group
    Object.values(grouped).forEach(group => {
      group.changes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    });
    
    return Object.values(grouped);
  }, [changeLog, snapshots]);

  return {
    changeLog,
    logChange,
    saveInitialSnapshot,
    getChangesForListing,
    getInitialSnapshot,
    getAllChanges,
    getChangesGroupedByListing,
  };
}
