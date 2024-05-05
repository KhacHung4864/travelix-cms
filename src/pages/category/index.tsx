import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Col, Form, Image, Input, Modal, Popconfirm, Row, Space, Tooltip, Typography, notification } from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import Table, { ColumnsType } from "antd/es/table";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiCreateCategory, apiDeleteCategory, apiUpdateCategory } from "../../api/categoryApi";
import UploadImg from "../../components/UploadImg";
import { Category } from "../../models/category";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import styles from "./category.module.scss";
import { categoryState, requestGetCategory } from "./categorySlice";

const cx = classNames.bind(styles);

interface DataType {
  key: string;
  name: string;
  icon: string;
  description: string;
  created_at: number;
  value: Category;
}

const PlacesPage = () => {
  const [form] = useForm();
  const dispatch: any = useAppDispatch();
  const categoryReducer = useAppSelector(categoryState)
  const category = categoryReducer.category;
  const loading = categoryReducer.loading;
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataUpload, setDataupload] = useState<string | null>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [datas, setDatas] = useState<DataType[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [valueEdit, setValueEdit] = useState<Category | undefined>();

  const openCreateModal = () => {
    setIsModalOpen(true);
    setValueEdit(undefined);
    setIsEdit(false);
  };

  useEffect(() => {
    setDatas(category?.map(o => convertDataToTable(o)))
  }, [category])

  useEffect(() => {
    if (valueEdit) {
      const { name, icon, description } = valueEdit;
      form.setFieldsValue({ name, icon, description });
    }
  }, [valueEdit]);

  const convertDataToTable = (value: Category) => {
    return {
      key: `${value?.id || Math.random()}`,
      name: value?.name,
      icon: value?.icon,
      description: value?.description,
      created_at: value?.created_at,
      value: value,
    };
  };

  useEffect(() => {
    loadCategory();
  }, []);

  const loadCategory = async (limit?: number, skip?: number, status?: number) => {
    try {
      const actionResult = await dispatch(
        requestGetCategory()
      );
      const res = unwrapResult(actionResult);
    } catch (error) {
      notification.error({
        message: "không tải được danh sách",
      });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setValueEdit(undefined);
    setDataupload(null)
    form.resetFields();
  };

  const handleDelete = async (id: String) => {
    try {
      setIsLoading(true)
      await apiDeleteCategory(id)
      setIsLoading(false)
      loadCategory();
      notification.success({
        message: "Xoá thành công",
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
    form.validateFields().then(async (value) => {
      const { icon } = value
      const infoBanner = {
        ...value,
        icon: icon || dataUpload
      }
      try {
        setIsLoading(true)
        if(isEdit) {
          await apiUpdateCategory({
            id: valueEdit?.id || '',
            ...infoBanner
          })
        } else {
          await apiCreateCategory({
            id: valueEdit?.id || '',
            ...infoBanner
          })
        }
        setIsLoading(false)

        loadCategory();
        notification.success({
          message: "Cập nhật thành công",
          duration: 1.5,
        });
      } catch (error) {
        notification.error({
          message: "cập nhật không được",
          duration: 1.5,
        });
      }
      handleCancel();
    }).catch(err => err)
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "STT",
      key: "stt",
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Icon",
      dataIndex: "icon",
      key: "icon",
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
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      align: "center",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Hành động",
      key: "action",
      dataIndex: "value",
      align: "center",
      render: (text: Category, record) => (
        <Space size="middle">
          <Tooltip placement="top" title="Chỉnh sửa">
            <Button
              onClick={() => {
                setIsModalOpen(true);
                setValueEdit(text);
                setIsEdit(true);
              }}
            >
              <EditOutlined />
            </Button>
          </Tooltip>
          <Popconfirm
            placement="topRight"
            title="Bạn có chắc bạn muốn xóa mục này không?"
            onConfirm={() => {
              handleDelete(text.id || '');
            }}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip placement="top" title="Xóa">
              <Button>
                <DeleteOutlined />
              </Button>
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space size="large">
        <Button type="primary" onClick={openCreateModal}>
          Thêm mới
        </Button>
      </Space>

      <Typography.Title level={3}>Danh sách category: </Typography.Title>
      <Table
        className={cx("course__table")}
        columns={columns}
        dataSource={datas}
        loading={loading || isLoading}
        pagination={{
          pageSize: 10
        }}
      />

      <Modal
        title={`${isEdit ? "Chỉnh sửa" : "Tạo"}  Category`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={`${isEdit ? "Cập nhật" : "Tạo"}`}
        cancelText="Hủy"
        width="90%"
        style={{ top: 20, height: "80vh" }}
        maskClosable={false}
        confirmLoading={isLoading}
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
            <Form.Item label={<h3>{"Category"}</h3>}>
              <UploadImg
                defaultUrl={valueEdit?.icon || dataUpload}
                onChangeUrl={(value) => {
                  setDataupload(value)
                  // form.setFieldsValue({ image: value })
                }}
              />
            </Form.Item>
          </Row>
          <Row gutter={{ xl: 48, md: 16, xs: 0 }}>
            <Col
              xl={24}
              md={24}
              xs={24}
            >
              <Form.Item
                name="name"
                label="Tên category"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập trường này!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="Mô tả" name="description">
                <TextArea
                  autoSize={{
                    minRows: 5,
                    maxRows: 10,
                  }}
                  placeholder="Nhập mô tả ..."
                  style={{ minWidth: "100%" }}
                  showCount
                  maxLength={300}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div >
  );
};

export default PlacesPage;
