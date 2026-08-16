import { toast } from 'sonner';

const QUEUE_STORAGE_KEY = 'pos_offline_orders_queue';

/**
 * Get all queued offline orders from localStorage
 */
export const getOfflineQueue = () => {
  try {
    const data = localStorage.getItem(QUEUE_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to read offline queue', e);
    return [];
  }
};

/**
 * Save an order payload into offline queue
 */
export const saveOrderToOfflineQueue = (orderPayload) => {
  try {
    const queue = getOfflineQueue();
    const queuedOrder = {
      ...orderPayload,
      queuedAt: new Date().toISOString(),
      tempId: 'OFFLINE-' + Date.now()
    };
    queue.push(queuedOrder);
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
    toast.info('Network Offline! Order saved locally and will auto-sync when connection restores.');
    return queuedOrder;
  } catch (e) {
    console.error('Failed to queue offline order', e);
    toast.error('Failed to save order locally.');
    return null;
  }
};

/**
 * Clear the offline queue
 */
export const clearOfflineQueue = () => {
  localStorage.removeItem(QUEUE_STORAGE_KEY);
};

/**
 * Auto-sync pending offline orders with backend API
 */
export const syncOfflineOrdersWithServer = async (ordersApi) => {
  const queue = getOfflineQueue();
  if (queue.length === 0) return;

  toast.info(`Connection restored! Syncing ${queue.length} offline orders...`);
  let syncedCount = 0;

  for (const item of queue) {
    try {
      const newOrder = await ordersApi.createOrder({
        branchId: item.branchId || 1,
        tableId: item.tableId ? parseInt(item.tableId) : null,
        waiterId: item.waiterId || 1,
        orderType: item.orderType || 'DINE_IN'
      });

      if (item.items && item.items.length > 0) {
        const itemRequests = item.items.map(c => ({
          menuItemId: c.menuItemId,
          quantity: c.quantity,
          notes: c.notes
        }));
        await ordersApi.addItemsToOrder(newOrder.id, itemRequests);
        await ordersApi.sendToKitchen(newOrder.id);
      }

      syncedCount++;
    } catch (err) {
      console.error('Error syncing queued order', err);
    }
  }

  if (syncedCount > 0) {
    clearOfflineQueue();
    toast.success(`Successfully synced ${syncedCount} offline orders to server!`);
  }
};
