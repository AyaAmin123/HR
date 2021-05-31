import { Button } from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { post } from "../../API";
import { openAlert } from "../actions/alert-action";
import { showLoading, hideLoading } from "../actions/loading-action";

class UpdateEmployee extends Component {
  state = {
    selectedFile: null,
    buttonOpen: false,
  };
  LevenshteinDistance = (a, b) => {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    var matrix = [];

    // increment along the first column of each row
    var i;
    for (i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    // increment each column in the first row
    var j;
    for (j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (i = 1; i <= b.length; i++) {
      for (j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            Math.min(
              matrix[i][j - 1] + 1, // insertion
              matrix[i - 1][j] + 1
            )
          ); // deletion
        }
      }
    }

    return matrix[b.length][a.length];
  };

  onFileChange = (event) => {
    this.setState({ selectedFile: event.target.files[0] }, () => {
      if (this.state.selectedFile) {
        let uploadedFileName = this.state.selectedFile.name
          .split("-")[0]
          .trim();

        let uploadedFileNameWordCount = uploadedFileName.split(" ").length;
        let employeeNameUploadWords = this.props.employeeNameUpload.split(" ");
        let updatedEmpNameUpload = "";
        for (let i = 0; i < uploadedFileNameWordCount; i++) {
          updatedEmpNameUpload =
            updatedEmpNameUpload + employeeNameUploadWords[i] + " ";
        }
        let distance = this.LevenshteinDistance(
          updatedEmpNameUpload.toLowerCase(),
          uploadedFileName.toLowerCase()
        );
        if (distance >= 1 && distance <= 6) {
          this.setState({ buttonOpen: true });
        } else {
          this.props.openAlert("error", "هذا الملف لا يخص هذا الشخص");
          this.setState({ buttonOpen: false });
        }
      }
    });
  };

  onFileUpload = async () => {
    this.props.parentContext.setState({ showModalUploadFile: false });
    this.props.showLoading();
    const formData = new FormData();
    formData.append(
      "file",
      this.state.selectedFile,
      this.state.selectedFile.name
    );

    const { msg } = await post(
      "employees/update_employee_using_Excel",
      formData
    );
    this.props.openAlert("success", msg);
    this.props.hideLoading();
    this.setState({ selectedFile: null });
  };
  fileData = () => {
    if (this.state.selectedFile) {
      return (
        <div>
          <h2>File Details:</h2>
          <p>File Name: {this.state.selectedFile.name}</p>
          <p>File Type: {this.state.selectedFile.type}</p>
          <p>
            Last Modified:{" "}
            {this.state.selectedFile.lastModifiedDate.toDateString()}
          </p>
        </div>
      );
    }
  };

  componentWillReceiveProps = () => {
    this.props.callBackFromUpdatedEmp(this);
  };

  render() {
    const { selectedFile, buttonOpen } = this.state;

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
          style={{
            color: "white",
            marginRight: "185px",
            // border: "1px solid lightgrey",
            marginBottom: "10px",
          }}
          onChange={this.onFileChange}
        />
        {/* {selectedFile && <p>{selectedFile.name}</p>} */}
        {this.fileData()}
        <Button
          disabled={!selectedFile || !buttonOpen}
          onClick={this.onFileUpload}
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
          upload File
        </Button>
      </div>
    );
  }
}

export default connect(null, { openAlert, showLoading, hideLoading })(
  UpdateEmployee
);
