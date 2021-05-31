import React, { Component } from "react";
import Highlighter from "react-highlight-words";
import { Table, Input, Button, Space, Modal, DatePicker } from "antd";
import {
  FilterOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  FieldTimeOutlined,
} from "@ant-design/icons";
import "./employees.css";
import { connect } from "react-redux";
import { showLoading, hideLoading } from "../actions/loading-action";
import { openAlert } from "../actions/alert-action";
import { get } from "../../API";
import History from "../../utilities/History";
import { Grid, Typography } from "@material-ui/core";
import UpdateEmployee from "../UpdateEmployee";

// import History from "../../utilities/History";
// import { CollectionsOutlined } from "@material-ui/icons";
var parent_filters = {};
var enNameFromRecord = "";
var emp_id = "";
class TableEmp extends Component {
  state = {
    searchText: "",
    searchedColumn: "",
    data: [],
    rowId: "",
    current: 1,
    showModalUploadFile: false,
    modalContent: 0,
    duesData: {},
    end_date: null,
    disableButton: false,
  };
  openEditModal = ({ en_name = "" }) => {
    enNameFromRecord = en_name;
    this.setState({ showModalUploadFile: true, modalContent: 0 });
  };

  openDuesModal = ({ en_name = "", id }) => {
    enNameFromRecord = en_name;
    this.setState({ showModalUploadFile: true, modalContent: 1, duesData: {} });
  };
  componentDidMount = () => {
    this.props.setChildContext(this);
    this.getEmployees(0, {});
  };

