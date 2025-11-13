import { createAsyncThunk } from '@reduxjs/toolkit';
import { talentAPI } from '../../services/api';

// Fetch all talents
export const fetchTalents = createAsyncThunk(
  'talents/fetchTalents',
  async (skillFilter, { rejectWithValue }) => {
    try {
      const response = await talentAPI.getAllTalents(skillFilter);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch talents'
      );
    }
  }
);

// Add a new talent
export const addTalent = createAsyncThunk(
  'talents/addTalent',
  async (talentData, { rejectWithValue }) => {
    try {
      const response = await talentAPI.addTalent(talentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add talent'
      );
    }
  }
);

// Update a talent
export const updateTalent = createAsyncThunk(
  'talents/updateTalent',
  async ({ id, talentData }, { rejectWithValue }) => {
    try {
      const response = await talentAPI.updateTalent(id, talentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update talent'
      );
    }
  }
);

// Delete a talent
export const deleteTalent = createAsyncThunk(
  'talents/deleteTalent',
  async (id, { rejectWithValue }) => {
    try {
      await talentAPI.deleteTalent(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete talent'
      );
    }
  }
);