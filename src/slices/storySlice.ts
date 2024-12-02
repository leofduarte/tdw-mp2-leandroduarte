import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Story } from '@/types/stories.types';

interface StoryState {
  selectedStory: Story | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: StoryState = {
  selectedStory: null,
  isLoading: false,
  error: null
};

export const storySlice = createSlice({
  name: 'story',
  initialState,
  reducers: {
    setSelectedStory: (state, action: PayloadAction<Story>) => {
      state.selectedStory = action.payload;
      state.isLoading = false;
      state.error = null;
    }
  }
});

export const { setSelectedStory } = storySlice.actions;
export default storySlice.reducer;