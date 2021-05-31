/* eslint-disable no-unused-vars */
import React, { useState } from "react";
// import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
// import TextField from "@material-ui/core/TextField";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import Checkbox from "@material-ui/core/Checkbox";
// import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
// import Box from "@material-ui/core/Box";
// import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
// import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
// import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
// import DateRangeIcon from "@material-ui/icons/DateRange";
// import MenuItem from "@material-ui/core/MenuItem";
import { Select, Input, Table, Space, Upload, message, Switch } from "antd";
import { DatePicker } from "antd";
import { showLoading, hideLoading } from "../actions/loading-action";
import { openAlert } from "../actions/alert-action";
import moment from "moment";
import "./Vacation.css";
import { get, post } from "../../API";
import { useDispatch, useSelector } from "react-redux";
import { TextField } from "@material-ui/core";
import Modal from "antd/lib/modal/Modal";
import { UploadOutlined } from "@ant-design/icons";

const useStyles = makeStyles((theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
  },
  submit: {
    backgroundColor: "#93C020",
    color: "#FFF",
    width: "156px",
    boxShadow: "none",
    marginRight: "2.7rem",
    borderRadius: "2px",
    fontWeight: "600",
    marginTop: "22px",
    float: "left",
  },
  paper: {
    padding: 20,
    textAlign: "center",
    color: theme.palette.text.secondary,
    marginRight: 196,
    marginLeft: 35,
    marginTop: 22,
    direction: "rtl",
    border: "0.5px solid #eaeaea",
    boxShadow: "none",
    borderRadius: "2px",
  },
  tableStyle: {
    paddingLeft: 32,
    paddingRight: 32,
    paddingTop: "30px",
  },
  pickerStyle: {
    width: "100%",
    "&:hover": {
      backgroundColor: "#f5f4e8",
    },
  },
}));

function addTwoHours(currentDate) {
  let [date, hours] = currentDate.split(".")[0].split("T");
  let [hoursFrom, minutesFrom, secondsFrom] = hours.toString().split(":");

  hoursFrom = (parseInt(hoursFrom) + 2).toString();
  if (hoursFrom.length === 1) hoursFrom = "0" + hoursFrom;
  hours = hoursFrom + ":" + minutesFrom + ":" + secondsFrom;

  return `${date}  ${hours}`;
}

