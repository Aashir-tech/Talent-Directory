import { createSlice } from '@reduxjs/toolkit';
import { fetchTalents, addTalent, updateTalent, deleteTalent } from '../thunks/talentsThunks';

const initialState = {
  talents: [],
  filteredTalents: [],
  loading: false,
  error: null,
  successMessage: null,
  currentFilter: '',
};

const talentsSlice = createSlice({
  name: 'talents',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    setFilter: (state, action) => {
      state.currentFilter = action.payload;
      if (!action.payload) {
        state.filteredTalents = state.talents;
      } else {
        const filter = action.payload.toLowerCase();
        state.filteredTalents = state.talents.filter((talent) =>
          talent.skills.some((skill) => skill.toLowerCase().includes(filter))
        );
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch Talents
    builder
      .addCase(fetchTalents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTalents.fulfilled, (state, action) => {
        state.loading = false;
        state.talents = action.payload;
        state.filteredTalents = action.payload;
        state.error = null;
      })
      .addCase(fetchTalents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add Talent
    builder
      .addCase(addTalent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTalent.fulfilled, (state, action) => {
        state.loading = false;
        state.talents.unshift(action.payload);
        state.filteredTalents = state.currentFilter
          ? state.talents.filter((talent) =>
              talent.skills.some((skill) =>
                skill.toLowerCase().includes(state.currentFilter.toLowerCase())
              )
            )
          : state.talents;
        state.successMessage = 'Talent added successfully!';
        state.error = null;
      })
      .addCase(addTalent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Talent
    builder
      .addCase(updateTalent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTalent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.talents.findIndex(t => t._id === action.payload._id);
        if (index !== -1) {
          state.talents[index] = action.payload;
        }
        state.filteredTalents = state.currentFilter
          ? state.talents.filter((talent) =>
              talent.skills.some((skill) =>
                skill.toLowerCase().includes(state.currentFilter.toLowerCase())
              )
            )
          : state.talents;
        state.successMessage = 'Talent updated successfully!';
        state.error = null;
      })
      .addCase(updateTalent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Talent
    builder
      .addCase(deleteTalent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTalent.fulfilled, (state, action) => {
        state.loading = false;
        state.talents = state.talents.filter((talent) => talent._id !== action.payload);
        state.filteredTalents = state.filteredTalents.filter(
          (talent) => talent._id !== action.payload
        );
        state.successMessage = 'Talent deleted successfully!';
        state.error = null;
      })
      .addCase(deleteTalent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages, setFilter } = talentsSlice.actions;
export default talentsSlice.reducer;