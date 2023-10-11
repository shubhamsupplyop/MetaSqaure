import React, { useState, useEffect } from "react";
import { Button, Table } from "antd";
import { AddButton } from "./commonStyle/TaskStyle";
import CreateTask from "./CreateTask";
import { useDispatch, useSelector } from "react-redux";
import {
  setMode,
  setStep,
  modalOpen,
  deleteTask,
} from "../feature/task/taskSlice";

const TaskFrom = () => {
  const { tasks } = useSelector((state) => state.task);
  const [detailsTask, setDetailsTask] = useState({});
  const sortedTasks = [...tasks].sort((a, b) => {
    const dateA = new Date(a.dueDate);
    const dateB = new Date(b.dueDate);
    return dateA - dateB;
  });
  const [dataSource, setDataSource] = useState([]);
  const dispatch = useDispatch();

  const addTask = () => {
    dispatch(setMode("Add"));
    dispatch(setStep(1));
    dispatch(modalOpen(true));
  };
  const handleCancel = () => {
    dispatch(modalOpen(false));
    dispatch(setMode("Add"));
    dispatch(setStep(1));
  };

  const handleModeChange = (data, mode) => {
    const obj = {
      id: data.id,
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      status: data.status,
      priority: data.priority,
    };
    setDetailsTask({ ...obj });
    dispatch(setMode(mode));
    dispatch(setStep(1));
    dispatch(modalOpen(true));
  };

  const handleDelete = (id) => {
    dispatch(deleteTask(id));
  };

  const transformList = () => {
    const source = [];

    if (sortedTasks.length > 0) {
      sortedTasks.forEach((data) => {
        const rec = {
          key: data.id,
          title: data.title,
          description: data.description,
          dueDate: data.dueDate,
          status: data.status,
          priority: data.priority,
          action: (
            <div style={{ color: "#e4e4e4" }}>
              <Button
                id="ViewButton"
                type="link"
                onClick={() => handleModeChange(data, "View")}
              >
                View
              </Button>
              {"  "}|{"  "}
              <Button
                id="EditButton"
                type="link"
                onClick={() => handleModeChange(data, "Edit")}
              >
                Edit
              </Button>
              <>
                |{"  "}
                <Button
                  id="DeleteButton"
                  type="link"
                  onClick={() => handleDelete(data.id)}
                >
                  Delete
                </Button>
              </>
            </div>
          ),
        };
        source.push(rec);
      });
    }
    setDataSource(source);
  };

  useEffect(() => {
    if (tasks) {
      transformList();
    }
  }, [tasks]);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      width: 100,
    },
    {
      title: "Description",
      dataIndex: "description",
      width: 200,
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      width: 120,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      filters: [
        { text: "To Do", value: "To Do" },
        { text: "In Progress", value: "In Progress" },
        { text: "Completed", value: "Completed" },
      ],
      onFilter: (value, record) => record.status.startsWith(value),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      width: 120,
      filters: [
        { text: "Low", value: "Low" },
        { text: "Medium", value: "Medium" },
        { text: "High", value: "High" },
      ],
      onFilter: (value, record) => record.priority.startsWith(value),
    },
    {
      title: "Action",
      dataIndex: "action",
      fixed: "right",
      width: 220,
    },
  ];

  return (
    <div>
      <Table
        title={() => (
          <div>
            <AddButton type="primary" onClick={addTask}>
              Add Task
            </AddButton>
          </div>
        )}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
      <CreateTask handleCancel={handleCancel} taskItem={detailsTask} />
    </div>
  );
};

export default TaskFrom;
