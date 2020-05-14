import React from 'react'
import axios from 'axios'

import { nowUTC } from './utils'
import { NavBar } from './components/NavBar'
import { NoTask } from './components/NoTask'
import { TaskCreator } from './components/TaskCreator'
import { TaskList } from './components/TaskList'
import './App.css'

const apiServerUrl = 'http://localhost:8000'

class App extends React.Component {
  state = {
    task: '',
    category: 'study',
    allTasks: [],
    isStarted: false,
    startedAt: '',
    endedAt: ''
  }

  componentDidMount() {
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
      this.setState({ allTasks: allTasks })
    })
    // this.setState({allTasks: [{name: 'name', category:'category, username: 'username', startedAt: '', endedAt: ''}]}
  }

  onTaskChange = (event) => {
    this.setState({ task: event.target.value })
  }

  onCategoryChange = (event) => {
    this.setState({ category: event.target.value })
  }

  onAddClicked = () => {
    // add task to state allTasks
    // allTasks = [{name: 'task name', category: 'study'}, {}, {}]
    const currentDateTime = nowUTC()
    const newTask = {
      name: this.state.task,
      category: this.state.category,
      startedAt: this.state.startedAt,
      endedAt: currentDateTime,
      username: window.sessionStorage.getItem('username')
    }

    const isStarted = !this.state.isStarted
    this.setState({ isStarted: isStarted })

    if (isStarted === true) {
      this.setState({ startedAt: currentDateTime })
    } else {
      const newAllTasks = this.state.allTasks.concat(newTask)
      this.setState({ allTasks: newAllTasks })
      this.setState({ endedAt: currentDateTime })

      axios.post(`${apiServerUrl}/tasks`, {
        name: this.state.task,
        category: this.state.category,
        started_at: this.state.startedAt,
        ended_at: currentDateTime,
        username: window.sessionStorage.getItem('username')
      })
    }
  }

  onRemoveClicked = (taskId) => {
    const currentAllTasks = this.state.allTasks
    const newAllTasks = currentAllTasks.filter((task) => task.id !== taskId)
    this.setState({ allTasks: newAllTasks })
    axios.delete(`${apiServerUrl}/tasks/${taskId}`)
  }

  render() {
    return (
      <div className='App'>
        <NavBar />
        <div className='container' role='main' style={{ marginTop: '100px' }}>
          <TaskCreator
            taskName={this.state.task}
            onTaskChange={this.onTaskChange}
            category={this.state.category}
            onCategoryChange={this.onCategoryChange}
            onAddClicked={this.onAddClicked}
            isStarted={this.state.isStarted}
          />
          {
            this.state.allTasks.length < 1 ? (
              <NoTask />
            ) : (
              <TaskList allTasks={this.state.allTasks} onRemoveClicked={this.onRemoveClicked} />
            )
            // if (this.state.allTasks.length < 1) {
            //   return <NoTask />
            // } else {
            //   return <TaskList allTasks={this.state.allTasks}
            // }
          }
        </div>
      </div>
    )
  }
}

export default App
