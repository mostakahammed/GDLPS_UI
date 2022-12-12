import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthenticationService } from '../../shared/services/authentications/AuthenticationService';
import Breadcrumb from '../mics/Breadcrumb';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: '',
      roleId: 0,
    };
  }

  componentDidMount = () => {
    let resToken = AuthenticationService.GetToken();

    this.setState({
      userName: resToken.userName,
      roleId: resToken.roleId
    })
  }

  render() {
    const isValid = AuthenticationService.ValidateToken();
    if (!isValid) {
      return (
        <Navigate to='/login' replace={true} />
      )
    }
    const {userName} =this.state;
      return (

        <div className="container-fluid">
          <Breadcrumb
            BreadcrumbParams={{
              header: "My Profile",
              title: "Profile",
              isDashboardMenu: false,
              isThreeLayer: false,
              threeLayerTitle: "",
              threeLayerLink: "",
            }}
          />
          <div className="row">
            <div className="col-xxl-12 col-lg-12">
              <div className="profile-wrapper mb-30">
                <div className="profile-cover">
                  <img src="assets/images/profile/profile-cover.jpg" alt="cover-image" />

                </div>
                <div className="d-md-flex">
                  <div className="profile-photo">
                    <div className="image">
                      <img src="assets/images/profile/profile-image.png" alt="profile" />
                    </div>
                    <div className="profile-meta pt-25">
                      <h5 className="text-bold mb-10">{userName}</h5>
                      {/* <p className="text-sm">Founder, Abc Company</p> */}
                    </div>
                  </div>
                </div>
                <div className="profile-info">
                  {/* <h5 className="text-bold mb-15">About Me</h5>
                <p className="text-sm mb-30">
                  Hello there, I am an expert Web &amp; UI/UX Designer. I am a
                  full-time Freelancer and my passion is to satisfy my buyers
                  by giving 100% best quality work. I will Design Landing
                  page, UI/UX Design, web template design E-mail template
                  design Flyer Design, All Print Media Design, etc..
                  <a href="#0" className="text-medium text-dark">[Read More]</a>
                </p> */}
                </div>
              </div>
              {/* end card */}

            </div>
          </div>
        </div>
      );
    }
  }

export default Profile;
