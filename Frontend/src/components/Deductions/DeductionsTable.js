/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import Highlighter from "react-highlight-words";
import { Table, Input, Button, Space, Modal } from "antd";
import Grid from "@material-ui/core/Grid";
import { FilterOutlined, SearchOutlined, EyeOutlined } from "@ant-design/icons";
import "./attendance.css";
import { get, post } from "../../API";
import { connect } from "react-redux";
import { showLoading, hideLoading } from "../actions/loading-action";
import { openAlert } from "../actions/alert-action";
import translateKey from "../../utilities/TranslatedKeys";
import { Divider } from "@material-ui/core";

let current_page = 0;
let EmpPenality = {};
let ROW = "";
class DeductionsTable extends Component {
  state = {
    searchText: "",
    searchedColumn: "",
    selectedRowKeys: [],
    loading: false,
    modal3Visible: false,
    Requests_details: [],
    value: "",
  };

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  handleChange = (pagination, filters, sorter) => {
    current_page = pagination.current - 1;
    this.props.getDeductions(current_page);
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  };

  clearFilters = () => {
    this.setState({ filteredInfo: null });
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

  getLatnessHours = async ({ Employee: { id }, date }) => {
    let [year, month, day] = date.split(" ")[0].split("-");

    this.props.showLoading();
    let {
      valid = false,
      msg = "لا يمكن الاتصال بالسيرفر",
      data: { EmpPenalityCount = {}, latenesDetails = [] },
    } = await get("empPenalityCounts/get_details", {
      emp_id: id,
      date,
      monthlyClose: this.props.lookUps.monthlyCloseLookup[`${month}-${day}`],
    });
    if (valid) {
      EmpPenality = EmpPenalityCount;
      let details = [];
      console.log({
        latenesDetails,
      });
      latenesDetails.forEach((row) => {
        Object.keys(row).forEach((key) => {
          if (key === "date")
            details.push({ key: "يوم", value: row[key].split(" ")[0] });
          else if (key === "lateness_hours") {
            let [hours, minutes] = row[key].toString().split(".");
            if (hours && minutes)
              details.push({
                key: "ساعات التاخير",
                value: `${hours} ساعة      ${
                  parseFloat(`0.${minutes}`) * 60
                } دقيقة`,
              });
            else if (hours && !minutes)
              details.push({
                key: "ساعات التاخير",
                value: `${hours} ساعة`,
              });
          } else if (key === "forgot_face_print")
            details.push({
              key: "نسيان البصمة",
              value: row[key] ? "نعم" : "لا",
            });
          else if (key === "forgived")
            details.push({
              key: "forgived",
              value: row[key],
            });
        });
      });

      // lateness_hours  forgot_face_print  date

      // console.log(data);
      this.props.hideLoading();
      this.setState({
        Requests_details: details,
        modal3Visible: true,
      });
    } else {
      this.props.openAlert("error", msg);
      this.props.hideLoading();
    }
  };

  forgive_day_deduction = async (date) => {
    this.props.showLoading();
    let { valid = false, msg = "لا يمكن الاتصال بالسيرفر" } = await post(
      "deduction/forgive",
      {
        emp_id: ROW.Employee.id,
        date,
        monthlyClose: ROW.date,
      }
    );
    if (valid) {
      this.setState({ modal3Visible: false });
      this.props.hideLoading();
      this.props.getDeductions(0);
    } else {
      this.props.openAlert("error", msg);
      this.props.hideLoading();
    }
  };

  render() {
    const { data, total } = this.props.data;
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    // {
    //   "deducted_days_from_salary": 0.75,
    //   "date": "2020-11-11 00:00:00",
    //   "Employee": {
    //     "ar_name": "محمد خالد أبو الفتوح محمد",
    //     "id": 11,
    //     "Branch": { "name": "HQ" }
    //   }
    // }

    const columns = [
      {
        title: "اسم الموظف",
        dataIndex: "ar_name",
        key: "ar_name",
        // ...this.getColumnSearchProps("ar_name"),
        // specify the condition of filtering result
        // here is that finding the name started with `value`
        // defaultSortOrder: "descend",
        // sorter: (a, b) => a.ar_name - b.ar_name,
        render: (text, row) => <p> {row.Employee.ar_name} </p>,
      },
      {
        title: "الوظيفة",
        dataIndex: "",
        key: "",
        // ...this.getColumnSearchProps(""),
        // defaultSortOrder: "descend",
        // sorter: (a, b) => a.ar_name.length - b.ar_name.length,
        render: (text, row) => <p> {row.Employee.Position.en_name} </p>,
      },
      {
        title: "الفرع",
        dataIndex: "createdAt",
        key: "createdAt",
        // ...this.getColumnSearchProps("createdAt"),
        // defaultSortOrder: "descend",
        // sorter: (a, b) => a.createdAt - b.createdAt,
        render: (text, row) => <p> {row.Employee.Branch.name} </p>,
      },
      {
        title: "السبب",
        dataIndex: "reason",
        key: "reason",
        // ...this.getColumnSearchProps("reason"),
        // defaultSortOrder: "descend",
        // sorter: (a, b) => a.reason - b.reason,
      },

      {
        title: "ايام الخصم من المرتب",
        dataIndex: "deducted_days_from_salary",
        key: "deducted_days_from_salary",
      },
      {
        title: "تقفيلة شهر",
        dataIndex: "date",
        key: "date", //TODO:
        render: (text, row) => {
          // eslint-disable-next-line no-unused-vars
          let [year, month, day] = row.date.split(" ")[0].split("-");
          return (
            <p> {this.props.lookUps.monthlyCloseLookup[`${month}-${day}`]} </p>
          );
        },
      },
      {
        title: "",
        key: "action",
        render: (text, record) => {
          if (record.reason === "lateness")
            return (
              <Space>
                <button
                  onClick={() => {
                    ROW = record;
                    this.getLatnessHours(record);
                  }}
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
              </Space>
            );
        },
      },
    ];
    return (
      <>
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
              <>
                {key !== "forgived" && (
                  <Grid key={index} container style={{ marginTop: "40px" }}>
                    <Grid sm={4} style={{ textAlign: "center" }}>
                      <label>{translateKey(key)}</label>
                    </Grid>
                    <Grid item sm={8}>
                      {value}
                    </Grid>
                  </Grid>
                )}
                {translateKey(key) === "نسيان البصمة" && (
                  <div
                    style={{
                      marginTop: 20,
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <Button
                      key="submit"
                      style={{
                        backgroundColor: "#93C020",
                        borderColor: "#93C020",
                      }}
                      type="primary"
                      onClick={() => {
                        this.forgive_day_deduction(
                          this.state.Requests_details[index - 2].value
                        );
                      }}
                      disabled={
                        this.state.Requests_details[index + 1].value ||
                        ROW.closed
                      }
                    >
                      {ROW.closed ? "لن يتم السماح بالتجاوز" : "تجاوز"}
                    </Button>
                    <Divider variant="middle" />
                  </div>
                )}
              </>
            );
          })}
          {/* <div style={{ marginTop: 20 }}>
            <Divider variant="middle" />
          </div> */}

          <Grid container style={{ marginTop: "40px" }}>
            <Grid sm={4} style={{ textAlign: "center" }}>
              <label>عدد مرات نسيان البصمة</label>
            </Grid>
            <Grid item sm={2}>
              {EmpPenality.forgot_face_print_count}
            </Grid>
            <Grid item sm={3}>
              <label>عدد ساعات التاخير</label>
            </Grid>
            <Grid item sm={2} lg={3}>
              {(() => {
                if (EmpPenality.lateness_hours_count) {
                  let [
                    hours,
                    minutes,
                  ] = EmpPenality.lateness_hours_count.toString().split(".");
                  if (hours && minutes)
                    return `${hours} ساعة      ${
                      parseFloat(`0.${minutes}`) * 60
                    } دقيقة`;
                  else if (hours && !minutes) return `${hours} ساعة`;
                }
              })()}
            </Grid>
          </Grid>
        </Modal>
        <div style={{ marginBottom: 16, textAlign: "left" }}></div>
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
          }}
          onChange={this.handleChange}
        />
      </>
    );
  }
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
})(DeductionsTable);