var emp_id = 0;
const Vacation = () => {
  const classes = useStyles();
  const dispatch = useDispatch(null);
  const {
    mainData: { processes, processesRequirements, vacation_types },
    userData: { user_role_id },
  } = useSelector((store) => store);

  const [process_id, set_process_id] = useState("1");
  const [reason, set_reason] = useState("");
  const [from, set_from] = useState(null);
  const [to, set_to] = useState(null);
  const [timeFrom, set_timeFrom] = useState(null);
  const [timeTo, set_timeTo] = useState(null);
  const [vacation_selection, set_vacation_selection] = useState("1");

  const [ar_name, set_ar_name] = useState(null);

  const [rest_allowance_data, set_rest_allowance_data] = useState(null);
  const [isNewRequest, set_isNewRequest] = useState(true);
  const [openModal, set_openModal] = useState(false);
  const [selectedFile, set_selectedFile] = useState(null);
  const { TextArea } = Input;

  const { Option } = Select;
  const createVacationRequest = async () => {
    dispatch(showLoading());
    let requests_details = {};
    Object.keys(processesRequirements[process_id]).forEach((key) => {
      if (key === "date" && processesRequirements[process_id][key].required) {
        requests_details.from = `${from.toISOString().split("T")[0]} 00:00:00`;
        requests_details.to = `${to.toISOString().split("T")[0]} 23:59:59`;
      }
      if (key === "time" && processesRequirements[process_id][key].required) {
        let [firstFrom] = requests_details.from.split(" ");
        let [firstTo] = requests_details.to.split(" ");

        let [
          hoursFrom,
          minutesFrom,
          secondsFrom,
        ] = timeFrom.toISOString().split(".")[0].split("T")[1].split(":");

        let [hoursTo, minutesTo, secondsTo] = timeTo
          .toISOString()
          .split(".")[0]
          .split("T")[1]
          .split(":");

        let tempTimeFrom = `${
          parseInt(hoursFrom) + 2
        }:${minutesFrom}:${secondsFrom}`;
        ////////////////////////////////////////
        let tempTimeTo = `${parseInt(hoursTo) + 2}:${minutesTo}:${secondsTo}`;

        if (tempTimeFrom.length !== 8) tempTimeFrom = "0" + tempTimeFrom;

        if (tempTimeTo.length !== 8) tempTimeTo = "0" + tempTimeTo;

        requests_details.from = `${firstFrom} ${tempTimeFrom}`;
        requests_details.to = `${firstTo} ${tempTimeTo}`;
      }

      if (key === "reason" && processesRequirements[process_id][key].required)
        requests_details.reason = reason;

      if (
        key === "currentTime" &&
        processesRequirements[process_id][key].required
      ) {
        requests_details.currentTime = addTwoHours(new Date().toISOString());

        console.log(requests_details.currentTime);

        // new Date(`${new Date().toISOString().split("T")[0]} 09:00:00`)
      }
    });

    let { valid = false, msg = "لا يمكن الاتصال بالسيرفر" } = await post(
      "requests/create_request",
      {
        process_id: parseInt(process_id),
        requests_details,
        ...(emp_id ? { emp_id } : {}),
        isNewRequest,
      }
    );
    if (valid) {
      dispatch(openAlert("success", msg));
      attach_file && (await onFileUpload(emp_id));
    } else {
      dispatch(openAlert("error", msg));
    }
    set_ar_name("");
    set_from(null);
    set_to(null);
    set_process_id("1");
    set_reason("");
    set_vacation_selection("1");
    emp_id = 0;
    dispatch(hideLoading());
  };
  const getEmployee = async () => {
    dispatch(showLoading());
    let {
      valid = false,
      msg = "لا يمكن الاتصال بالسيرفر",
      data,
    } = await get("employees/getByName", { ar_name });
    if (valid) {
      set_ar_name(data.ar_name);
      emp_id = data.id;
      dispatch(openAlert("success", msg));
    } else {
      dispatch(openAlert("error", msg));
    }
    dispatch(hideLoading());
  };

  const getRestAllowances = async () => {
    dispatch(showLoading());
    let {
      valid = false,
      msg = "لا يمكن الاتصال بالسيرفر",
      restAllowances,
    } = await get("restAllowances/get_all", {});
    if (valid) {
      set_rest_allowance_data(restAllowances);
      dispatch(openAlert("success", msg));
    } else {
      dispatch(openAlert("error", msg));
    }
    dispatch(hideLoading());
  };

  const disableButtonForNewRequest = () => {
    const {
      date: {
        required: dateFlag,
        disabled: disableddate = false,
        fromToday = false,
      } = {
        required: true,
        disabled: false,
        fromToday: false,
      },
      time: { required: timeFlag, disabled: disabledtime = false } = {
        required: true,
        disabled: false,
      },
      reason: { required: reasonFlag, disabled: disabledreason = false } = {
        required: true,
        disabled: false,
      },
      attach_file = false,
    } = processesRequirements[process_id] || {};

    console.log(processesRequirements[process_id]);

    return (!disabledreason && reasonFlag && reason.trim().length === 0) ||
      (!disabledreason && reasonFlag && reason.trim().length < 3) ||
      (!disabledreason && reasonFlag && reason.trim().length > 50) ||
      (dateFlag &&
        !disableddate &&
        (from === null ||
          to === null ||
          convertDataToCompare(to) - convertDataToCompare(from) < 0 ||
          (from && fromToday
            ? convertDataToCompare(from) - convertDataToCompare(new Date()) < 0
            : convertDataToCompare(from) - convertDataToCompare(new Date()) <=
              0) ||
          (to && fromToday
            ? convertDataToCompare(to) - convertDataToCompare(new Date()) < 0
            : convertDataToCompare(to) - convertDataToCompare(new Date()) <=
              0) ||
          convertDataToCompare(from) - convertDataToCompare(to) > 0)) ||
      (timeFlag &&
        !disabledtime &&
        (timeFrom === null ||
          timeTo === null ||
          timeTo < timeFrom ||
          timeFrom > timeTo)) ||
      (user_role_id === 2 && emp_id === 0) ||
      (attach_file && selectedFile === null)
      ? true
      : false;
  };
  const convertDataToCompare = (date) => {
    if (date) {
      let tempDate = date.toISOString().split("T")[0];

      return new Date(new Date(`${tempDate} 00:00:00`) + "UTC");
    }
    return "";
  };
  const disableButtonForOldRequest = () => {
    const {
      date: { required: dateFlag, disabled: disableddate = false } = {
        required: true,
        disabled: false,
      },
      time: { required: timeFlag, disabled: disabledtime = false } = {
        required: true,
        disabled: false,
      },
      reason: { required: reasonFlag, disabled: disabledreason = false } = {
        required: true,
        disabled: false,
      },
      attach_file = false,
    } = processesRequirements[process_id] || {};

    return (!disabledreason && reasonFlag && reason.trim().length === 0) ||
      (!disabledreason && reasonFlag && reason.trim().length < 3) ||
      (!disabledreason && reasonFlag && reason.trim().length > 50) ||
      (dateFlag &&
        !disableddate &&
        (from === null ||
          to === null ||
          convertDataToCompare(to) - convertDataToCompare(from) < 0 ||
          (from &&
            convertDataToCompare(from) - convertDataToCompare(new Date()) >=
              0) ||
          (convertDataToCompare(to) &&
            convertDataToCompare(to) - convertDataToCompare(new Date()) >= 0) ||
          convertDataToCompare(from) - convertDataToCompare(to) > 0)) ||
      (dateFlag &&
        disableddate &&
        (from === null ||
          to === null ||
          convertDataToCompare(to) - convertDataToCompare(from) < 0 ||
          convertDataToCompare(from) - convertDataToCompare(to) > 0 ||
          convertDataToCompare(from) - convertDataToCompare(new Date()) > 0 ||
          convertDataToCompare(to) - convertDataToCompare(new Date()) >= 0 ||
          convertDataToCompare(to) - convertDataToCompare(from) !== 0)) ||
      (timeFlag &&
        !disabledtime &&
        (timeFrom === null ||
          timeTo === null ||
          timeTo < timeFrom ||
          timeFrom > timeTo)) ||
      (user_role_id === 2 && emp_id === 0) ||
      (attach_file && selectedFile === null)
      ? true
      : false;
  };
  const onFileUpload = async (emp_id) => {
    const formData = new FormData();
    formData.append("file", selectedFile, selectedFile.name);
    formData.append("emp_id", emp_id);

    const { msg } = await post("requests/attachPhoto", formData);
    dispatch(openAlert("success", msg));
    set_selectedFile(null);
  };
  const fileData = () => {
    if (selectedFile) {
      return (
        <div>
          <h2>File Details:</h2>
          <p>File Name: {selectedFile.name}</p>
          <p>File Type: {selectedFile.type}</p>
          <p>Last Modified: {selectedFile.lastModifiedDate.toDateString()}</p>
        </div>
      );
    }
  };

  const columns = [
    {
      title: "يوم تسجيل بدل الراحة",
      dataIndex: "rest_allowance_date",
      key: "rest_allowance_date",
      render: (text, row) => <p> {row.rest_allowance_date} </p>,
    },
    {
      title: "عدد الساعات",
      dataIndex: "number_of_hours",
      key: "number_of_hours",
      render: (text, row) => <p> {row.number_of_hours} </p>,
    },
    {
      title: "صالحة الي",
      dataIndex: "valid_to",
      key: "valid_to",
    },
    {
      title: "تم استهلاكها",
      dataIndex: "taked",
      key: "taked",
      render: (text, row) => <p> {row.taked === 1 ? "لا" : "نعم"} </p>,
    },

    {
      title: "",
      key: "action",
      render: (text, record) => (
        <Space>
          {!record.taked && (
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className={classes.submit}
              onClick={() => {
                set_openModal(true);
              }}
            >
              إرسال
            </Button>
          )}
        </Space>
      ),
    },
  ];

  let {
    date: { required: daterequired = true, disabled: datedisabled = false } = {
      required: true,
      disabled: false,
    },
    time: { required: timerequired = true, disabled: timedisabled = false } = {
      required: true,
      disabled: false,
    },
    reason: {
      required: reasonrequired = true,
      disabled: reasondisabled = false,
      field_name = "",
    } = {
      required: true,
      disabled: false,
    },
    table: { required: tablerequired, disabled: tabledisabled } = {
      required: false,
      disabled: false,
    },
    attach_file = false,
  } = processesRequirements[process_id] || {};

  const setDefaultDateToContingency = (value) => {
    let {
      date: { disabled: ddate } = { disabled: false },
    } = processesRequirements[value];

    let today = new Date(); //new Date().toISOString();
    let dateFormat = "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]";
    if (ddate) {
      set_from(moment(today, dateFormat));
      set_to(moment(today, dateFormat));
    }
  };
  return (
    <Grid item xs={12}>
      <Paper className={classes.paper}>
        <CssBaseline />
        <Grid container spacing={2}>
          <Grid container style={{ marginBottom: "13px" }}>
            <Grid
              item
              lg={1}
              xs={12}
              className="textLabel"
              style={{
                marginTop: "10px",
              }}
            >
              <label>نوع الاجازة</label>
            </Grid>
            <Grid item xs={12} lg={11}>
              <Select
                size="default"
                placeholder="اختر نوع الاجازة"
                style={{ width: "100%", marginLeft: "20px" }}
                value={vacation_selection}
                onChange={(e) => {
                  set_vacation_selection(e);
                  if (vacation_types[e].data && vacation_types[e].data.length)
                    set_process_id(vacation_types[e].data[0].toString());
                  else set_process_id("");
                }}
              >
                {Object.keys(vacation_types).map((key) => {
                  return (
                    <Option key={key.toString()}>
                      {vacation_types[key].name}
                    </Option>
                  );
                })}
              </Select>
            </Grid>
          </Grid>

          {vacation_selection && (
            <Grid container style={{ marginBottom: "13px" }}>
              <Grid
                item
                lg={1}
                xs={12}
                className="textLabel"
                style={{
                  marginTop: "10px",
                }}
              >
                <label>الطلبات</label>
              </Grid>
              <Grid item xs={12} lg={11}>
                <Select
                  size="default"
                  placeholder="اختر نوع الطلب"
                  style={{ width: "100%", marginLeft: "20px" }}
                  value={process_id}
                  onChange={(e) => {
                    if (e.toString() === "17") getRestAllowances();
                    set_process_id(e.toString());
                    setDefaultDateToContingency(e.toString());
                  }}
                >
                  {vacation_types[vacation_selection].data.map((key) => {
                    return (
                      <Option key={key.toString()}>{processes[key]}</Option>
                    );
                  })}
                </Select>
              </Grid>
            </Grid>
          )}
          {user_role_id === 2 && (
            <Grid container style={{ marginBottom: "13px" }}>
              <Grid
                item
                lg={1}
                xs={12}
                className="textLabel"
                style={{
                  marginTop: "10px",
                }}
              >
                <label>اسم الموظف </label>
              </Grid>
              <Grid item xs={12} lg={11}>
                <TextField
                  variant="outlined"
                  required
                  InputProps={{
                    style: { height: "40px", fontSize: "15px" },
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
                  value={ar_name}
                  onBlur={() => {
                    if (ar_name) getEmployee();
                  }}
                  onChange={({ target: { value } }) => {
                    emp_id = 0;
                    set_ar_name(value);
                  }}
                />
              </Grid>
            </Grid>
          )}

          {daterequired && (
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
                  disabled={isNewRequest && datedisabled}
                  value={from}
                  onChange={(date, dateString) => {
                    set_from(date);
                  }}
                  placeholder=""
                  style={{ width: "100%", height: "100%" }}
                />
              </Grid>

              <Grid
                item
                lg={1}
                xs={12}
                className="textLabel"
                style={{ fontSize: "16px", marginTop: "10px" }}
              >
                <label>التاريخ الى</label>
              </Grid>
              <Grid item lg={5} xs={12} className="dateFilter">
                <DatePicker
                  disabled={isNewRequest && datedisabled}
                  value={to}
                  onChange={(date, dateString) => set_to(date)}
                  placeholder=""
                  style={{ width: "100%", height: "100%" }}
                />
              </Grid>
            </Grid>
          )}

          {timerequired && (
            <Grid container style={{ marginBottom: "13px" }}>
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
                  value={timeFrom}
                  onChange={(date, dateString) => set_timeFrom(date)}
                />
              </Grid>

              <Grid
                item
                lg={1}
                xs={12}
                className="textLabel"
                style={{ fontSize: "16px", marginTop: "10px" }}
              >
                <label>الوقت الى</label>
              </Grid>
              <Grid item lg={5} xs={12} className="dateFilter">
                <DatePicker
                  placeholder=""
                  picker={"time"}
                  style={{ width: "100%", height: "100%" }}
                  value={timeTo}
                  onChange={(date, dateString) => set_timeTo(date)}
                />
              </Grid>
            </Grid>
          )}

          <Grid container>
            {reasonrequired && (
              <>
                <Grid
                  item
                  className="textLabel"
                  lg={1}
                  xs={12}
                  style={{
                    marginTop: "10px",
                  }}
                >
                  <label>{field_name}</label>
                </Grid>
                <Grid item xs={12} lg={11}>
                  <TextArea
                    value={reason}
                    onChange={({ target: { value } }) => {
                      set_reason(value);
                    }}
                    rows={4}
                    placeholder="يجب ان لا يقل عن 3 احرف ولا يزيد عن 50 حرف"
                  />
                </Grid>
              </>
            )}
            {attach_file && (
              <Grid container style={{ marginTop: "13px" }}>
                <Grid item lg={1}>
                  <label>رفع الملف</label>
                </Grid>
                <Grid item lg={3}>
                  <input
                    id="upload"
                    type="file"
                    style={{
                      color: "white",
                      marginRight: "185px",
                      marginBottom: "10px",
                    }}
                    onChange={(event) =>
                      set_selectedFile(event.target.files[0])
                    }
                  />
                </Grid>
              </Grid>
            )}
            {user_role_id === 2 && (
              <Grid container style={{ marginTop: "13px" }}>
                <Grid item lg={1}>
                  <label>فترة تقديم الطلب </label>
                </Grid>
                <Grid item lg={3}>
                  <Switch
                    checked={isNewRequest}
                    onChange={(status) => {
                      status &&
                        setDefaultDateToContingency(process_id.toString());
                      set_isNewRequest(status);
                    }}
                    checkedChildren="جديد"
                    unCheckedChildren="قديم"
                  />
                </Grid>
              </Grid>
            )}

            <Grid item lg={12}>
              <div
                style={{
                  border: "0.3px solid rgb(234 234 234)",
                  marginTop: "104px",
                }}
              ></div>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Button
                disabled={
                  isNewRequest
                    ? disableButtonForNewRequest()
                    : disableButtonForOldRequest()
                }
                type="submit"
                fullWidth
                variant="contained"
                className={classes.submit}
                onClick={createVacationRequest}
              >
                {isNewRequest ? "ارسال" : "ارسال و موافقة"}
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Modal
          centered
          visible={openModal}
          onOk={() => set_openModal(false)}
          onCancel={() => set_openModal(false)}
          footer={[
            <Button key="back" onClick={() => set_openModal(false)}>
              إلغاء
            </Button>,
            <Button
              key="submit"
              style={{ backgroundColor: "#93C020", borderColor: "#93C020" }}
              type="primary"
              onClick={() => set_openModal(false)}
            >
              تم
            </Button>,
          ]}
        ></Modal>
      </Paper>
    </Grid>
  );
};
export default Vacation;
