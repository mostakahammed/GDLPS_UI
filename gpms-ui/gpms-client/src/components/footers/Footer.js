import React, { Component } from "react";

class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <div className="container-fluid">
          <div className="row" style={{ textAlign: 'center' }}>
            <div>
              <p className="text-sm" >
                System developved by &nbsp;
                <a href="https://grameen.technology/" target="_blank"> Grameen Communications</a>
              </p>
            </div>

            <div className="col-md-6">
              {/* <div
                className="
            terms
            d-flex
            justify-content-center justify-content-md-end
          "
              >
                <a href="#0" className="text-sm">
                  Term &amp; Conditions
                </a>
                <a href="#0" className="text-sm ml-15">
                  Privacy &amp; Policy
                </a>
              </div> */}
            </div>
          </div>
          {/* end row */}
        </div>
        {/* end container */}
      </footer>
    );
  }
}

export default Footer;
