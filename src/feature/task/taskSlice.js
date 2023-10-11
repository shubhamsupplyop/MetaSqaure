import { createSlice } from '@reduxjs/toolkit';


const taskSlice = createSlice({
  name: 'task',
  initialState: {
    mode : "Add",
    tasks: [],
    step: 1,
    open : false,
  },
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    editTask: (state, action) => {
        const { id, updatedTaskData } = action.payload;
        // console.log(id, updatedTaskData)
        

        // Find the index of the task with the specified taskId
        const taskIndex = state.tasks.findIndex(task => task.id === id);
  
        if (taskIndex !== -1) {
          // Update the task at the found index with the updatedTaskData
          state.tasks[taskIndex] = { ...state.tasks[taskIndex], ...updatedTaskData };
        }
      },
      deleteTask: (state, action) => {
        const taskIdToDelete = action.payload;
        console.log(taskIdToDelete)
  
        // Use filter to create a new array without the task to delete
        state.tasks = state.tasks.filter(task => task.id !== taskIdToDelete);
      },
    setMode: (state , action) => {
        state.mode = action.payload 
      },
      setStep: (state , action) => {
        state.step = action.payload 
      },
      modalOpen: (state , action) => {
        state.open = action.payload 
      },
     
  },

});

export const { addTask , setMode , setStep , modalOpen , editTask , deleteTask } = taskSlice.actions;
export default taskSlice.reducer;