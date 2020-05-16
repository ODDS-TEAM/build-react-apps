import axios from 'axios'
import { createAction } from '@reduxjs/toolkit'

const apiServerUrl = 'http://localhost:8000'

export const addNewItem = createAction('ADD_NEW_ITEM')

export const addNewItemAsync = (item) => {
  return (dispatch) => {
    axios.post(`${apiServerUrl}/items`, {
      category_id: item.categoryId,
      itemUrl: item.url
    })
    dispatch(addNewItem(item))
  }
}

export const fetchItemsPending = createAction('FETCH_ITEMS_PENDING')
export const fetchItemsSuccess = createAction('FETCH_ITEMS_SUCCESS')

export const fetchItems = () => {
  return (dispatch, getState) => {
    dispatch(fetchItemsPending())
    setTimeout(() => {
      axios.get(`${apiServerUrl}/tasks`).then((response) => {
        const tasksFromAPI = response.data
        const allTasks = tasksFromAPI.map((task) => {
          return {
            id: task.id,
            name: task.name,
            category: task.category,
            username: task.username,
            startedAt: task.started_at,
            endedAt: task.ended_at
          }
        })
        dispatch(fetchItemsSuccess(allTasks))
      })
    }, 1000)
  }
}

export const deleteTask = createAction('DELETE_TASK')

export const deleteTaskAsync = (id) => {
  return (dispatch) => {
    axios.delete(`${apiServerUrl}/tasks/${id}`)
    dispatch(deleteTask(id))
  }
}

export const storeInputText = createAction('STORE_INPUT_TEXT')
