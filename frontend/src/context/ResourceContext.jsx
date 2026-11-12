import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialMockResources, initialMockRequests, initialMockTransactions } from '../data/mockData';
import { useAuth } from './AuthContext';
import { resourceService } from '../services/resourceService';
import { requestService } from '../services/requestService';
import { transactionService } from '../services/transactionService';
import toast from 'react-hot-toast';

const ResourceContext = createContext();

export const ResourceProvider = ({ children }) => {
  const { currentUser, addRePoints } = useAuth();

  // 1. Resources state with localStorage persistence
  const [resources, setResources] = useState(() => {
    const saved = localStorage.getItem('reconnect_resources');
    return saved ? JSON.parse(saved) : initialMockResources;
  });

  useEffect(() => {
    localStorage.setItem('reconnect_resources', JSON.stringify(resources));
  }, [resources]);

  // 2. Requests state with localStorage persistence
  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem('reconnect_requests');
    return saved ? JSON.parse(saved) : initialMockRequests;
  });

  useEffect(() => {
    localStorage.setItem('reconnect_requests', JSON.stringify(requests));
  }, [requests]);

  // 3. Transactions state with localStorage persistence
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('reconnect_transactions');
    return saved ? JSON.parse(saved) : initialMockTransactions;
  });

  useEffect(() => {
    localStorage.setItem('reconnect_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // 4. Drafts state with localStorage persistence
  const [drafts, setDrafts] = useState(() => {
    const saved = localStorage.getItem('reconnect_drafts');
    return saved ? JSON.parse(saved) : [
      {
        id: 'draft_01',
        title: 'Draft: Oxford Engineering Mathematics Handbook',
        category: 'Books',
        sharingType: 'DONATE',
        condition: 'Good Condition',
        description: 'Hardcover engineering reference handbook with formula tear-sheets.',
        pickupInfo: 'Central Library Foyer',
        savedAt: '2026-03-08T11:00:00Z',
        images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80']
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('reconnect_drafts', JSON.stringify(drafts));
  }, [drafts]);

  // Notifications
  const [notifications, setNotifications] = useState([
    {
      id: 'notif_1',
      title: 'New request received',
      message: 'Dipankar requested your "Engineering Mathematics" textbook.',
      time: '10m ago',
      read: false,
      link: '/dashboard/requests'
    },
    {
      id: 'notif_2',
      title: 'Request accepted!',
      message: 'Ananya accepted your request for the White Cotton Lab Coat.',
      time: '2h ago',
      read: false,
      link: '/dashboard/requests'
    },
    {
      id: 'notif_3',
      title: '+50 RePoints Awarded',
      message: 'Your completed donation of the kettle was confirmed.',
      time: '1d ago',
      read: true,
      link: '/dashboard/profile'
    }
  ]);

  // Synchronize with live backend API when connected
  useEffect(() => {
    let isMounted = true;
    async function syncBackend() {
      try {
        const fetched = await resourceService.getAll();
        if (isMounted && Array.isArray(fetched) && fetched.length > 0) {
          setResources(fetched);
        }
      } catch (e) {
        // Local state active
      }

      const token = localStorage.getItem('reconnect_token');
      if (token) {
        try {
          const reqs = await requestService.getAll();
          if (isMounted && Array.isArray(reqs)) {
            setRequests(reqs);
          }
        } catch (e) {}

        try {
          const txns = await transactionService.getAll();
          if (isMounted && Array.isArray(txns)) {
            setTransactions(txns);
          }
        } catch (e) {}
      }
    }

    syncBackend();
    return () => { isMounted = false; };
  }, [currentUser]);

  // Add new resource listing
  const addResource = async (newResource) => {
    let created = null;
    try {
      created = await resourceService.create(newResource);
    } catch (e) {
      console.warn('Backend sync deferred:', e);
    }

    const resourceWithMeta = (created && created.id) ? created : {
      ...newResource,
      id: 'res_' + Date.now(),
      status: 'AVAILABLE',
      createdAt: new Date().toISOString(),
      viewsCount: 1,
      requestsCount: 0,
      postedBy: {
        id: currentUser?.id || 'usr_001',
        name: currentUser?.name || 'Priyam Sharma',
        avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        community: currentUser?.community || 'ADTU - Main Campus (Panikhaiti)',
        rating: 5.0,
        verifiedStudent: true
      }
    };

    setResources(prev => [resourceWithMeta, ...prev.filter(r => r.id !== resourceWithMeta.id)]);
    toast.success('Resource successfully pinned to community board!', {
      style: {
        border: '2px solid #121411',
        boxShadow: '3px 3px 0px #121411',
        fontWeight: 'bold',
        background: '#DDF247',
        color: '#121411'
      }
    });
    return resourceWithMeta;
  };

  // Update resource
  const updateResource = async (id, updatedFields) => {
    try {
      await resourceService.update(id, updatedFields);
    } catch (e) {}
    setResources(prev => prev.map(item => item.id === id ? { ...item, ...updatedFields } : item));
    toast.success('Listing updated successfully!', {
      style: {
        border: '2px solid #121411',
        boxShadow: '3px 3px 0px #121411',
        fontWeight: 'bold',
        background: '#DDF247',
        color: '#121411'
      }
    });
  };

  // Delete resource
  const deleteResource = async (id) => {
    try {
      await resourceService.delete(id);
    } catch (e) {}
    setResources(prev => prev.filter(item => item.id !== id));
    toast.success('Listing removed from noticeboard.', {
      style: {
        border: '2px solid #121411',
        boxShadow: '3px 3px 0px #121411',
        fontWeight: 'bold',
        background: '#FF5A36',
        color: '#ffffff'
      }
    });
  };

  // Mark status (e.g. UNAVAILABLE, AVAILABLE, CLAIMED, RESERVED)
  const markResourceStatus = async (id, status) => {
    try {
      await resourceService.updateStatus(id, status);
    } catch (e) {}
    setResources(prev => prev.map(item => item.id === id ? { ...item, status } : item));
    toast.success(`Resource marked as ${status.toLowerCase()}.`);
  };

  // Create request for a resource
  const createRequest = async ({ resourceId, message, preferredTime }) => {
    const targetResource = resources.find(r => r.id === resourceId);
    if (!targetResource) {
      toast.error('Resource not found.');
      return null;
    }

    // Prevent requesting own resource
    if (targetResource.postedBy?.id === currentUser?.id) {
      toast.error('You cannot request your own listed resource!', {
        style: {
          border: '2px solid #121411',
          boxShadow: '3px 3px 0px #121411',
          background: '#FF5A36',
          color: '#ffffff',
          fontWeight: 'bold'
        }
      });
      return null;
    }

    let createdBackendReq = null;
    try {
      createdBackendReq = await requestService.create({
        resourceId,
        message,
        preferredTime,
        pickupLocation: targetResource.pickupInfo
      });
    } catch (e) {}

    const newReq = (createdBackendReq && createdBackendReq.id) ? createdBackendReq : {
      id: 'req_' + Date.now(),
      resourceId: targetResource.id,
      resourceTitle: targetResource.title,
      resourceCategory: targetResource.category,
      sharingType: targetResource.sharingType,
      requester: {
        id: currentUser?.id || 'usr_guest',
        name: currentUser?.name || 'Student Member',
        email: currentUser?.email || 'student@adtu.edu.in',
        department: currentUser?.department || 'ADTU Student',
        avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
      },
      owner: {
        id: targetResource.postedBy.id,
        name: targetResource.postedBy.name
      },
      message: message || 'I would like to request this item for my campus studies.',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      pickupLocation: targetResource.pickupInfo,
      preferredTime: preferredTime || 'Flexible this week'
    };

    setRequests(prev => [newReq, ...prev]);
    // increment requestsCount on resource
    setResources(prev => prev.map(r => r.id === resourceId ? { ...r, requestsCount: (r.requestsCount || 0) + 1 } : r));

    // add notification
    setNotifications(prev => [
      {
        id: 'notif_' + Date.now(),
        title: 'Request sent',
        message: `Your request for "${targetResource.title.slice(0, 25)}..." was submitted to ${targetResource.postedBy?.name}.`,
        time: 'Just now',
        read: false,
        link: '/dashboard/requests'
      },
      ...prev
    ]);

    toast.success(`Request submitted to ${targetResource.postedBy?.name}! (+Tear-off tab logged)`, {
      style: {
        border: '2px solid #121411',
        boxShadow: '3px 3px 0px #121411',
        fontWeight: 'bold',
        background: '#8FD3F4',
        color: '#121411'
      }
    });
    return newReq;
  };

  // Track rewarded requests in state/localStorage to prevent duplicate rewards
  const [rewardedActions, setRewardedActions] = useState(() => {
    const saved = localStorage.getItem('reconnect_rewarded_actions');
    return saved ? JSON.parse(saved) : ['rw1', 'rw2', 'rw4', 'rw5'];
  });

  useEffect(() => {
    localStorage.setItem('reconnect_rewarded_actions', JSON.stringify(rewardedActions));
  }, [rewardedActions]);

  // Update request status (ACCEPTED, REJECTED, READY_PICKUP, COMPLETED)
  const updateRequestStatus = async (requestId, status) => {
    let targetResourceId = null;
    let targetReq = null;

    try {
      await requestService.updateStatus(requestId, status);
    } catch (e) {}

    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        targetResourceId = req.resourceId;
        targetReq = { ...req, status, updatedAt: new Date().toISOString() };
        return targetReq;
      }
      return req;
    }));

    if (status === 'ACCEPTED') {
      if (targetResourceId) {
        setResources(prev => prev.map(r => r.id === targetResourceId ? { ...r, status: 'RESERVED' } : r));
      }
      toast.success('Request accepted! Listing marked as Reserved.', {
        style: {
          border: '2px solid #121411',
          boxShadow: '3px 3px 0px #121411',
          fontWeight: 'bold',
          background: '#DDF247',
          color: '#121411'
        }
      });
    } else if (status === 'READY_PICKUP') {
      toast.success('Marked as Ready for Campus Pickup!');
    } else if (status === 'COMPLETED') {
      // Prevent duplicate rewards in mock state
      const rewardKey = `req_reward_${requestId}`;
      if (!rewardedActions.includes(rewardKey)) {
        addRePoints(50, `Completed handover: "${targetReq?.resourceTitle?.slice(0, 22) || 'Resource'}"`);
        setRewardedActions(prev => [...prev, rewardKey]);
      }

      // Check if transaction already exists for this resource/request
      setTransactions(prev => {
        const existingTxn = prev.find(t => t.resourceTitle === targetReq?.resourceTitle);
        if (existingTxn) {
          return prev.map(t => t.id === existingTxn.id ? { ...t, status: 'COMPLETED', pointsEarned: 50 } : t);
        }
        const newTxn = {
          id: 'txn_' + Date.now(),
          transactionCode: 'TXN-2026-0' + Math.floor(100 + Math.random() * 900),
          resourceTitle: targetReq?.resourceTitle || 'Resource Item',
          resourceImage: targetReq?.resourceImage || null,
          category: targetReq?.resourceCategory || 'Books',
          sharingType: targetReq?.sharingType || 'DONATE',
          provider: { name: targetReq?.owner?.name || currentUser?.name, id: targetReq?.owner?.id || currentUser?.id },
          receiver: { name: targetReq?.requester?.name || 'Student', id: targetReq?.requester?.id || 'usr_x' },
          date: new Date().toISOString().split('T')[0],
          status: 'COMPLETED',
          pointsEarned: 50,
          community: currentUser?.community || 'ADTU - Main Campus (Panikhaiti)',
          pickupDetails: targetReq?.pickupLocation || 'Campus Pickup',
          returnDate: targetReq?.returnDate || null,
          notes: 'Handover successfully completed and verified on campus.'
        };
        return [newTxn, ...prev];
      });

      if (targetResourceId) {
        setResources(prev => prev.map(r => r.id === targetResourceId ? { ...r, status: 'CLAIMED' } : r));
      }

      toast.success('Handover completed! +50 RePoints earned! 🎉', {
        style: {
          border: '2px solid #121411',
          boxShadow: '3px 3px 0px #121411',
          fontWeight: 'bold',
          background: '#FFB04A',
          color: '#121411'
        }
      });
    } else if (status === 'REJECTED') {
      if (targetResourceId) {
        setResources(prev => prev.map(r => (r.id === targetResourceId && r.status === 'RESERVED') ? { ...r, status: 'AVAILABLE' } : r));
      }
      toast('Request declined.', { icon: '🚫' });
    }
  };

  // Confirm Collection (wrapper used by requester or provider)
  const confirmCollection = (requestId) => {
    updateRequestStatus(requestId, 'COMPLETED');
  };

  // Confirm Return for borrowed resources
  const confirmReturn = async (transactionOrRequestId) => {
    try {
      await transactionService.returnItem(transactionOrRequestId);
    } catch (e) {}
    // 1. If transaction ID
    let updatedTxn = false;
    setTransactions(prev => prev.map(txn => {
      if (txn.id === transactionOrRequestId || txn.transactionCode === transactionOrRequestId) {
        updatedTxn = true;
        return {
          ...txn,
          status: 'COMPLETED',
          notes: 'Borrowed item return confirmed and verified on campus. Transaction closed.',
          returnVerified: true
        };
      }
      return txn;
    }));

    // 2. Also check if it's a request ID
    setRequests(prev => prev.map(req => {
      if (req.id === transactionOrRequestId) {
        return { ...req, returned: true, status: 'COMPLETED' };
      }
      return req;
    }));

    // Prevent duplicate return rewards
    const rewardKey = `return_reward_${transactionOrRequestId}`;
    if (!rewardedActions.includes(rewardKey)) {
      addRePoints(25, 'Verified return of borrowed resource');
      setRewardedActions(prev => [...prev, rewardKey]);
    }

    toast.success('Return confirmed! Item returned in good condition. (+25 RePoints)', {
      style: {
        border: '2px solid #121411',
        boxShadow: '3px 3px 0px #121411',
        fontWeight: 'bold',
        background: '#8FD3F4',
        color: '#121411'
      }
    });
  };

  // Update transaction status directly
  const updateTransactionStatus = (transactionId, newStatus, notes) => {
    setTransactions(prev => prev.map(txn => {
      if (txn.id === transactionId) {
        return {
          ...txn,
          status: newStatus,
          notes: notes || txn.notes
        };
      }
      return txn;
    }));
    toast.success(`Transaction status updated to ${newStatus}`);
  };

  // Cancel request
  const cancelRequest = (requestId) => {
    setRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: 'CANCELLED' } : req));
    toast.success('Request cancelled.');
  };

  // Save draft locally
  const saveDraft = (draftData) => {
    const draftId = draftData.id || 'draft_' + Date.now();
    const newDraft = {
      ...draftData,
      id: draftId,
      savedAt: new Date().toISOString()
    };
    setDrafts(prev => [newDraft, ...prev.filter(d => d.id !== draftId)]);
    toast.success('Listing draft saved locally!', {
      style: {
        border: '2px solid #121411',
        boxShadow: '3px 3px 0px #121411',
        background: '#E5E6E1',
        color: '#121411',
        fontWeight: 'bold'
      }
    });
    return newDraft;
  };

  // Delete draft
  const deleteDraft = (draftId) => {
    setDrafts(prev => prev.filter(d => d.id !== draftId));
    toast.success('Draft removed.');
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <ResourceContext.Provider value={{
      resources,
      requests,
      transactions,
      drafts,
      notifications,
      addResource,
      updateResource,
      deleteResource,
      markResourceStatus,
      createRequest,
      updateRequestStatus,
      confirmCollection,
      confirmReturn,
      updateTransactionStatus,
      cancelRequest,
      saveDraft,
      deleteDraft,
      markAllNotificationsRead
    }}>
      {children}
    </ResourceContext.Provider>
  );
};

export const useResources = () => {
  const context = useContext(ResourceContext);
  if (!context) {
    throw new Error('useResources must be used within a ResourceProvider');
  }
  return context;
};
