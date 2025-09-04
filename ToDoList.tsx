import React, { useState, useCallback } from 'react';

/**
 * Represents a single task item
 * @property id - Unique identifier for the task
 * @property text - Task's title
 * @property completed - Indicates if the task is completed
 */
interface Task {
    id: number;
    text: string;
    completed: boolean;
}

const TodoList: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState('');

    /**
     * Handles adding a task to the list
     * (Im using useCallback to avoid re-renders of this handler's dependant child)
     * @param e FormEvent/KeyboardEvent
    * @returns
    */
    const addTask = useCallback((e?: React.FormEvent | React.KeyboardEvent) => {
        e?.preventDefault?.();

        if (newTask === '') return;

        const updatedTasks = [...tasks, { id: tasks.length, text: newTask.trim(), completed: false }];
        setTasks(updatedTasks);
        setNewTask('');
    }, [newTask]);

    /**
     * Toggle task state through an event
     * @param taskId 
     */
    const toggleTask = (taskId: number) => {
        const updatedTasks = tasks.map((task) => {
            if (task?.id === taskId) {
                return { ...task, completed: !task?.completed };
            }
            return task;
        });
        setTasks(updatedTasks);
    };

    /**
     * Handles task input state
     * @param event 
     */
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let taskValue = event?.target ? event?.target.value : '';
        if (taskValue === '') return;

        setNewTask(taskValue);
    };

    /**
     * Handles adding and event with enter key
     * @param event 
     */
    const handleInputKeyEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event?.key !== "Enter") return;

        addTask(event);
    };

    /**
     * Styles for the page component
     * (I rather do it in CSS, but will keep it as an object to mantain the actual structure of the test)
     */
    const ToDoListStyles = {
        componentContainer: {
            display: 'grid',
            gridTemplateRows: 'auto 1fr',
            gap: 12,
            padding: 24,
            backgroundColor: 'rgba(0, 0, 0, .8)',
            borderRadius: 8,
            width: '100%',
            maxWidth: 320,
            margin: 'auto'
        },
        inputContainer: {
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: 8
        },
        input: {
            padding: 8,
            borderRadius: 4,
            border: 'unset'
        },
        submitButton: {
            cursor: 'pointer',
            backgroundColor: '#fff',
            border: 'unset',
            padding: 8,
            borderRadius: 4,
        },
        taskList: {
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 8
        },
        taskListItem: (task: Task) => ({
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '4px',
            textDecoration: task.completed ? 'line-through' : 'none',
            border: '1px solid',
            borderColor: task?.completed ? '#2d992d' : '#fff',
            backgroundColor: task.completed ? '#2d992d' : 'rgba(0, 0, 0, 0.8)',
            color: '#fff'
        })
    };

    return (
        <form style={ToDoListStyles.componentContainer}>
            <div style={ToDoListStyles.inputContainer}>
                <input
                    type="text"
                    placeholder="Type task name"
                    value={newTask}
                    style={ToDoListStyles.input}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyEnter} />
                <button type="submit" onClick={addTask} style={ToDoListStyles.submitButton}>Add Task</button>
            </div>
            <ul style={ToDoListStyles.taskList}>
                {tasks.map((task) => (
                    <li
                        key={task.id}
                        style={ToDoListStyles.taskListItem(task)}
                        onClick={() => toggleTask(task.id)}
                    >
                        {task.text}
                    </li>
                ))}
            </ul>
        </form>
    );
};

export { TodoList };
