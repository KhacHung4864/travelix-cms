import { EyeOutlined, LockOutlined, UnlockOutlined } from "@ant-design/icons";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Col, Form, Image, Input, Modal, Pagination, Popconfirm, Row, Select, Space, Tag, Tooltip, Typography, notification } from "antd";
import { useForm } from "antd/es/form/Form";
import Table, { ColumnsType } from "antd/es/table";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserInfo } from "../../models/user";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import styles from "./users.module.scss";
import { requestGetAllUser, requestUpdateUser, userState } from "./usersSlide";
import moment from "moment";
import { PaginationProps } from "antd/lib/pagination";

const cx = classNames.bind(styles);

interface DataType {
  key: string;
  username: string;
  avatar: string | undefined;
  email: string;
  active: number | undefined;
  contact: string | undefined;
  birthDay: number | undefined;
  gender: number | undefined;
  createdAt: number | undefined,
  updatedAt: number | undefined,
  deletedAt: number | undefined,
  value: UserInfo;
}

export const userStatus = [
  {
    value: true,
    label: "Active",
  },
  {
    value: false,
    label: "InActive",
  }
];

const Users = () => {
  const [form] = useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate()

  const userReducer = useAppSelector(userState)
  const users = userReducer.users;
  const loading = userReducer.loading;
  const total = userReducer.total;

  const [dataUpload, setDataupload] = useState<string | null>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [datas, setDatas] = useState<DataType[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [valueEdit, setValueEdit] = useState<UserInfo | undefined>();
  const [status, setStatus] = useState<any>();
  
  useEffect(() => {
    loadAllUsers(1, 10, status)
  }, [status]);

  useEffect(() => {
    setDatas(users?.map(o => convertDataToTable(o)))
  }, [users])

  useEffect(() => {
    if (valueEdit) {
      const { username, avatar, email, active, contact, birthDay, gender, createdAt, updatedAt, deletedAt } = valueEdit;
      form.setFieldsValue({ 
        username, avatar, email, active, contact, gender,
        birthDay: moment.unix(birthDay || 0).format("DD/MM/YYYY HH:mm"),
        createdAt: moment(createdAt).format("DD/MM/YYYY HH:mm"), 
        updatedAt: moment(updatedAt).format("DD/MM/YYYY HH:mm")
      });
    }
  }, [valueEdit]);

  const convertDataToTable = (value: UserInfo) => {
    return {
      key: `${value?.id || Math.random()}`,
      username: value?.username,
      avatar: value?.avatar || "https://play-lh.googleusercontent.com/9N7f8PWb1zlDqOR4mepkNFkRt5SlrjFoLsg5jYtVhvq9LeQneLKyHg9eEx4BSgyl7F4",
      email: value?.email,
      active: value?.active,
      contact: value?.contact,
      birthDay: value?.birthDay,
      gender: value?.gender,
      createdAt: value?.createdAt,
      updatedAt: value?.updatedAt,
      deletedAt: value?.deletedAt,
      value: value,
    };
  };

  const loadAllUsers = async (page: number = 1, per_page: number = 10, active: number = 1) => {
    try {
      const actionResult = await dispatch(
        requestGetAllUser({
          page,
          per_page,
          active
        })
      );
      unwrapResult(actionResult);
    } catch (error) {
      notification.error({
        message: "không tải được danh sách User",
      });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setValueEdit(undefined);
    setDataupload(null)
    form.resetFields();
  };

  const handleUpdateStatusUser = async (user_id: any, status: number) => {
    try {
      const data = await dispatch(
        requestUpdateUser({
          user_id,
          status
        })
      );
      unwrapResult(data);
      loadAllUsers();
      notification.success({
        message: "cập nhật Thành công",
        duration: 1.5,
      });
    } catch (error) {
      notification.error({
        message: "cập nhật không được",
        duration: 1.5,
      });
    }
  };

  const handleOk = () => {
  };


  const columns: ColumnsType<DataType> = [
    {
      title: "STT",
      key: "stt",
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Ảnh",
      dataIndex: "avatar",
      key: "avatar",
      align: "center",
      render: (text) => (
        <Image
          src={text}
          width={150}
          preview={false}
          style={{
            width: "50%",
            overflow: "hidden",
          }}
        />
      ),
    },
    {
      title: "Tên",
      dataIndex: "username",
      key: "username",
      align: "center",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Gmail",
      dataIndex: "email",
      key: "email",
      align: "center",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Trạng thái",
      key: "active",
      dataIndex: "active",
      align: "center",
      render: (text: boolean) => (
        <>
          <Tag color={text ? "green" : "red"}>
            {text ? "Active" : "Inactive"}
          </Tag>
        </>
      ),
    },
    {
      title: "Ngày sinh",
      key: "birthDay",
      dataIndex: "birthDay",
      align: "center",
      render: (text) => <span>{moment.unix(text).format("DD/MM/YYYY HH:mm")}</span>,
    },
    {
      title: "Giới tính",
      key: "gender",
      dataIndex: "gender",
      align: "center",
      render: (text: number) => (
        <>
          {text === 1 ? <>Nam</> : text === 2? <>Nữ</> : <>Khác</>}
        </>
      ),
    },
    {
      title: "Số điện thoại",
      key: "contact",
      dataIndex: "contact",
      align: "center",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Ngày tạo",
      key: "createdAt",
      dataIndex: "createdAt",
      align: "center",
      render: (text) => <span>{moment(text).format("DD/MM/YYYY HH:mm")}</span>,
    },
    {
      title: "Ngày cập nhật",
      key: "updatedAt",
      dataIndex: "updatedAt",
      align: "center",
      render: (text) => <span>{moment(text).format("DD/MM/YYYY HH:mm")}</span>,
    },
    {
      title: "Hành động",
      key: "action",
      dataIndex: "value",
      align: "center",
      // fixed: 'right',
      // width: 150,
      render: (text: UserInfo, record) => (
        <Space size="middle" direction="vertical">
          <Space size="middle">
            {
              text.active
              ? 
                <Popconfirm
                  placement="topRight"
                  title="Bạn có chắc bạn muốn KHÓA tài khoản này?"
                  onConfirm={() => {
                    handleUpdateStatusUser(text.id, 2);
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <Tooltip placement="top" title="Khóa">
                    <Button>
                      <LockOutlined />
                    </Button>
                  </Tooltip>
                </Popconfirm>
              :
                <Popconfirm
                  placement="topRight"
                  title="Bạn có chắc bạn muốn MỞ KHÓA tài khoản này không?"
                  onConfirm={() => {
                    handleUpdateStatusUser(text.id, 1);
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <Tooltip placement="top" title="Mở">
                    <Button>
                      <UnlockOutlined />
                    </Button>
                  </Tooltip>
                </Popconfirm> 
            }
            <Tooltip placement="top" title="Chi tiết">
              <Button 
                onClick={() => {
                  setIsModalOpen(true);
                  setValueEdit(text);
                }}
              >
                <EyeOutlined />
              </Button>
            </Tooltip>
          </Space>
        </Space>
      ),
    },
  ];

  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (current, pageSize) => {
    console.log(current, pageSize);
    loadAllUsers(1, pageSize, status);
  };

  const onChange: PaginationProps['onChange'] = (page, pageSize) => {
    console.log(page, pageSize);
    loadAllUsers(page, pageSize, status);
  }

  return (
    <div>
      <Space size="large">
        <Space size="small">
          <label style={{ marginLeft: "20px" }}>Chọn trạng thái:</label>
          <Select
            placeholder={"Bộ lọc"}
            style={{ width: 150, marginLeft: "10px" }}
            defaultValue={null}
            options={[
              {
                value: null,
                label: "Tất Cả",
              },
              {
                value: 1,
                label: "Active",
              },
              {
                value: 2,
                label: "Inactive",
              },
            ]}
            onChange={(value) => {
              setStatus(value);
            }}
          />
        </Space>
      </Space>

      <Typography.Title level={3}>Danh Người dùng: </Typography.Title>

      <Table
        className={cx("course__table")}
        columns={columns}
        dataSource={datas}
        loading={loading}
        pagination={false}
        scroll={{ x: 1300 }}
      />
      <Space size="large" style={{justifyContent: "end", marginTop: "16px", width: "100%"}}>
        <Pagination
          showSizeChanger
          onShowSizeChange={onShowSizeChange}
          pageSizeOptions={[10, 20, 50]}
          onChange={onChange}
          defaultCurrent={1}
          total={total}
        />
      </Space>
      <Modal
        title={"Thông tin người dùng"}
        open={isModalOpen}
        onOk={handleCancel}
        onCancel={handleCancel}
        width="90%"
        style={{ top: 20 }}
        maskClosable={false}
      >
        <Form
          layout="vertical"
          name="register"
          initialValues={{
            status: 1,
          }}
          form={form}
        >
          <Row gutter={{ xl: 48, md: 16, xs: 0 }}>
            <Col
              xl={12}
              md={12}
              xs={24}
              style={{ borderRight: "0.1px solid #ccc" }}
            >
              <Form.Item label={<h3>{"Ảnh phim"}</h3>}>
                <Image
                  width={200}
                  src={`${valueEdit?.avatar}` || `${dataUpload}`}
                  fallback="https://play-lh.googleusercontent.com/9N7f8PWb1zlDqOR4mepkNFkRt5SlrjFoLsg5jYtVhvq9LeQneLKyHg9eEx4BSgyl7F4"
                />
              </Form.Item>

              <Form.Item
                name="username"
                label="Tên người dùng"
              >
                <Input disabled/>
              </Form.Item>
              <Form.Item
                name="email"
                label="email"
              >
                <Input disabled/>
              </Form.Item>

              <Form.Item name="active" label="Trạng thái">
                <Select options={userStatus} disabled/>
              </Form.Item>
            </Col>

            <Col xl={12} md={12} xs={24}>
              <Form.Item
                name="contact"
                label="Số điện thoại"
              >
                <Input disabled/>
              </Form.Item>
              <Form.Item
                name="birthDay"
                label="Ngày sinh"
              >
                <Input disabled/>
              </Form.Item>

              <Form.Item
                name="gender"
                label="Giới tính"
              >
                <Select options={[
                   { value: 1, label: 'Nam'},
                   { value: 2, label: 'Nữ' },
                   { value: 3, label: 'Khác'},
                  ]} 
                  disabled
                />
              </Form.Item>

              <Form.Item
                name="createdAt"
                label="Ngày tạo"
              >
                <Input disabled/>
              </Form.Item>

              <Form.Item
                name="updatedAt"
                label="Ngày cập nhật	"
              >
                <Input disabled/>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div >
  );
};

export default Users;
