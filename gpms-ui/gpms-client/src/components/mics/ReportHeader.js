import React, { Component } from "react";


class ReportHeader extends Component {
    render() {
        const { rptName } = this.props;
        return (
            <table style={{width:'-webkit-fill-available', color:'Black'}}>
                <thead style={{ textAlign: 'center' }}>
                    <tr >
                        <td style={{ textAlign: 'center',fontSize:'large' }} ><b>Grameen Distribution Ltd</b></td>
                    </tr>
                    <tr>
                        <td style={{ textAlign: 'center' }} >Telecom Bhaban (Level - 4)53/1, Box Nagar, Zoo Road Mirpur -1, Dhaka - 1216 </td>
                    </tr>
                    <tr>
                        <td style={{ textAlign: 'center' }}> <b>{rptName}</b></td>
                    </tr>
                </thead>
            </table>

        );
    }
}


export default (ReportHeader);


