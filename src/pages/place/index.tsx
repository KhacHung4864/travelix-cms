import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Col, Form, Input, Modal, Popconfirm, Row, Select, Space, Tag, Tooltip, Typography, notification } from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import Table, { ColumnsType } from "antd/es/table";
import classNames from "classnames/bind";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiCreatePlace, apiDeletePlace, apiUpdatePlace } from "../../api/placeApi";
import UploadMultiImg from "../../components/UploadMutiImg";
import { Place } from "../../models/place";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { categoryState, requestGetCategory } from "../category/categorySlice";
import styles from "./place.module.scss";
import { placeState, requestGetPlace } from "./placeSlice";

const cx = classNames.bind(styles);

interface DataType {
  key: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  categories: any;
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
  const categoryReducer = useAppSelector(categoryState)
  const categorys = categoryReducer.category;


  const [dataUpload, setDataupload] = useState<string[] | null>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [datas, setDatas] = useState<DataType[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [valueEdit, setValueEdit] = useState<Place | undefined>();
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [selectCategory, setSelectCategory] = useState<number>();
  const [keyword, setKeyword] = useState<any>(null);

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
      const { name, images, address, latitude, longitude, description, price, categories } = valueEdit;
      const categoriesId = categories.map(e => e.id)
      form.setFieldsValue({ name, images, address, latitude, longitude, description, price, categories: categoriesId });
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
      categories: value?.categories,
      images: value?.images,
      price: value?.price,
      rate: value?.rate,
      value: value,
    };
  };

  useEffect(() => {
    loadCategory();
  }, []);

  useEffect(() => {
    loadPlace();
  }, [categoryId]);

  useEffect(() => {
    const debouncedLoadPlace = debounce(loadPlace, 400);
    debouncedLoadPlace();
    return () => {
      debouncedLoadPlace.cancel();
    };
  }, [keyword]);

  const loadPlace = async (limit?: number, skip?: number, status?: number) => {
    try {
      const actionResult = await dispatch(
        requestGetPlace({category_id: categoryId, keyword })
      );
      const res = unwrapResult(actionResult);
    } catch (error) {
      notification.error({
        message: "không tải được danh sách",
      });
    }
  };

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
      const res = await apiDeletePlace(id) 
      
      if(res.data.code === 0) {
        notification.success({
          message: "Cập nhật thành công",
          duration: 1.5,
        });
      } else {
        notification.success({
          message: "Cập nhật thất bại",
          duration: 1.5,
        });
      }
      loadPlace();
    } catch (error) {
      notification.error({
        message: "cập nhật không được",
        duration: 1.5,
      });
    }
  };

  const handleOk = () => {
    form.validateFields().then(async (value: any) => {
      const infoPlace = {
        ...value,
        latitude: Number(value.latitude),
        longitude: Number(value.longitude),
        price: Number(value.price),
        images: dataUpload
      }
      try {
        if(isEdit) {
          const res = await apiUpdatePlace({
            id: valueEdit?.id || '',
            ...infoPlace
          })
          if(res.data.code === 0) {
            notification.success({
              message: "Cập nhật thành công",
              duration: 1.5,
            });
          } else {
            notification.success({
              message: "Cập nhật thất bại",
              duration: 1.5,
            });
          }
        } else {
          const res = await apiCreatePlace({
            ...infoPlace
          })
          if(res.data.code === 0) {
            notification.success({
              message: "Thêm thành công",
              duration: 1.5,
            });
          } else {
            notification.success({
              message: "Thêm thất bại",
              duration: 1.5,
            });
          }
        }
        loadPlace();
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
      title: "Tên",
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Địa điểm",
      dataIndex: "address",
      key: "address",
      align: "center",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Kinh độ",
      dataIndex: "latitude",
      key: "longitude",
      align: "center",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Vĩ đỗ",
      dataIndex: "latitude",
      key: "latitude",
      align: "center",
      render: (text) => <span>{text}</span>,
    },
    // {
    //   title: "Mô tả",
    //   dataIndex: "description",
    //   key: "description",
    //   align: "center",
    //   render: (text) => <span>{text}</span>,
    // },
    {
      title: "Thể loại",
      dataIndex: "categories",
      key: "categories",
      align: "center",
      render: (text: any) => (
        <> 
          {categorys?.map((o, i) =>(
            text.find((c) =>(c.id === o.id)) ? <Tag key={i}>{o.name}</Tag> : undefined
          ))}
        </>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Rate",
      dataIndex: "rate",
      key: "rate",
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
      <Space>
      <Space size="large">
        <Button type="primary" onClick={openCreateModal}>
          Thêm mới
        </Button>
      </Space>
        <Space size="small">
          <label style={{ marginLeft: "20px" }}>Chọn trạng thái:</label>
          <Select
            placeholder={"Bộ lọc"}
            style={{ width: 150, marginLeft: "10px" }}
            defaultValue={null}
            options={[{
              value: null,
              label: "Tất Cả",
            }, ...categorys.map(e => ({
              value: e.id,
              label: e.name
            }))]}
            onChange={(value) => {
              setCategoryId(value);
            }}
          />
        </Space>
        <Space size="small">
          {/* <label style={{ marginLeft: "20px" }}>Chọn trạng thái:</label> */}
          <Input
            placeholder={"Nhập tên hoặc địa điểm"}
            style={{ width: 150, marginLeft: "10px" }}
            onChange={(e) => {
              setKeyword(e.target.value);
            }}
          />
        </Space>
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
        title={`${isEdit ? "Chỉnh sửa" : "Tạo"}  Place`}
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
            <Form.Item label={<h3>{"Plcae"}</h3>}>
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

              <Form.Item
                name="categories"
                label="Thể loại"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập trường này!",
                  },
                ]}
              >
                <Select
                    showSearch
                    mode="multiple"
                    style={{ width: "100%" }}
                    placeholder={"Search to Select category"}
                    options={categorys?.map((data) => ({
                      value: data.id,
                      label: data.name,
                    }))}
                    onChange={(value) => {
                      setSelectCategory(value);
                    }}
                  />
              </Form.Item>

            </Col>

            <Col
              xl={12}
              md={12}
              xs={24}
            >
              <Form.Item
                name="latitude"
                label="Vĩ độ"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập trường này!",
                  },
                ]}
              >
                <Input type="number"/>
              </Form.Item>
              <Form.Item
                name="longitude"
                label="Kinh độ"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập trường này!",
                  },
                ]}
              >
                <Input type="number"/>
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
                <Input type="number"/>
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
                  maxLength={1000}
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
