import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Col, Form, Image, Input, Modal, Popconfirm, Row, Space, Tooltip, Typography, notification } from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import Table, { ColumnsType } from "antd/es/table";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadMultiImg from "../../components/UploadMutiImg";
import { Place } from "../../models/place";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import styles from "./place.module.scss";
import { placeState, requestGetPlace } from "./placeSlice";

const cx = classNames.bind(styles);

interface DataType {
  key: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string;
  images: string[];
  price: number;
  rate: string;
}

const PlacesPage = () => {
  const [form] = useForm();
  const dispatch: any = useAppDispatch();
  const placeReducer = useAppSelector(placeState)
  const place = placeReducer.place;
  const loading = placeReducer.loading;
  const navigate = useNavigate()

  const [dataUpload, setDataupload] = useState<string[] | null>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [datas, setDatas] = useState<DataType[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [valueEdit, setValueEdit] = useState<Place | undefined>();

  const openCreateModal = () => {
    setIsModalOpen(true);
    setValueEdit(undefined);
    setIsEdit(false);
  };

  useEffect(() => {
    setDatas(place?.map(o => convertDataToTable(o)))
  }, [place])

  useEffect(() => {
    if (valueEdit) {
      const { name, images } = valueEdit;
      form.setFieldsValue({ name, images });
    }
  }, [valueEdit]);

  const convertDataToTable = (value: Place) => {
    return {
      key: `${value?.id || Math.random()}`,
      name: value?.name,
      address: value?.address,
      latitude: value?.latitude,
      longitude: value?.longitude,
      description: value?.description,
      images: value?.images,
      price: value?.price,
      rate: value?.rate,
      value: value,
    };
  };

  useEffect(() => {
    // loadPlace();
  }, []);

  const loadPlace = async (limit?: number, skip?: number, status?: number) => {
    try {
      const actionResult = await dispatch(
        requestGetPlace()
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
      // const data = await dispatch(
      //   requestDeletePlace(id)
      // );
      // unwrapResult(data);
      loadPlace();
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
          // const data = await dispatch(
          //   requestUpdatePlace({
          //     id: valueEdit?.id || '',
          //     ...infoBanner
          //   })
          // );
          // unwrapResult(data);
        } else {
          // const data = await dispatch(
          //   requestCreatePlace({
          //     id: valueEdit?.id || '',
          //     ...infoBanner
          //   })
          // );
          // unwrapResult(data);
        }
        loadPlace();
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
      render: (text: Place, record) => (
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

      <Typography.Title level={3}>Danh sách place: </Typography.Title>
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
            <Form.Item label={<h3>{"Banner"}</h3>}>
              <UploadMultiImg
                defaultUrls={valueEdit?.images || null}
                onChangeUrls={(value) => {
                  setDataupload(value)
                  // form.setFieldsValue({ image: value })
                }}
              />
            </Form.Item>
          </Row>
          <Row gutter={{ xl: 48, md: 16, xs: 0 }}>
            <Col
              xl={12}
              md={12}
              xs={24}
              style={{borderRight: "1px solid #ccc"}}
            >
              <Form.Item
                name="name"
                label="Tên place"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập trường này!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="address"
                label="Địa điểm"
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

            <Col
              xl={12}
              md={12}
              xs={24}
            >
              <Form.Item
                name="latitude"
                label="Kinh độ"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập trường này!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="longitude"
                label="Vĩ độ"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập trường này!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="price"
                label="Giá"
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
          <Row>
            <Col
              xl={24}
              md={24}
              xs={24}
            >
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
