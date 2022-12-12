import React, { Component } from 'react'
import { Navigate } from 'react-router-dom';
import { AuthenticationService } from '../services/authentications/AuthenticationService';
import { withRouter } from './withRouter'

const withAuth = (OrginalComponent) => {
  class NewComponent extends React.Component {
    constructor(props) {
      super(props)
      this.state = {

      };
    }

    render() {

      const isValid = AuthenticationService.ValidateToken();
      if (!isValid) {
        return (
          <Navigate to='/login' replace={true} />
        )
      }

      return <OrginalComponent />
    }
  }

  return NewComponent;
}

export default withAuth
