import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Col, Form, Image, Input, Modal, Popconfirm, Row, Space, Tooltip, Typography, notification } from "antd";
import { useForm } from "antd/es/form/Form";
import Table, { ColumnsType } from "antd/es/table";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadImg from "../../components/UploadImg";
import { Banner } from "../../models/banner";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import styles from "./banner.module.scss";
import { bannerState, requestCreateBanner, requestDeleteBanner, requestGetBanner, requestUpdateBanner } from "./bannerSlice";

const cx = classNames.bind(styles);

interface DataType {
  key: string;
  name: string;
  image: string;
  value: Banner;
}

const BannerPage = () => {
  const [form] = useForm();
  const dispatch: any = useAppDispatch();
  const bannerReducer = useAppSelector(bannerState)
  const banner = bannerReducer.banner;
  const loading = bannerReducer.loading;
  const navigate = useNavigate()

  const [dataUpload, setDataupload] = useState<string | null>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [datas, setDatas] = useState<DataType[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [valueEdit, setValueEdit] = useState<Banner | undefined>();

  const openCreateModal = () => {
    setIsModalOpen(true);
    setValueEdit(undefined);
    setIsEdit(false);
  };

  useEffect(() => {
    setDatas(banner?.map(o => convertDataToTable(o)))
  }, [banner])

  useEffect(() => {
    if (valueEdit) {
      const { name, image } = valueEdit;
      form.setFieldsValue({ name, image });
    }
  }, [valueEdit]);

  const convertDataToTable = (value: Banner) => {
    return {
      key: `${value?.id || Math.random()}`,
      name: value?.name,
      image: value?.image,
      value: value,
    };
  };

  useEffect(() => {
    loadBanner();
  }, []);

  const loadBanner = async (limit?: number, skip?: number, status?: number) => {
    try {
      const actionResult = await dispatch(
        requestGetBanner()
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
      const data = await dispatch(
        requestDeleteBanner(id)
      );
      unwrapResult(data);
      loadBanner();
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
      const { name, image } = value
      const infoBanner = {
        ...value,
        image: image || dataUpload
      }
      try {
        if(isEdit) {
          const data = await dispatch(
            requestUpdateBanner({
              id: valueEdit?.id || '',
              ...infoBanner
            })
          );
          unwrapResult(data);
        } else {
          const data = await dispatch(
            requestCreateBanner({
              id: valueEdit?.id || '',
              ...infoBanner
            })
          );
          unwrapResult(data);
        }
        loadBanner();

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
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
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
      title: "Hành động",
      key: "action",
      dataIndex: "value",
      align: "center",
      render: (text: Banner, record) => (
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

      <Typography.Title level={3}>Danh sách banner: </Typography.Title>
      <Table
        className={cx("course__table")}
        columns={columns}
        dataSource={datas}
        loading={loading}
        pagination={{
          pageSize: 10
        }}
      />

      <Modal
        title={`${isEdit ? "Chỉnh sửa" : "Tạo"}  Banner`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={`${isEdit ? "Cập nhật" : "Tạo"}`}
        cancelText="Hủy"
        width="90%"
        style={{ top: 20, height: "80vh" }}
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
              xl={24}
              md={24}
              xs={24}
            >
              <Form.Item label={<h3>{"Banner"}</h3>}>
                <UploadImg
                  defaultUrl={valueEdit?.image || dataUpload}
                  onChangeUrl={(value) => {
                    setDataupload(value)
                    form.setFieldsValue({ image: value })
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Ảnh(URL)"
                name="image">
                <Input
                  onChange={(e) => setDataupload(e.target.value)} />
              </Form.Item>

              <Form.Item
                name="name"
                label="Tên Banner"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập trường này!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div >
  );
};

export default BannerPage;
