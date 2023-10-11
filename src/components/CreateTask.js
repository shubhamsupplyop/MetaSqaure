import React, { useState , useEffect , memo} from "react";
import dayjs from "dayjs";
import uuid from "react-uuid";
import { useDispatch, useSelector } from "react-redux";
import { addTask , editTask } from "../feature/task/taskSlice";
import { Form, Input, Select, DatePicker, Button, Modal } from "antd";
import { setStep, modalOpen } from "../feature/task/taskSlice";
const { Option } = Select;

const CreateTask = ({ handleCancel , taskItem}) => {
  const [form] = Form.useForm();
  const [taskData, setTaskData] = useState({
    
  });
  const { step, open , mode , tasks} = useSelector((state) => state.task);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();


  useEffect(() =>{
    if(mode === 'View' || mode === 'Edit'){
        let g = tasks.find((t) => t.id === taskItem.id) 
        setFormData(g)
        setTaskData({...taskData , title: taskItem.title , description: taskItem.description , id: taskItem.id})
        form.setFieldsValue({
            title: taskItem.title,
            description: taskItem.description,
            dueDate: dayjs(taskItem.dueDate),
          status: taskItem.status,
          priority: taskItem.priority,
        })
    }
    else{
        form.resetFields()
    }
    console.log('molu')
  },[mode , form , taskItem])

  const next = () => {
    form
      .validateFields()
      .then(() => {
        dispatch(setStep(step + 1));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const previous = () => {
    if (step > 0) {
      dispatch(setStep(step - 1));
    }
  };

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().endOf("day");
  };

  const addTitle = (e) => {
    console.log(e);
    const { value } = e.target;
    setTaskData({ ...taskData, title: value });
  };

  const addDescription = (e) => {
    const { value } = e.target;
    setTaskData({ ...taskData, description: value });
  };

  const selectStatus = (value) => {
    setTaskData({ ...taskData, status: value });
  };
  const selectDate = (date, dateString) => {
    setTaskData({ ...taskData, dueDate: dateString });
  };

  const selectPriority = (value) => {
    setTaskData({ ...taskData, priority: value });
  };
  const handleSubmit = () => {
    dispatch(modalOpen(false));
    if(mode === 'Add'){
        const id = uuid();
    dispatch(addTask({ ...taskData, id: id }));
    form.resetFields();  
    }
    else {
        dispatch(editTask({
            ...taskData, id: taskItem.id , updatedTaskData : {
                title : taskData.title,
                description: taskData.description,
                status: taskData.status,
                dueDate: taskData.dueDate,
                priority: taskData.priority

            }
        }))
    }
    
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      maskClosable={false}
    >
      <div style={{ marginTop: "30px" }}>
        <Form form={form} onFinish={handleSubmit}
        >
          {step === 1 && (
            <Form.Item
              name="title"
              label="Title"
              rules={[
                { required: true, message: "Please Provide The Task Title" },
              ]}
            >
              <Input disabled ={mode === 'View'} placeholder="Provide the title" onChange={addTitle} />
            </Form.Item>
          )}
          {step === 2 && (
            <Form.Item
              name="description"
              label="Description"
              rules={[
                { required: true, message: "Please Provide The Description" },
              ]}
            >
              <Input.TextArea
                placeholder="Provide the description"
                onChange={addDescription}
                disabled ={mode === 'View'}
              />
            </Form.Item>
          )}
          {step === 3 && (
            <>
              <Form.Item
                name="status"
                label="Status"
                rules={[
                  { required: true, message: "Please Select The Status" },
                ]}
              >
                <Select placeholder="Select the status" onChange={selectStatus}  disabled ={mode === 'View'}>
                  <Option value="To Do">To Do</Option>
                  <Option value="In Progress">In Progress</Option>
                  <Option value="Completed">Completed</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="dueDate"
                label="Due Date"
                rules={[
                  { required: true, message: "Please Select The Due Date" },
                ]}
              >
                <DatePicker
                  disabledDate={disabledDate}
                  format="MMM DD YYYY"
                  onChange={selectDate}
                  disabled ={mode === 'View'}
                />
              </Form.Item>
              <Form.Item
                name="priority"
                label="Priority"
                rules={[
                  {
                    required: true,
                    message: "Please Provide Select The Priority",
                  },
                ]}
              >
                <Select
                  placeholder="Select the status"
                  onChange={selectPriority}
                  disabled ={mode === 'View'}
                >
                  <Option value="Low">Low</Option>
                  <Option value="Medium">Medium</Option>
                  <Option value="High">High</Option>
                </Select>
              </Form.Item>
            </>
          )}
          <div>
            {step > 1 && <Button onClick={previous}>Previous</Button>}
            {step < 3 && (
              <Button
                type="primary"
                onClick={next}
                style={{ marginLeft: "10px" }}
              >
                Next
              </Button>
            )}
            {step === 3 && (
              <Button
                style={{ marginLeft: "10px" }}
                type="primary"
                htmlType="submit"
                disabled ={mode === 'View'}
              >
                Submit
              </Button>
            )}
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default memo(CreateTask);
