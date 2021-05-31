// /* eslint-disable no-unused-vars */
// import React, { Component } from "react";
// import { Table } from "antd";
// import "./attendance.css";
// import { get } from "../../API";
// import { connect } from "react-redux";
// import { showLoading, hideLoading } from "../actions/loading-action";
// import { openAlert } from "../actions/alert-action";

// class JobStatus extends Component {
//   state = {
//     jobStatusData: [],
//   };

//   handleChange = (pagination, filters, sorter) => {
//     this.setState({
//       filteredInfo: filters,
//       sortedInfo: sorter,
//     });
//   };
//   componentDidMount = () => {
//     this.get_job_status_data();
//   };

//   get_job_status_data = async () => {
//     this.props.showLoading();
//     let { valid = false, msg = "لا يمكن الاتصال بالسيرفر", data } = await get(
//       "jobStatus/get_all",
//       {}
//     );
//     if (valid) {
//       this.props.hideLoading();
//       this.setState({ jobStatusData: data });
//     } else {
//       this.props.openAlert("error", msg);
//       this.props.hideLoading();
//     }
//   };

//   render() {
//     const { jobStatusData } = this.state;

//     const columns = [
//       {
//         title: "اسم العملية",
//         dataIndex: "name",
//         key: "name",
//       },
//       {
//         title: "الحالة",
//         dataIndex: "status",
//         key: "status",
//       },
//     ];
//     return (
//       <div style={{ padding: "0px 200px 0px 30px" }}>
//         <Table
//           columns={columns}
//           rowClassName={(record, index) =>
//             index % 2 === 0 ? "table-row-light" : "table-row-dark"
//           }
//           style={{
//             border: "0.5px solid #dcdcdc",
//             borderRadius: "2px",
//             marginBottom: "2rem",
//             marginTop: "2rem",
//           }}
//           dataSource={jobStatusData}
//           onChange={this.handleChange}
//         />
//       </div>
//     );
//   }
// }
// export default connect(null, {
//   showLoading,
//   hideLoading,
//   openAlert,
// })(JobStatus);

import React, { useEffect, useState } from "react";
// import { List, Avatar, Space } from "antd";
import { List } from "antd";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import Typography from "@material-ui/core/Typography";
import "./attendance.css";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../actions/loading-action";
import { get } from "../../API";
import { openAlert } from "../actions/alert-action";

export default function Notifications() {
  const [jobStatus, set_jobStatus] = useState([]);

  const dispatch = useDispatch();

  const get_job_status_data = async () => {
    dispatch(showLoading());
    let { valid = false, msg = "لا يمكن الاتصال بالسيرفر", data } = await get(
      "jobStatus/get_all",
      {}
    );
    if (valid) {
      set_jobStatus(data.reverse());
    } else {
      dispatch(openAlert("error", msg));
    }
    dispatch(hideLoading());
  };
  useEffect(() => {
    get_job_status_data();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <List
        className="historyList"
        itemLayout="vertical"
        size="large"
        pagination={{
          style: { float: "right" },
          pageSize: 5,
        }}
        dataSource={jobStatus}
        renderItem={({ name, status, createdAt }, index) => (
          <List.Item
            key={index}
            extra={
              <Typography variant="subtitle1" gutterBottom>
                {`${status}`}
              </Typography>
            }
          >
            <List.Item.Meta
              avatar={
                <AccountCircleOutlinedIcon fontSize="large" color="#817E7E" />
              }
              title={
                <p style={{ marginTop: "10px" }}>{`${
                  createdAt.toString().split(" ")[0]
                } - ${name} 
                `}</p>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
}