  handleChange = (pagination, filters, sorter) => {
    this.getEmployees(pagination.current - 1, parent_filters);
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
  onClickRow = (record) => {
    return {
      onClick: () => {
        this.setState({ rowId: record.id }, () => {
          // History.push(`/profile/${record.id}`);
        });
      },
    };
  };
  render() {
    const { total = 10 } = this.state;
    // eslint-disable-next-line no-unused-vars
    const { branches, departments, positions, status } = this.props.lookUps;
    const columns = [
      {
        title: "كود الموظف",
        dataIndex: "emp_code",
        key: "emp_code",
      },
      {
        title: "اسم الموظف",
        dataIndex: "ar_name",
        key: "ar_name",
        render: (text, row) => <p> {row.ar_name || row.en_name} </p>,
      },
      // {
      //   title: "العنوان",
      //   dataIndex: "address",
      //   key: "address",
      //   ...this.getColumnSearchProps("address"),
      //   defaultSortOrder: "descend",
      //   sorter: (a, b) => a.address.length - b.address.length,
      // },
      {
        title: "تاريخ التعيين",
        dataIndex: "join_date",
        key: "join_date",
      },
      {
        title: "القسم",
        dataIndex: "department_id",
        key: "department_id",
        render: (text, row) => <p> {departments[text]} </p>,
      },
      {
        title: "الفرع",
        dataIndex: "branch_id",
        key: "branch_id",

        render: (text, row) => <p> {branches[text]} </p>,
      },
      {
        title: "الحالة",
        dataIndex: "actual_status",
        key: "actual_status",
        render: (text, row) => <p> {status[text]} </p>,
      },
      {
        title: "",
        key: "action",
        render: (text, record) => (
          <Space>
            <button
              id="showprofile"
              onClick={() =>
                History.push(`/hr/Profile/${record.EmployeeDetail.emp_id}`)
              }
            >
              <EyeOutlined />
            </button>
            <button
              onClick={() => {
                this.openEditModal(record || {});
              }}
              style={{
                paddingRight: "8px",
                paddingLeft: "8px",
                border: "1px solid #0FD145",
                borderRadius: "2px",
                color: "#0FD145",
              }}
            >
              <EditOutlined />
            </button>

            {record.actual_status === 0 && (
              <button
                onClick={() => {
                  emp_id = record.EmployeeDetail.emp_id;
                  this.openDuesModal(record || {});
                }}
                style={{
                  paddingRight: "8px",
                  paddingLeft: "8px",
                  border: "1px solid #0FD145",
                  borderRadius: "2px",
                  color: "#0FD145",
                }}
              >
                <FieldTimeOutlined />
              </button>
            )}
          </Space>
        ),
      },
    ];
    const {
      data,
      showModalUploadFile,
      modalContent,
      end_date,
      duesData,
      disableButton,
    } = this.state;
    return (
      <>
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
            total: total,
            current: this.state.current,
          }}
          onRow={this.onClickRow}
          onChange={this.handleChange}
        />
        <Modal
          onCancel={() => {
            this.setState({ showModalUploadFile: false });
          }}
          centered
          style={{ width: "938px" }}
          visible={showModalUploadFile}
          footer={[
            <Grid
              container
              style={{
                marginBottom: "52px",
                display: "flex",
                justifyContent: "flex-end",
                paddingLeft: "79px",
              }}
            ></Grid>,
          ]}
        >
          {modalContent === 0 && (
            <UpdateEmployee
              employeeNameUpload={enNameFromRecord}
              callBackFromUpdatedEmp={(context) => {
                context.setState({ selectedFile: null, buttonOpen: false });
              }}
              parentContext={this}
            />
          )}

          {modalContent === 1 && (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <label>اخر يوم عمل</label>
                  <DatePicker
                    onChange={(date) => {
                      this.setState({ end_date: date });
                    }}
                    placeholder=""
                    value={end_date}
                    style={{ width: "300px", height: "100%" }}
                  />
                </div>
                <Button
                  style={{
                    backgroundColor: "#93C020",
                    color: "#FFF",
                    boxShadow: "none",
                    borderRadius: "2px",
                    fontWeight: "600",
                    fontSize: "18px",
                    marginRight: "3px",
                    width: "150px",
                    textAlign: "center",
                    height: "60px",
                  }}
                  disabled={disableButton || !end_date}
                  onClick={this.getEmployeeDues}
                >
                  بحث
                </Button>
              </div>

              {Object.keys(duesData).length !== 0 && (
                <Grid container style={{ marginTop: "30px" }}>
                  <Grid item xs={4}>
                    <Typography variant="subtitle1" gutterBottom>
                      الايام المخصومة من المرتب
                    </Typography>
                  </Grid>

                  <Grid item xs={8}>
                    <Typography variant="subtitle2" gutterBottom>
                      {duesData.deductionOb &&
                      duesData.deductionOb.deducted_days_from_salary
                        ? duesData.deductionOb.deducted_days_from_salary
                        : 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="subtitle1" gutterBottom>
                      الايام المخصومة من الاجازات
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="subtitle2" gutterBottom>
                      {duesData.deductionOb &&
                      duesData.deductionOb.deducted_days_from_vacation
                        ? duesData.deductionOb.deducted_days_from_vacation
                        : 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="subtitle1" gutterBottom>
                      الباقي
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="subtitle2" gutterBottom>
                      {duesData && duesData.rest ? duesData.rest.toFixed(2) : 0}
                    </Typography>
                  </Grid>
                </Grid>
              )}
            </>
          )}
        </Modal>
      </>
    );
  }

  getEmployeeDues = async () => {
    const { end_date } = this.state;
    this.props.showLoading();
    this.setState({ disableButton: true });
    let { valid = false, msg = "لا يمكن الاتصال بالسيرفر", data } = await get(
      "deduction/get_dues_For_resigned_person",
      {
        emp_id,
        end_date: new Date(
          `${end_date.toISOString().split("T")[0]}T23:59:59.000Z`
        ),
      }
    );
    if (valid) {
      this.setState({ duesData: data });
      this.props.openAlert("success", msg);
    } else {
      this.setState({ duesData: {} });
      this.props.openAlert("error", msg);
    }
    this.setState({ disableButton: false });
    this.props.hideLoading();
  };
  getEmployees = async (pageNumber = 0, filters = {}) => {
    parent_filters = filters;
    this.props.showLoading();
    let {
      valid = false,
      msg = "لا يمكن الاتصال بالسيرفر",
      data,
      page,
      per_page,
      total,
    } = await get("employees/get", { page: pageNumber, ...filters });
    if (valid) {
      this.setState({ data: data, page, per_page, total });
      this.props.openAlert("success", msg);
    } else {
      this.setState({ data: [], page: 0, per_page: 0, total: 0 });
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
  openAlert,
  hideLoading,
})(TableEmp);
