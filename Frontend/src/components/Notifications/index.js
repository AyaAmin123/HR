import React, { useEffect, useState } from "react";
// import { List, Avatar, Space } from "antd";
import { Button, List } from "antd";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
// import { MessageOutlined, LikeOutlined, StarOutlined } from "@ant-design/icons";
import Typography from "@material-ui/core/Typography";
import "./notifications.css";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../actions/loading-action";
import { get } from "../../API";
import { openAlert } from "../actions/alert-action";
// const IconText = ({ icon, text }) => (
//   <Space>
//     {React.createElement(icon)}
//     {text}
//   </Space>
// );
var total_pages = 0;
export default function Notifications() {
  const [data, set_data] = useState([]);
  const [page, set_page] = useState(0);

  const dispatch = useDispatch();
  const { emp_id } = useSelector((store) => store.userData);
  async function getNotifications(PAGE) {
    dispatch(showLoading());
    let {
      valid = false,
      msg = "لا يمكن الاتصال بالسيرفر",
      data,
      total,
    } = await get("logger/get", { emp_id, page: PAGE });
    if (valid) {
      total_pages = Math.ceil(total / 10) - 1;

      set_data(data);
      dispatch(openAlert("success", msg));
    } else {
      dispatch(openAlert("error", msg));
    }
    dispatch(hideLoading());
  }

  const loadMore = (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        textAlign: "center",
        marginTop: 12,
        height: 32,
        lineHeight: "32px",
      }}
    >
      <Button
        disabled={page === 0}
        onClick={() => {
          set_page(page - 1);
          getNotifications(page - 1);
        }}
      >
        السابق
      </Button>
      <Button
        disabled={total_pages === page}
        onClick={() => {
          set_page(page + 1);
          getNotifications(page + 1);
        }}
      >
        التالى
      </Button>
    </div>
  );
  useEffect(() => {
    getNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <List
        className="historyList"
        itemLayout="vertical"
        size="large"
        loadMore={loadMore}
        pagination={{
          style: { float: "right" },
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 10,
        }}
        dataSource={data}
        renderItem={({ createdAt, action_taken }, index) => (
          <List.Item
            key={index}
            extra={
              <Typography variant="subtitle1" gutterBottom>
                {`${createdAt.split(" ")[1]} ${createdAt.split(" ")[0]}`}
              </Typography>
            }
          >
            <List.Item.Meta
              avatar={
                <AccountCircleOutlinedIcon fontSize="large" color="#817E7E" />
              }
              title={<p style={{ marginTop: "10px" }}>{action_taken}</p>}
            />
          </List.Item>
        )}
      />
    </div>
  );
}
