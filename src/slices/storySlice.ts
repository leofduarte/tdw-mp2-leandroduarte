import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Story } from '../types/stories.types';

interface StoryState {
  selectedStory: Story | null;
}

const initialState: StoryState = {
  selectedStory: null,
};

const storySlice = createSlice({
  name: 'story',
  initialState,
  reducers: {
    setSelectedStory(state, action: PayloadAction<Story>) {
      state.selectedStory = action.payload;
    },
  },
});

export const { setSelectedStory } = storySlice.actions;
export default storySlice.reducer;