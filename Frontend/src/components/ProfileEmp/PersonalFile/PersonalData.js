import React from "react";
import { Collapse } from "antd";
import Grid from "@material-ui/core/Grid";
// import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { UserOutlined } from "@ant-design/icons";
// import SubdirectoryArrowRightRoundedIcon from "@material-ui/icons/SubdirectoryArrowRightRounded";
// import Paper from "@material-ui/core/Paper";
import { Avatar } from "antd";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    textAlign: "center",
  },
  gridData: {
    marginBottom: 20,
  },
}));

export default function PersonalData({ data }) {
  let family = {
      "Child / Children Birthdate/s": "",
      "Child / Children Name/s": "",
      "Child / Children National ID No./s": "",
      "No. of Children": 0,
      "Wife / Wives Name/s": "",
      "Wife / Wives National ID No./s": "",
    },
    // eslint-disable-next-line no-unused-vars
    educational_qualification = {
      Degree: "Good",
      "Educational Institute": "",
      From: "",
      Major: "",
      To: "",
    };

  if (data.EmployeeDetail) {
    if (data.EmployeeDetail.family)
      family = JSON.parse(data.EmployeeDetail.family);
    if (data.EmployeeDetail.educational_qualification)
      educational_qualification = JSON.parse(
        data.EmployeeDetail.educational_qualification
      );
  }
  const classes = useStyles();
  const { Panel } = Collapse;
  //   const text = `
  //   A dog is a type of domesticated animal.
  //   Known for its loyalty and faithfulness,
  //   it can be found as a welcome guest in many households across the world.
  // `;

  return (
    <div>
      <Collapse accordion>
        <Panel header="البيانات الشخصية" key="1">
          <Grid container direction="row" justify="center" alignItems="center">
            <Grid item xs={12}>
              <Avatar size={84} icon={<UserOutlined />} />
            </Grid>
          </Grid>
          <Grid
            className={classes.gridData}
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
          >
            <Grid item xs={2}>
              <Typography variant="subtitle1" gutterBottom>
                كود البصمة
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <Typography variant="subtitle2" gutterBottom>
                {data && data.finger_print_id}
              </Typography>
            </Grid>

            <Grid item xs={2}>
              <Typography variant="subtitle1" gutterBottom>
                الاسم
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <Typography variant="subtitle2" gutterBottom>
                {data.ar_name || data.en_name}
              </Typography>
            </Grid>

            <Grid item xs={2}>
              <Typography variant="subtitle1" gutterBottom>
                الوظيفه
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <Typography variant="subtitle2" gutterBottom>
                {data.Position && data.Position.ar_name}
              </Typography>
            </Grid>

            <Grid item xs={2}>
              <Typography variant="subtitle1" gutterBottom>
                التدرج الوظيفي
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <Typography variant="subtitle2" gutterBottom>
                {data.EmployeeDetail && data.EmployeeDetail.position_history_ar}
              </Typography>
            </Grid>

            <Grid item xs={2}>
              <Typography variant="subtitle1" gutterBottom>
                تاريخ التعيين
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <Typography variant="subtitle2" gutterBottom>
                {data && data.join_date && data.join_date.split(" ")[0]}
              </Typography>
            </Grid>

            <Grid item xs={2}>
              <Typography variant="subtitle1" gutterBottom>
                تاريخ انتهاء فترة الاختبار
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <Typography variant="subtitle2" gutterBottom>
                {data.EmployeeDetail && data.EmployeeDetail.probation_date}
              </Typography>
            </Grid>

            <Grid item xs={2}>
              <Typography variant="subtitle1" gutterBottom>
                نوع العقد
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <Typography variant="subtitle2" gutterBottom>
                {data.EmployeeDetail && data.EmployeeDetail.contract_type}
              </Typography>
            </Grid>

            <Grid item xs={2}>
              <Typography variant="subtitle1" gutterBottom>
                الحالة الوظيفية الحالية
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <Typography variant="subtitle2" gutterBottom>
                {data.actual_status}
              </Typography>
            </Grid>

            <Grid item xs={2}>
              <Typography variant="subtitle1" gutterBottom>
                الفرع
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <Typography variant="subtitle2" gutterBottom>
                {data.Branch && data.Branch.name}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="subtitle1" gutterBottom>
                القسم
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <Typography variant="subtitle2" gutterBottom>
                {data.Department && data.Department.name}
              </Typography>
            </Grid>

            <Grid item xs={2}>
              <Typography variant="subtitle1" gutterBottom>
                الرقم التاميني
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <Typography variant="subtitle2" gutterBottom>
                {data.EmployeeDetail && data.EmployeeDetail.social_insurance_no}
              </Typography>
            </Grid>

            <Grid item xs={2}>
              <Typography variant="subtitle1" gutterBottom>
                اسم البنك التابع له
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <Typography variant="subtitle2" gutterBottom>
                {data.EmployeeDetail && data.EmployeeDetail.bank_account_name}
              </Typography>
            </Grid>

            <Grid item xs={2}>
              <Typography variant="subtitle1" gutterBottom>
                تاريخ الميلاد
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <Typography variant="subtitle2" gutterBottom>
                {data.EmployeeDetail &&
                  data.EmployeeDetail.birth_date &&
                  data.EmployeeDetail.birth_date.split(" ")[0]}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="subtitle1" gutterBottom>
                النوع
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <Typography variant="subtitle2" gutterBottom>
                {data.EmployeeDetail && data.EmployeeDetail.gender}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="subtitle1" gutterBottom>
                الجنسية
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <Typography variant="subtitle2" gutterBottom>
                {data.EmployeeDetail && data.EmployeeDetail.nationality_name}
              </Typography>
            </Grid>

            <Grid item xs={2}>
              <Typography variant="subtitle1" gutterBottom>
                الديانه
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <Typography variant="subtitle2" gutterBottom>
                {data.EmployeeDetail && data.EmployeeDetail.religion}
              </Typography>
            </Grid>

            <Grid item xs={2}>
              <Typography variant="subtitle1" gutterBottom>
                فصيلة الدم
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <Typography variant="subtitle2" gutterBottom>
                {data.EmployeeDetail && data.EmployeeDetail.blood_type}
              </Typography>
            </Grid>

            <Grid item xs={2}>
              <Typography variant="subtitle1" gutterBottom>
                الخدمة العسكرية
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <Typography variant="subtitle2" gutterBottom>
                {data.EmployeeDetail && data.EmployeeDetail.military_service}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="subtitle1" gutterBottom>
                العنوان الحالي
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <Typography variant="subtitle2" gutterBottom>
                {data.EmployeeDetail && data.EmployeeDetail.data_sheet_address}
              </Typography>
            </Grid>

            <Grid item xs={2}>
              <Typography variant="subtitle1" gutterBottom>
                العنوان في البطاقة
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <Typography variant="subtitle2" gutterBottom>
                {data.EmployeeDetail && data.EmployeeDetail.national_id_address}
              </Typography>
            </Grid>

            <Grid item xs={2}>
              <Typography variant="subtitle1" gutterBottom>
                رقم البطاقة
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <Typography variant="subtitle2" gutterBottom>
                {data.EmployeeDetail && data.EmployeeDetail.national_id_no}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="subtitle1" gutterBottom>
                تاريخ الاصدار
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <Typography variant="subtitle2" gutterBottom>
                {data.EmployeeDetail && data.EmployeeDetail.issue_date}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="subtitle1" gutterBottom>
                تاريخ الانتهاء
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <Typography variant="subtitle2" gutterBottom>
                {data.EmployeeDetail && data.EmployeeDetail.expire_date}
              </Typography>
            </Grid>

            <Grid item xs={2}>
              <Typography variant="subtitle1" gutterBottom>
                محل الميلاد
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <Typography variant="subtitle2" gutterBottom>
                {data.EmployeeDetail && data.EmployeeDetail.national_id_address}
              </Typography>
            </Grid>
          </Grid>
        </Panel>

        <Panel header="التليفون والايميل" key="3">
          <Grid
            className={classes.gridData}
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
          >
            <Grid item xs={2}>
              <Typography variant="subtitle1" gutterBottom>
                رقم الموبايل
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <Typography variant="subtitle2" gutterBottom>
                {data.EmployeeDetail && data.EmployeeDetail.mobile}
              </Typography>
            </Grid>

            <Grid item xs={2}>
              <Typography variant="subtitle1" gutterBottom>
                رقم المنزل
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <Typography variant="subtitle2" gutterBottom>
                {data.EmployeeDetail && data.EmployeeDetail.telephone}
              </Typography>
            </Grid>

            <Grid item xs={2}>
              <Typography variant="subtitle1" gutterBottom>
                ايميل العمل
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <Typography variant="subtitle2" gutterBottom>
                {data.EmployeeDetail && data.EmployeeDetail.business_email}
              </Typography>
            </Grid>

            <Grid item xs={2}>
              <Typography variant="subtitle1" gutterBottom>
                الايميل الشخصى
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <Typography variant="subtitle2" gutterBottom>
                {data.EmployeeDetail && data.EmployeeDetail.personal_email}
              </Typography>
            </Grid>
          </Grid>
        </Panel>
        <Panel header="الحالة الاجتماعية والعائلة" key="4">
          <Grid
            className={classes.gridData}
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
          >
            <Grid item xs={2}>
              <Typography variant="subtitle1" gutterBottom>
                الحالة الاجتماعية
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <Typography variant="subtitle2" gutterBottom>
                {data.EmployeeDetail && data.EmployeeDetail.social_status}
              </Typography>
            </Grid>

            <Grid item xs={2}>
              <Typography variant="subtitle1" gutterBottom>
                اسم الزوج/ الزوجة
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <Typography variant="subtitle2" gutterBottom>
                {family["Wife / Wives Name/s"]}
              </Typography>
            </Grid>

            <Grid item xs={2}>
              <Typography variant="subtitle1" gutterBottom>
                رقم بطاقة الزوجة
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <Typography variant="subtitle2" gutterBottom>
                {family["Wife / Wives National ID No./s"]}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="subtitle1" gutterBottom>
                عدد الاطفال
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <Typography variant="subtitle2" gutterBottom>
                {family["No. of Children"]}
              </Typography>
            </Grid>
            {(() => {
              let components = [];
              for (let index = 0; index < family["No. of Children"]; index++) {
                let names = family["Child / Children Name/s"]
                  ? family["Child / Children Name/s"].toString().split("/")
                  : [];
                let ids = family["Child / Children National ID No./s"]
                  ? family["Child / Children National ID No./s"]
                      .toString()
                      .split("/")
                  : [];
                let Birthdates = family["Child / Children Birthdate/s"]
                  ? family["Child / Children Birthdate/s"].toString().split("/")
                  : [];
                components.push(
                  <>
                    <Grid item xs={2}>
                      <Typography variant="subtitle1" gutterBottom>
                        {`اسم الطفل رقم ${index + 1}`}
                      </Typography>
                    </Grid>
                    <Grid item xs={10}>
                      <Typography variant="subtitle2" gutterBottom>
                        {names[index]}
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography variant="subtitle1" gutterBottom>
                        {`رقم بطاقة الطفل رقم${index + 1}`}
                      </Typography>
                    </Grid>
                    <Grid item xs={10}>
                      <Typography variant="subtitle2" gutterBottom>
                        {ids[index] && ids[index]}
                      </Typography>
                    </Grid>

                    <Grid item xs={2}>
                      <Typography variant="subtitle1" gutterBottom>
                        {`تاريخ ميلاد الطفل رقم ${index + 1}`}
                      </Typography>
                    </Grid>
                    <Grid item xs={10}>
                      <Typography variant="subtitle2" gutterBottom>
                        {Birthdates[index]}
                      </Typography>
                    </Grid>
                  </>
                );
              }
              return components;
            })()}
          </Grid>
        </Panel>
      </Collapse>
      <div style={{ marginTop: "100px", marginBottom: 20 }}>
        <Divider variant="middle" />
      </div>
      <Button
        type="submit"
        variant="contained"
        style={{
          float: "left",
          backgroundColor: "#93C020",
          color: "#FFF",
          width: "154px",
        }}
      >
        تعديل
      </Button>
    </div>
  );
}
