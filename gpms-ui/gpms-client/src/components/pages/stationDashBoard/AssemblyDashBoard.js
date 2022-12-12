import React, { Component } from 'react'
import withAuth from '../../../shared/hoc/AuthComponent'
import { UserInfo } from '../../../shared/utilities/GlobalConstrants';
import AssemblyData from './AssemblyData';

class AssemblyDashBoard extends Component {
  
  componentDidMount = () => {

    const sidebarNavWrapper = document.querySelector(".sidebar-nav-wrapper");
    const mainWrapper = document.querySelector(".main-wrapper");
    const overlay = document.querySelector(".overlay");

    sidebarNavWrapper.classList.add("active");
    overlay.classList.add("active");
    mainWrapper.classList.add("active");
    document.title = "Assembly Dashboard";

  }

  render() {

    return (
      <div>
        {/* {typeof RequisitionId !== "undefined" && RequisitionId > 0 && */}
        <AssemblyData />

      </div>
    )
  }
}
export default withAuth(AssemblyDashBoard);
