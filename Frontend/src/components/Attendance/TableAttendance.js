import React, { Component } from "react";
import Highlighter from "react-highlight-words";
import { Table, Input, Button, Space, Modal } from "antd";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { Select } from "antd";
import { FilterOutlined, SearchOutlined, EyeOutlined } from "@ant-design/icons";
import "./attendance.css";
// eslint-disable-next-line no-unused-vars
import { get, post } from "../../API";
import { connect } from "react-redux";
import { showLoading, hideLoading } from "../actions/loading-action";
import { openAlert } from "../actions/alert-action";
import translateKey from "../../utilities/TranslatedKeys";
import { CheckCircle, Error } from "@material-ui/icons";
let emp_id = "";
let attendance_id = "";
let current_page = 0;
class TableAttendance extends Component {
  state = {
    searchText: "",
    searchedColumn: "",
    selectedRowKeys: [],
    loading: false,
    modalAttend: false,
    modal3Visible: false,
    Requests_details: [],
    actionsToTake: [],
    taked_action: "",
    value: "",
    current: 1,
  };
  setModalAttend(modalAttend) {
    this.setState({ modalAttend });
  }
  start = () => {
    this.setState({ loading: true });
    // ajax request after empty completing
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      });
    }, 1000);
  };
  componentDidMount = () => {
    this.props.setContext(this);
  };
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  handleChange = (pagination, filters, sorter) => {
    current_page = pagination.current - 1;
    this.props.getAttendance(current_page);
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
      current: pagination.current,
    });
  };

  clearFilters = () => {
    this.setState({ filteredInfo: null });
  };

  clearAll = () => {
    this.setState({
      filteredInfo: null,
      sortedInfo: null,
    });
  };

  setAgeSort = () => {
    this.setState({
      sortedInfo: {
        order: "descend",
        columnKey: "age",
      },
    });
  };

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            بحث
          </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            اعادة بحث
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <FilterOutlined style={{ color: "#FFFFFF" }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  adjustDate = (date) => {
    if (date) {
      // eslint-disable-next-line no-unused-vars
      let [first, second] = date.split(".")[0].replace("T", " ").split(" ");
      return second;
    } else return "";
  };
  getExceptionDetails = async ({
    request_id,
    OfficialHoliday,
    createdAt,
    emp_id,
    Request,
  }) => {
    if (request_id)
      this.setState({
        Requests_details: Request.Requests_details.map(({ key, value }) => {
          return { key, value };
        }),
        modal3Visible: true,
      });
    else
      this.setState({
        Requests_details: [
          { key: "from", value: OfficialHoliday.from },
          { key: "to", value: OfficialHoliday.to },
          {
            key: "نوع الاجازة الرسمية",
            value: OfficialHoliday.HolidaysType.name,
          },
        ],
        modal3Visible: true,
      });
  };

  getTimeDiffrence = (actual_in, planned_in) => {
    let [h1, m1, s1] = actual_in.split(":");
    let [h2, m2, s2] = planned_in.split(":");
    let actual_in_minutes =
      parseInt(h1) * 60 + parseInt(m1) + parseInt(s1) / 60;
    let planned_in_minutes =
      parseInt(h2) * 60 + parseInt(m2) + parseInt(s2) / 60;

    return actual_in_minutes - planned_in_minutes;
  };

  getColor = (actual, { planned_in, planned_out }, range) => {
    let color = "#93C020",
      text = "",
      icon = CheckCircle;
    if (actual) {
      text = this.adjustDate(actual);

      if (
        (range > 0 &&
          this.getTimeDiffrence(text, planned_in.split(" ")[1]) > range) ||
        (range < 0 &&
          this.getTimeDiffrence(text, planned_out.split(" ")[1]) < range)
      ) {
        color = "red";
        icon = Error;
      }
    } else {
      text = "لم يتم الحضور";
      color = "red";
      icon = Error;
    }
    return this.attendance_icon(text, color, icon);
  };

  getActionsForMismatchRecords = ({
    taked_action,
    planned_in,
    planned_out,
    actual_in,
    actual_out,
    emp_id: Emp_id,
    id,
    is_exception,
    forgiveness_evening_time,
    forgiveness_morning_time,
  }) => {
    if (
      taked_action === null &&
      !is_exception &&
      (this.getTimeDiffrence(
        this.adjustDate(actual_in),
        planned_in.split(" ")[1]
      ) > forgiveness_morning_time ||
        (this.adjustDate(actual_out) !== this.adjustDate(actual_in) &&
          this.getTimeDiffrence(
            this.adjustDate(actual_out),
            planned_out.split(" ")[1]
          ) < -forgiveness_evening_time) ||
        actual_in === null)
    )
      // id, name, type, affect_column, plus_or_minus, createdAt, updatedAt
      return (
        <>
          <Button
            type="primary"
            style={{ color: "#93C020", borderColor: "#93C020" }}
            ghost
            onClick={() => {
              attendance_id = id;
              emp_id = Emp_id;
              this.forgiveAction();
            }}
          >
            تجاوز
          </Button>

          {/* <Button
            type="primary"
            danger
            ghost
            style={{ marginRight: "10px" }}
            onClick={() => {
              attendance_id = id;
              emp_id = Emp_id;
              this.setState({
                taked_action: "",
                value: "",
                modalAttend: true,
                actionsToTake: Object.keys(
                  this.props.lookUps.attendancemisactions
                )
                  .map((key) => {
                    if (
                      this.props.lookUps.attendancemisactions[key].type ===
                      "negative"
                    )
                      return this.props.lookUps.attendancemisactions[key];
                    else return null;
                  })
                  .filter((e) => e !== null),
              });
            }}
          >
            إتخاذ إجراء
          </Button>
        */}
        </>
      );
    // else if (
    //   taked_action === null &&
    //   this.adjustDate(actual_in) <= planned_in.split(" ")[1]
    // )
    //   return (
    //     <>
    //       <Button
    //         type="primary"
    //         danger
    //         ghost
    //         style={{ marginLeft: "10px" }}
    //         onClick={() => {
    //           this.setState({
    //             modalAttend: true,
    //             actionsToTake: Object.keys(
    //               this.props.lookUps.attendancemisactions
    //             ).map((key) => {
    //               if (
    //                 this.props.lookUps.attendancemisactions[key].type ===
    //                 "positive"
    //               )
    //                 return this.props.lookUps.attendancemisactions[key];
    //             }),
    //           });
    //           console.log();
    //         }}
    //       >
    //         إتخاذ إجراء
    //       </Button>
    //       <Button type="primary" color="#93C020" ghost>
    //         تجاوز
    //       </Button>
    //     </>
    //   );
  };
  attendance_icon = (text = "", color = "black", MyIcon = CheckCircle) => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          color,
        }}
      >
        <MyIcon style={{ marginLeft: "10px" }} />
        {text}
      </div>
    );
  };

  render() {
    const { Option } = Select;
    const { data, total } = this.props.data;
    const {
      // eslint-disable-next-line no-unused-vars
      loading,
      selectedRowKeys,
      taked_action,
      actionsToTake,
      modalAttend,
      value,
    } = this.state;
    // const rowSelection = {
    //   selectedRowKeys,
    //   onChange: this.onSelectChange,
    // };

    const hasSelected = selectedRowKeys.length > 0;
    const columns = [
      {
        title: "كود الموظف",
        dataIndex: "emp_code",
        key: "emp_code",
        render: (text, row) => <p> {row.Employee.emp_code} </p>,
      },
      {
        title: "اسم الموظف",
        dataIndex: "ar_name",
        key: "ar_name",

        render: (text, row) => <p> {row.Employee.ar_name} </p>,
      },
      {
        title: "التاريخ",
        dataIndex: "createdAt",
        key: "createdAt",

        render: (text, row) => (
          <p> {text.split(".")[0].replace("T", " ").split(" ")[0]} </p>
        ),
      },
      // {
      //   title: "ميعاد الحضور المقرر",
      //   dataIndex: "planned_in",
      //   key: "planned_in",
      //   render: (text, row) => <p> {this.adjustDate(text)} </p>,
      // },
      // {
      //   title: "ميعاد الانصراف المقرر",
      //   dataIndex: "planned_out",
      //   key: "planned_out",
      //   render: (text, row) => <p> {this.adjustDate(text)} </p>,
      // },

      {
        title: "الحضور",
        dataIndex: "actual_in",
        key: "actual_in",
        render: (text, row) =>
          this.getColor(text, row, row.forgiveness_morning_time),
      },
      {
        title: "الأنصراف",
        dataIndex: "actual_out",
        key: "actual_out",
        render: (text, row) => (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {row.actual_in === null && row.actual_out === null
              ? this.getColor(text, row, -row.forgiveness_evening_time)
              : row.actual_in === row.actual_out
              ? "لم يتم الانصراف بعد"
              : this.getColor(text, row, -row.forgiveness_evening_time)}
          </div>
        ),
      },
      {
        title: "ملاحظات",
        dataIndex: "is_exception",
        key: "is_exception",
        render: (text, row) => (
          <p>
            {row.Request
              ? row.Request.Process.name
              : row.is_exception && row.taked_action
              ? "تم التجاوز"
              : row.OfficialHoliday
              ? row.OfficialHoliday.HolidaysType.name
              : "-  "}
          </p>
        ),
      },
      {
        title: "",
        key: "action",
        render: (text, record) => (
          <Space>
            {(record.request_id || record.official_holiday_id) && (
              <button
                onClick={() => this.getExceptionDetails(record)}
                style={{
                  paddingRight: "8px",
                  paddingLeft: "8px",
                  border: "1px solid #1053AB",
                  borderRadius: "2px",
                  color: "#1053AB",
                }}
              >
                <EyeOutlined />
              </button>
            )}

            {this.getActionsForMismatchRecords(record)}
          </Space>
        ),
      },
    ];
    return (
      <>
        <Modal
          centered
          style={{ width: "938px" }}
          visible={modalAttend}
          footer={[
            <Grid
              container
              style={{
                marginBottom: "52px",
                display: "flex",
                justifyContent: "flex-end",
                paddingLeft: "79px",
              }}
            >
              <Grid item sm={2}>
                <Button
                  key="back"
                  onClick={() => this.setModalAttend(false)}
                  style={{
                    width: "100%",
                    borderColor: "#5E5E5E",
                  }}
                >
                  إلغاء
                </Button>
              </Grid>
              <Grid item sm={2} style={{ marginRight: "22px" }}>
                <Button
                  disabled={
                    value.trim().length === 0 || taked_action.length === 0
                  }
                  key="submit"
                  style={{
                    backgroundColor: "#93C020",
                    width: "100%",
                    borderColor: "#93C020",
                  }}
                  type="primary"
                  onClick={this.setAction}
                >
                  ارسال
                </Button>
              </Grid>
            </Grid>,
          ]}
        >
          {/* <Grid container style={{ marginTop: "52px" }}>
            <Grid sm={1}>
              <label>اضافة</label>
            </Grid>
            <Grid item sm={10}>
              <Select size="default" defaultValue="1" style={{ width: "100%" }}>
                <Option key="1">حضور</Option>
                <Option key="2">انصراف</Option>
              </Select>
            </Grid>
          </Grid>

          <Grid container style={{ marginTop: "18px" }}>
            <Grid sm={1}>
              <label>الوقت</label>
            </Grid>
            <Grid item sm={8}>
              <TextField
                variant="outlined"
                required
                InputProps={{
                  style: { height: "40px", fontSize: "15px", width: "98%" },
                }}
                fullWidth
                InputLabelProps={{
                  style: {
                    direction: "rtl",
                  },
                }}
                id="email"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item sm={2}>
              <Select size="default" defaultValue="1" style={{ width: "100%" }}>
                <Option key="1">صباحاً</Option>
                <Option key="2">مساءاً</Option>
              </Select>
            </Grid>
          </Grid> */}

          <Grid container style={{ marginTop: "18px", textAlign: "center" }}>
            <Grid container style={{ marginBottom: "13px" }}>
              <Grid
                item
                lg={2}
                xs={12}
                className="textLabel"
                style={{
                  fontSize: "14px",
                  marginTop: "10px",
                }}
              >
                <label>الاجراء اللازم</label>
              </Grid>
              <Grid item sm={9} md={9}>
                <Select
                  value={taked_action}
                  onChange={(e) => this.setState({ taked_action: e })}
                  size="default"
                  style={{ width: "100%", height: "100%" }}
                >
                  {actionsToTake.map((action) => {
                    return <Option key={action.id}>{action.name}</Option>;
                  })}
                </Select>
              </Grid>
            </Grid>

            <Grid container style={{ marginBottom: "13px" }}>
              <Grid
                item
                sm={2}
                className="textLabel"
                style={{
                  fontSize: "14px",
                  marginTop: "10px",
                }}
              >
                <label>القيمة</label>
              </Grid>
              <Grid item sm={5}>
                <TextField
                  autoComplete="fname"
                  name="firstName"
                  InputLabelProps={{
                    style: {
                      direction: "rtl",
                      width: "90%",
                    },
                  }}
                  InputProps={{
                    style: { height: "40px", fontSize: "15px", width: "90%" },
                  }}
                  value={value}
                  onChange={({ target: { value } }) => {
                    this.setState({ value });
                  }}
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  autoFocus
                />
              </Grid>
              {/* <Grid item sm={4}>
                <TextField
                  autoComplete="fname"
                  name="firstName"
                  InputLabelProps={{
                    style: {
                      direction: "rtl",
                      width: "90%",
                    },
                  }}
                  InputProps={{
                    style: { height: "40px", fontSize: "15px" },
                  }}
                  // value={ar_name}
                  onChange={({ target: { value } }) => {
                    // set_ar_name(value);
                  }}
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  autoFocus
                />
              </Grid>
            */}
            </Grid>
          </Grid>

          {/* <div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <label className="textLabel">الاجراءات</label>
              <Select
                value={taked_action}
                onChange={(e) => this.setState({ taked_action: e })}
                size="default"
                style={{ width: "100%", height: "100%" }}
              >
                {actionsToTake.map((action) => {
                  return <Option key={action.id}>{action.name}</Option>;
                })}
              </Select>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <label className="textLabel">القيمة</label>
              <TextField
                // autoComplete="fname"
                // name="firstName"
                // InputLabelProps={{
                //   style: {
                //     direction: "rtl",
                //     width: "90%",
                //   },
                // }}
                value={value}
                onChange={({ target: { value } }) => {
                  this.setState({ value });
                }}
                variant="outlined"
                fullWidth
              />
            </div>
          </div> */}
        </Modal>
        <Modal
          centered
          visible={this.state.modal3Visible}
          onOk={() => this.setState({ modal3Visible: false })}
          onCancel={() => this.setState({ modal3Visible: false })}
          footer={[
            <Button
              key="back"
              onClick={() => this.setState({ modal3Visible: false })}
            >
              إلغاء
            </Button>,
            <Button
              key="submit"
              style={{ backgroundColor: "#93C020", borderColor: "#93C020" }}
              type="primary"
              onClick={() => this.setState({ modal3Visible: false })}
            >
              تم
            </Button>,
          ]}
        >
          {this.state.Requests_details.map(({ key, value }, index) => {
            return (
              <Grid key={index} container style={{ marginTop: "40px" }}>
                <Grid sm={4} style={{ textAlign: "center" }}>
                  <label>{translateKey(key)}</label>
                </Grid>
                <Grid item sm={8}>
                  {value}
                </Grid>
              </Grid>
            );
          })}
        </Modal>
        <div style={{ marginBottom: 16, textAlign: "left" }}>
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `حضور ${selectedRowKeys.length} موظف` : ""}
          </span>
          <Button
            type="primary"
            style={{
              backgroundColor: "#FEA900",
              color: "#FFF",
              borderColor: "#FEA900",
            }}
            // onClick={this.start}
            onClick={() => this.props.update_actual_in_out()}
          >
            تحميل الحضور و الانصراف
          </Button>
        </div>
        <Table
          columns={columns}
          rowClassName={(record, index) =>
            index % 2 === 0 ? "table-row-light" : "table-row-dark"
          }
          style={{
            border: "0.5px solid #dcdcdc",
            borderRadius: "2px",
            marginBottom: "2rem",
          }}
          dataSource={data}
          pagination={{
            defaultPageSize: 10,
            position: ["bottomRight"],
            pageSizeOptions: ["10"],
            total: total,
            current: this.state.current,
          }}
          onChange={this.handleChange}
        />
      </>
    );
  }

  setAction = async () => {
    const {
      affect_column,
      plus_or_minus,
    } = this.props.lookUps.attendancemisactions[this.state.taked_action];
    let dateObj = new Date();
    let month = dateObj.getUTCMonth() + 1; //months from 1-12
    let year = dateObj.getUTCFullYear();
    // emp_id, month_year, affect_column, plus_or_minus, value
    this.setModalAttend(false);
    this.props.showLoading();
    let { valid = false, msg = "لا يمكن الاتصال بالسيرفر" } = await post(
      "att/update_mis_report",
      {
        emp_id,
        month_year: `${month}-${year}`,
        affect_column,
        plus_or_minus,
        value: this.state.value,
        attendance_id,
      }
    );
    if (valid) {
      this.props.openAlert("success", msg);
      this.props.getAttendance(current_page);
    } else {
      // this.setState({ data: [], page: 0, per_page: 0, total: 0 });
      this.props.openAlert("error", msg);
    }
    this.setState({ value: "", taked_action: "" });

    this.props.hideLoading();
  };

  forgiveAction = async () => {
    this.setModalAttend(false);
    this.props.showLoading();
    let { valid = false, msg = "لا يمكن الاتصال بالسيرفر" } = await post(
      "att/forgive_action",
      {
        emp_id,
        id: attendance_id,
      }
    );
    if (valid) {
      this.props.openAlert("success", msg);
      this.props.getAttendance(current_page);
    } else {
      // this.setState({ data: [], page: 0, per_page: 0, total: 0 });
      this.props.openAlert("error", msg);
    }
    this.props.hideLoading();
  };
}

const mapStateToProps = (state) => {
  return {
    lookUps: state.mainData,
  };
};

export default connect(mapStateToProps, {
  showLoading,
  hideLoading,
  openAlert,
})(TableAttendance);
