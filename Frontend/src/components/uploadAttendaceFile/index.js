import { Button } from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { post } from "../../API";
import { openAlert } from "../actions/alert-action";
import { showLoading, hideLoading } from "../actions/loading-action";

class UploadAttendaceFile extends Component {
  constructor(props) {
    super(props);
    this.FileUploadRef = React.createRef();
  }
  state = {
    selectedFiles: null,
  };
  onFileChange = (event) => {
    this.setState({ selectedFiles: event.target.files });
  };
  onFileUpload = async () => {
    const { selectedFiles } = this.state;
    this.props.showLoading();
    const formData = new FormData();

    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append(`attendanceFiles`, selectedFiles[i]);
    }

    const { msg } = await post("att/update_attendance_from_file", formData);
    this.props.openAlert("success", msg);
    this.props.hideLoading();
    this.FileUploadRef.current.value = null;
    this.setState({ selectedFiles: null });
  };
  fileData = () => {
    if (this.state.selectedFiles) {
      return (
        <div>
          {this.state.selectedFiles.length + `:: عدد الملفات`}
          {/* <h2>File Details:</h2>
          <p>File Name: {this.state.selectedFiles.name}</p>
          <p>File Type: {this.state.selectedFiles.type}</p>
          <p>
            Last Modified:{" "}
            {this.state.selectedFiles.lastModifiedDate.toDateString()}
          </p> */}
        </div>
      );
    }
  };
  onButtonclick = () => {
    const { selectedFiles } = this.state;
    if (selectedFiles) this.onFileUpload();
    else this.FileUploadRef.current.click();
  };
  render() {
    const { selectedFiles } = this.state;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <input
          id="upload"
          type="file"
          ref={this.FileUploadRef}
          style={{
            display: "none",
          }}
          multiple
          onChange={this.onFileChange}
        />
        {/* {selectedFiles && <p>{selectedFiles.name}</p>} */}
        {this.fileData()}
        <Button
          onClick={this.onButtonclick}
          variant="contained"
          style={{
            backgroundColor: "#93C020",
            color: "#FFF",
            width: "156px",
            boxShadow: "none",
            borderRadius: "2px",
            fontWeight: "600",
            fontSize: "18px",
          }}
        >
          {selectedFiles ? " Upload Files" : "Select Files"}
        </Button>
      </div>
    );
  }
}

export default connect(null, { openAlert, showLoading, hideLoading })(
  UploadAttendaceFile
);
