import React from "react";
import "./sidebar.css";
// import HomeIcon from "@material-ui/icons/Home";
import PeopleIcon from "@material-ui/icons/People";
import LocalMallOutlinedIcon from "@material-ui/icons/LocalMallOutlined";
// import QueryBuilderOutlinedIcon from "@material-ui/icons/QueryBuilderOutlined";
import PersonOutlinedIcon from "@material-ui/icons/PersonOutlined";
// import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import TrackChangesOutlinedIcon from "@material-ui/icons/TrackChangesOutlined";
// import ContactMailIcon from "@material-ui/icons/ContactMail";
import { SidebarComponent } from "./SidebarComponent";
import logo from "../images/smartLogo.png";
import { useSelector } from "react-redux";

let sideBarItems = {
  "/hr/employees": (
    <SidebarComponent
      title="الموظفين"
      route="/employees"
      Icon={<PeopleIcon size={20} style={{ color: "#747474" }} />}
    />
  ),
  "/hr/update_employee": (
    <SidebarComponent
      title="تعديل موظف"
      route="/update_employee"
      Icon={<TrackChangesOutlinedIcon size={20} style={{ color: "#747474" }} />}
    />
  ),
  "/hr/attendance": (
    <SidebarComponent
      title="الحضور والأنصراف"
      route="/attendance"
      Icon={<PersonOutlinedIcon size={20} style={{ color: "#747474" }} />}
    />
  ),

  "/hr/vacation": (
    <SidebarComponent
      title="اضافة طلب"
      route="/vacation"
      Icon={<LocalMallOutlinedIcon size={20} style={{ color: "#747474" }} />}
    />
  ),

  "/hr/myRequests": (
    <SidebarComponent
      title="الطلبات"
      route="/myRequests"
      Icon={<TrackChangesOutlinedIcon size={20} style={{ color: "#747474" }} />}
    />
  ),
  "/hr/deductions": (
    <SidebarComponent
      title="خصومات المرتب"
      route="/deductions"
      Icon={<TrackChangesOutlinedIcon size={20} style={{ color: "#747474" }} />}
    />
  ),
  "/hr/officialHolidays": (
    <SidebarComponent
      title="الاجازات الرسمية"
      route="/officialHolidays"
      Icon={<TrackChangesOutlinedIcon size={20} style={{ color: "#747474" }} />}
    />
  ),
  "/hr/uploadAttendanceFile": (
    <SidebarComponent
      title="تحديث الحضور و الانصراف"
      route="/uploadAttendanceFile"
      Icon={<TrackChangesOutlinedIcon size={20} style={{ color: "#747474" }} />}
    />
  ),

  "/hr/addAttendance": (
    <SidebarComponent
      title="اضافة الحضور"
      route="/addAttendance"
      Icon={<TrackChangesOutlinedIcon size={20} style={{ color: "#747474" }} />}
    />
  ),
  "/hr/jobStatus": (
    <SidebarComponent
      title="حالة العمليات"
      route="/jobStatus"
      Icon={<TrackChangesOutlinedIcon size={20} style={{ color: "#747474" }} />}
    />
  ),
};
const SideBar = () => {
  const { routes = [] } = useSelector((store) => store);

  return (
    <div>
      <div className="sidebar">
        <div
          style={{
            backgroundColor: "#FFF",
            padding: "11px",
            marginBottom: "10px",
            marginTop: "-16px",
          }}
        >
          <img src={logo} width="120.69px" height="37px" alt="logo" />
        </div>

        {routes.map((route) => {
          return sideBarItems[route];
        })}

        {/* 
        <SidebarComponent
          title="الصفحة الرئيسية"
          route="/home"
          Icon={<HomeIcon size={20} style={{ color: "#747474" }} />}
        />
*/}

        {/* <SidebarComponent
          title="الطلبات"
          route="/requests"
          Icon={<ContactMailIcon size={20} style={{ color: "#747474" }} />}
        /> */}
        {/* 
        <SidebarComponent
          title="المأموريات"
          route=""
          Icon={
            <TrackChangesOutlinedIcon size={20} style={{ color: "#747474" }} />
          }
        />

        <SidebarComponent
          title="الجزائات"
          route=""
          Icon={
            <DescriptionOutlinedIcon size={20} style={{ color: "#747474" }} />
          }
        />

        <SidebarComponent
          title="إنشاء تقرير"
          route=""
          Icon={
            <DescriptionOutlinedIcon size={20} style={{ color: "#747474" }} />
          }
        />
*/}
        {/* <SidebarComponent
          title="الأستقالات"
          route="/resignation"
          Icon={
            <DescriptionOutlinedIcon size={20} style={{ color: "#747474" }} />
          }
        /> */}
      </div>
    </div>
  );
};

export default SideBar;
