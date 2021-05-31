import React, { Component } from "react";
import Highlighter from "react-highlight-words";
import { Table, Input, Button, Space, Modal, DatePicker } from "antd";
import {
  FilterOutlined,
  SearchOutlined,
  EyeOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import Grid from "@material-ui/core/Grid";
import "./requests.css";
import { connect } from "react-redux";
import { showLoading, hideLoading } from "../actions/loading-action";
import { openAlert } from "../actions/alert-action";
import { get, post } from "../../API";
// eslint-disable-next-line no-unused-vars
import translateKey from "../../utilities/TranslatedKeys";
import { Paper } from "@material-ui/core";
var vactionCut = { request_id: "", date: "", columnName: "" };
var HEADER = "";
class TableMyRequests extends Component {
  state = {
    searchText: "",
    searchedColumn: "",
    modal2Visible: false,
    modal3Visible: false,
    data: [],
    Requests_details: [],
    modalCut: false,
    date: null,
    time: null,
    PeopleInTheSameTeamWithinSpeceficEmployeeVacation: [],
  };

  componentDidMount = () => {
    this.props.setChildContext(this);
    this.getRequests({
      date: new Date().toISOString().split("T")[0],
    });
  };

  setModal2Visible(modal2Visible) {
    this.setState({ modal2Visible });
  }
  setModal3Visible(modal3Visible) {
    this.setState({ modal3Visible });
  }
  handleChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
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

  render() {
    const { TextArea } = Input;
    const { data } = this.state;
    const columns = [
      {
        title: "رقم الطلب",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "اسم صاحب الطلب",
        dataIndex: "ar_name",
        key: "ar_name",
      },
      {
        title: " تاريخ الطلب",
        dataIndex: "created_at",
        key: "created_at",
      },
      {
        title: "نوع الطلب",
        dataIndex: "process_name",
        key: "process_name",
      },

      {
        title: "حالة الطلب",
        dataIndex: "state_name",
        key: "state_name",
      },
      // Action_type_id: 2
      // Action_type_name: "موافقة"
      // is_editor: false
      // to_state: 3
      {
        title: "",
        key: "action",
        render: (
          text,
          {
            actionToTake = [],
            id,
            closed = false,
            emp_id,
            Requests_details,
            action_taked = "rejected",
            process_id,
            vacation_cut,
            department_name,
            ar_name,
            process_name,
          }
        ) =>
          this.getRecordButtons(
            id,
            actionToTake,
            closed,
            emp_id,
            Requests_details,
            action_taked,
            process_id,
            vacation_cut,
            department_name,
            ar_name,
            process_name
          ),
      },
    ];
    // "name": "مروان محمد حسن سالم",
    // "code": "10126",
    // "from": "2020-12-01T15:00:00.000Z",
    // "to": "2020-12-01T17:00:00.000Z",
    // "request_name": "اجازة",
    // "days": 0.5
    const getPeopleInTheSameTeamWithinSpeceficEmployeeVacationColoumns = [
      {
        title: "كود الموظف",
        dataIndex: "code",
        key: "code",
      },
      {
        title: "اسم الموظف",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "التاريخ من",
        dataIndex: "from",
        key: "from",
      },
      {
        title: "التاريخ الي",
        dataIndex: "to",
        key: "to",
      },

      {
        title: "نوع الطلب",
        dataIndex: "request_name",
        key: "request_name",
      },

      {
        title: "المدة",
        dataIndex: "days",
        key: "days",
      },
    ];
    return (
      <>
        <Modal
          centered
          visible={this.state.modal2Visible}
          onOk={() => this.setModal2Visible(false)}
          onCancel={() => this.setModal2Visible(false)}
          footer={[
            <Button key="back" onClick={() => this.setModal2Visible(false)}>
              إلغاء
            </Button>,
            <Button
              key="submit"
              style={{ backgroundColor: "#93C020", borderColor: "#93C020" }}
              type="primary"
              onClick={() => this.setModal2Visible(false)}
            >
              ارسال
            </Button>,
          ]}
        >
          <Grid container style={{ marginTop: "40px" }}>
            <Grid sm={4} style={{ textAlign: "center" }}>
              <label>سبب رفض الطلب</label>
            </Grid>
            <Grid item sm={8}>
              <TextArea rows={4} />
            </Grid>
          </Grid>
        </Modal>

        <Modal
          centered
          visible={this.state.modal3Visible}
          onOk={() => this.setModal3Visible(false)}
          onCancel={() => this.setModal3Visible(false)}
          footer={[
            <Button key="back" onClick={() => this.setModal3Visible(false)}>
              إلغاء
            </Button>,
            <Button
              key="submit"
              style={{ backgroundColor: "#93C020", borderColor: "#93C020" }}
              type="primary"
              onClick={() => this.setModal3Visible(false)}
            >
              تم
            </Button>,
          ]}
        >
          <Grid
            container
            style={{
              padding: "70px 55px 15px",
              fontSize: "18px",
              fontWeight: "bold",
              position: "relative",
            }}
          >
            <CloseCircleOutlined
              style={{
                color: "lightgrey",
                position: "absolute",
                top: "15px",
                left: "15px",
                fontSize: "35px",
                cursor: "pointer",
              }}
              onClick={() => this.setModal3Visible(false)}
            />
            <Grid style={{ textAlign: "center" }}>
              <label>{HEADER}</label>
            </Grid>
          </Grid>
          {this.state.Requests_details.map(({ name, value }, index) => {
            return (
              <Grid key={index} container style={{ marginTop: "20px" }}>
                <Grid sm={2} style={{ textAlign: "center" }}>
                  <label style={{ color: "grey", fontSize: "16px" }}>
                    {name}
                  </label>
                </Grid>
                <Grid item sm={8}>
                  <label style={{ fontWeight: "bold", fontSize: "18px" }}>
                    {value}
                  </label>
                </Grid>
              </Grid>
            );
          })}
          <Paper
            style={{
              textAlign: "center",
              color: "grey",
              direction: "rtl",
              border: "0.5px solid #dcdcdc",
              boxShadow: "none",
              borderRadius: "2px",
              padding: "0px 0px 0px 0px",
              marginBottom: "2rem",
              marginTop: "2rem",
            }}
          >
            <Grid
              container
              style={{ padding: "15px 15px 15px", fontSize: "18px" }}
            >
              <label>الطلبات الموافق عليها في نفس توقيت هذا الطلب</label>
            </Grid>
            <Table
              columns={
                getPeopleInTheSameTeamWithinSpeceficEmployeeVacationColoumns
              }
              rowClassName={(record, index) =>
                index % 2 === 0 ? "table-row-light" : "table-row-dark"
              }
              // style={{
              //   border: "0.5px solid #dcdcdc",
              //   borderRadius: "2px",
              // }}
              dataSource={
                this.state.PeopleInTheSameTeamWithinSpeceficEmployeeVacation
              }
              // pagination={{
              //   // defaultPageSize: 10,
              //   // position: ["bottomRight"],
              //   // pageSizeOptions: ["10", "20", "30"],
              //   disabled: true,

              // }}
            />
          </Paper>
        </Modal>

        <Modal
          centered
          visible={this.state.modalCut}
          onOk={() => this.setState({ modalCut: false })}
          onCancel={() => this.setState({ modalCut: false })}
          footer={[
            <Button
              key="back"
              onClick={() => this.setState({ modalCut: false })}
            >
              إلغاء
            </Button>,
            <Button
              key="submit"
              style={{ backgroundColor: "#93C020", borderColor: "#93C020" }}
              type="primary"
              onClick={() => this.cutVacation()}
            >
              ارسال
            </Button>,
          ]}
        >
          <Grid container style={{ marginBottom: "13px" }}>
            <Grid
              item
              lg={1}
              className="textLabel"
              xs={12}
              style={{ fontSize: "16px", marginTop: "10px" }}
            >
              <label>التاريخ من</label>
            </Grid>
            <Grid item lg={5} xs={12} className="dateFilter">
              <DatePicker
                value={this.state.date}
                onChange={(date, dateString) => {
                  this.setState({ date });
                }}
                placeholder=""
                style={{ width: "100%", height: "100%" }}
              />
            </Grid>

            <Grid
              item
              lg={1}
              className="textLabel"
              xs={12}
              style={{ fontSize: "16px", marginTop: "10px" }}
            >
              <label>الوقت من</label>
            </Grid>
            <Grid item lg={5} xs={12} className="dateFilter">
              <DatePicker
                placeholder=""
                picker={"time"}
                style={{ width: "100%", height: "100%" }}
                value={this.state.time}
                onChange={(date, dateString) => {
                  this.setState({ time: date });
                }}
              />
            </Grid>
          </Grid>
        </Modal>
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
            pageSizeOptions: ["10", "20", "30"],
          }}
        />
      </>
    );
  }
  getRecordButtons = (
    request_id,
    actionToTake,
    closed,
    emp_id,
    Requests_details,
    action_taked,
    process_id,
    vacation_cut,
    department_name,
    ar_name,
    process_name
  ) => {
    let { from, to, reason } = this.getFromAndToFromRequestDetails(
      Requests_details
    );

    if (actionToTake.length !== 0)
      return (
        <Space>
          {actionToTake.map(
            ({ Action_type_name, Action_type_id, to_state }) => (
              <Button
                style={{
                  borderColor: Action_type_id === 2 ? "#93C020" : "red",
                  color: Action_type_id === 2 ? "#93C020" : "red",
                }}
                onClick={() =>
                  this.updateRequest(request_id, Action_type_id, to_state)
                }
              >
                {Action_type_name}
              </Button>
            )
          )}
          <button
            onClick={() => {
              this.showRequestDetails({
                from,
                to,
                ar_name,
                department_name,
                process_name,
                request_id,
                process_id,
                reason,
              });
            }}
            id="viewdetails"
          >
            <EyeOutlined />
          </button>
        </Space>
      );
    else if (closed && action_taked === "approved")
      return (
        <Space>
          <button
            onClick={() => {
              this.showRequestDetails({
                from,
                to,
                ar_name,
                department_name,
                process_name,
                request_id,
                process_id,
                reason,
              });
            }}
            id="viewdetails"
          >
            <EyeOutlined />
          </button>

          {this.props.lookUps.processesCutness[process_id].canCut &&
            vacation_cut === false &&
            new Date(new Date() + "UTC") >= from &&
            new Date(new Date() + "UTC") <= to && (
              <Button
                danger
                onClick={() => {
                  vactionCut.columnName = this.props.lookUps.processesCutness[
                    process_id
                  ].columnName;
                  vactionCut.request_id = request_id;
                  this.setState({ modalCut: true });
                }}
              >
                قطع الاجازة
              </Button>
            )}
        </Space>
      );
    else
      return (
        <Space>
          <button
            onClick={() => {
              this.showRequestDetails({
                from,
                to,
                ar_name,
                department_name,
                process_name,
                request_id,
                process_id,
                reason,
              });
            }}
            id="viewdetails"
          >
            <EyeOutlined />
          </button>
          {!closed && this.props.userData.emp_id === emp_id && (
            <Button danger onClick={() => this.deleteRequest(request_id)}>
              الغاء الطلب
            </Button>
          )}
        </Space>
      );
  };

  //   <Button danger onClick={() => this.setModal2Visible(true)}>
  //   الغاء الطلب
  // </Button>
  getRequests = async (filters = {}) => {
    this.props.showLoading();
    let {
      valid = false,
      msg = "لا يمكن الاتصال بالسيرفر",
      data,
      // page,
      // per_page,
      // total,
    } = await get("requests/get_requests", { ...filters });
    if (valid) {
      this.setState({ data: data });
      this.props.openAlert("success", msg);
    } else {
      this.setState({ data: [] });
      // this.setState({ data: [], page: 0, per_page: 0, total: 0 });
      this.props.openAlert("error", msg);
    }
    this.props.hideLoading();
  };
  updateRequest = async (request_id, action_id, state_id) => {
    this.props.showLoading();
    let { valid = false, msg = "لا يمكن الاتصال بالسيرفر" } = await post(
      "requests/update_request",
      {
        request_id,
        action_id,
        state_id,
      }
    );
    if (valid) {
      this.props.openAlert("success", msg);
    } else {
      // this.setState({ data: [], page: 0, per_page: 0, total: 0 });
      this.props.openAlert("error", msg);
    }
    this.getRequests();
    this.props.hideLoading();
  };

  deleteRequest = async (request_id) => {
    this.props.showLoading();
    let { valid = false, msg = "لا يمكن الاتصال بالسيرفر" } = await post(
      "requests/delete_request",
      {
        request_id,
      }
    );
    if (valid) {
      this.props.openAlert("success", msg);
    } else {
      // this.setState({ data: [], page: 0, per_page: 0, total: 0 });
      this.props.openAlert("error", msg);
    }
    this.getRequests();
    this.props.hideLoading();
  };

  getPeopleInTheSameTeamWithinSpeceficEmployeeVacation = async (request_id) => {
    this.props.showLoading();
    let {
      valid = false,
      msg = "لا يمكن الاتصال بالسيرفر",
      data = [],
    } = await post(
      "requests/getPeopleInTheSameTeamWithinSpeceficEmployeeVacation",
      {
        request_id,
      }
    );
    if (valid) {
      this.setState({
        PeopleInTheSameTeamWithinSpeceficEmployeeVacation: data,
      });
      this.props.openAlert("success", msg);
    } else {
      this.props.openAlert("error", msg);
    }
    this.props.hideLoading();
  };

  cutVacation = async () => {
    let date = this.state.date.toISOString().split("T")[0];
    let [hours, minutes, seconds] = this.state.time
      .toISOString()
      .split(".")[0]
      .split("T")[1]
      .split(":");

    let tempTime = `${parseInt(hours) + 2}:${minutes}:${seconds}`;

    if (tempTime.length !== 8) tempTime = "0" + tempTime;

    this.props.showLoading();
    let { valid = false, msg = "لا يمكن الاتصال بالسيرفر" } = await post(
      "requests/cut_vacation",
      {
        request_id: vactionCut.request_id,
        date: `${date} ${tempTime}`,
        columnName: vactionCut.columnName,
      }
    );
    if (valid) {
      this.props.openAlert("success", msg);
      this.getRequests();
    } else {
      // this.setState({ data: [], page: 0, per_page: 0, total: 0 });
      this.props.openAlert("error", msg);
    }
    this.setState({ modalCut: false });
    // this.getRequests();
    this.props.hideLoading();
  };

  getFromAndToFromRequestDetails = (Requests_details) => {
    let from,
      to,
      reason = "";
    for (const { key, value } of Requests_details) {
      if (key === "from") {
        let [requestFromDate, requestFromTime] = value.split(" ");
        from = new Date(`${requestFromDate}T${requestFromTime}.000Z`);
      } else if (key === "to") {
        let [requestToDate, requestToTime] = value.split(" ");
        to = new Date(`${requestToDate}T${requestToTime}.000Z`);
      } else if (key === "reason") reason = value;
    }
    return { from, to, reason };
  };

  getNearstDayCount = (diffrenenceCount) => {
    // let start = 0.5;

    // while (diffrenenceCount > start) {
    //   start += 0.5;
    // }

    return diffrenenceCount.toFixed(2);
  };

  showRequestDetails = ({
    from,
    to,
    ar_name,
    department_name,
    process_name,
    request_id,
    process_id,
    reason,
  }) => {
    console.log((to - from) / 86400000);
    if (from) {
      HEADER = `لقد قام ${ar_name} بقسم ال ${department_name} بطلب ${process_name} لمدة ${this.getNearstDayCount(
        (to - from) / 86400000
      )} يوم`;
      this.getPeopleInTheSameTeamWithinSpeceficEmployeeVacation(request_id);
      let dataToShow = [
        { name: "القسم:", value: department_name },
        {
          name: "التاريخ من:",
          value: from.toISOString().split(".")[0].replace("T", " "),
        },
        {
          name: "التاريخ الي:",
          value: to.toISOString().split(".")[0].replace("T", " "),
        },
        {
          name: "نوع الاجازة:",
          value: this.props.lookUps.processes[process_id],
        },
        { name: "السبب:", value: reason },
        {
          name: "مدة الاجازة:",
          value: `${this.getNearstDayCount((to - from) / 86400000)} يوم`,
        },
      ];

      reason.length === 0 && dataToShow.splice(4, 1);
      this.setModal3Visible(true);
      this.setState({ Requests_details: dataToShow });
    } else {
      HEADER = `لقد قام ${ar_name} بقسم ال ${department_name} بطلب ${process_name}`;
      this.getPeopleInTheSameTeamWithinSpeceficEmployeeVacation(request_id);
      let dataToShow = [
        { name: "القسم:", value: department_name },
        {
          name: "نوع الطلب:",
          value: this.props.lookUps.processes[process_id],
        },
        { name: "السبب:", value: reason },
      ];
      reason.length === 0 && dataToShow.splice(4, 1);
      this.setModal3Visible(true);
      this.setState({ Requests_details: dataToShow });
    }
  };
}

const mapStateToProps = (state) => {
  return {
    lookUps: state.mainData,
    userData: state.userData,
  };
};

export default connect(mapStateToProps, {
  showLoading,
  openAlert,
  hideLoading,
})(TableMyRequests);
