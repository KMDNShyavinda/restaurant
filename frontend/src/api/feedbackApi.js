import axiosClient from './axiosClient';

export const feedbackApi = {
  getFeedbacks: async () => {
    const response = await axiosClient.get('/feedbacks');
    return response.data;
  },

  submitRestaurantFeedback: async (feedbackData) => {
    // payload: { rating, comment }
    const response = await axiosClient.post('/feedbacks', feedbackData);
    return response.data;
  },

  submitDishRating: async (ratingData) => {
    // payload: { menuItemId, rating, comment }
    const response = await axiosClient.post('/dish-ratings', ratingData);
    return response.data;
  }
};
