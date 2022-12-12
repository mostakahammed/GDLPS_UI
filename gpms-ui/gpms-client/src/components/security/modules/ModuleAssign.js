import React, { Component, Fragment } from 'react'
import { MenuTypeConstants, ToasterTypeConstants } from '../../../shared/utilities/GlobalConstrants';
import Breadcrumb from '../../mics/Breadcrumb';
import './ModuleAssign.css';
import _ from 'lodash';
import { RoleService } from '../../../shared/services/roles/RoleService';
import { AuthenticationService } from '../../../shared/services/authentications/AuthenticationService';
import { ModuleService } from '../../../shared/services/modules/ModuleService';
import { Toaster } from '../../../shared/utilities/Toaster';
import { ValidateForm } from '../../../shared/utilities/ValidateForm';
import { Helmet } from 'react-helmet';

export class ModuleAssign extends Component {

    constructor(props) {
        super(props)

        this.state = {
            roles: [],
            roleId: 0,
            roleMenus: [],
            //validation
            error: {
                roleId: 0
            }
        }
    }

    componentDidMount = () => {
        this.getRoleList();
    }

    handleRoleChange = (event) => {
        var name = event.target.name;
        var value = event.target.value;

        this.setState({
            [name]: value
        })

        if (value <= 0) {
            this.setState({
                roleMenus: []
            })
            return;
        }

        //get roles menu
        this.getRoleMenus(value);
    }

    getRoleList = async () => {
        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }

        const res = await RoleService.GetDropdownList(resToken.token)
        this.setState({
            roles: res.data
        })
    }

    getRoleMenus = async (roleId) => {
        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }
        await ModuleService.GetRoleMenus(roleId, resToken.token)
            .then((res) => {
                this.setState({
                    roleMenus: res.data
                })
            });
    }

    handleTreeView = (id, type, isParentMenu = false) => {
        var toggler = document.getElementsByClassName(`box-${id}${type}`);
        //toggler[0].parentElement.querySelector(".nested").classList.toggle("active");

        toggler[0].classList.toggle("check-box");

        const { roleMenus } = this.state;

        //when parent menu is deselected
        if (!toggler[0].classList.contains('check-box')) {

            _.map(roleMenus, (item) => {

                if (item.id !== id) {
                    return item;
                }

                //de select selected checkboxes
                //is selected
                this.deSelectMenu(item.id, MenuTypeConstants.IsSelected);

                //deselect child menu if deselect parent
                if (isParentMenu) {
                    _.map(roleMenus, (item) => {
                        if (item.parentId === id) {
                            item.isSelected = false;
                            item.canView = false;
                            item.canAdd = false;
                            item.canEdit = false;
                            item.canDelete = false

                            //is selected
                            this.deSelectMenu(item.id, MenuTypeConstants.IsSelected);

                            //can view
                            this.deSelectMenu(item.id, MenuTypeConstants.CanView);
                            //can add
                            this.deSelectMenu(item.id, MenuTypeConstants.CanAdd);
                            //can edit
                            this.deSelectMenu(item.id, MenuTypeConstants.CanEdit);
                            //can delete
                            this.deSelectMenu(item.id, MenuTypeConstants.CanDelete);

                            return item;
                        }
                    });
                }

                if (!isParentMenu) {
                    //can view
                    this.deSelectMenu(item.id, MenuTypeConstants.CanView);
                    //can add
                    this.deSelectMenu(item.id, MenuTypeConstants.CanAdd);
                    //can edit
                    this.deSelectMenu(item.id, MenuTypeConstants.CanEdit);
                    //can delete
                    this.deSelectMenu(item.id, MenuTypeConstants.CanDelete);
                }

                item.isSelected = false;
                item.canView = false;
                item.canAdd = false;
                item.canEdit = false;
                item.canDelete = false

                return item;

            });
        }
        else {
            _.map(roleMenus, (item) => {
                return item.id === id ? item.IsSelected = true : item;
            });
        }
    }

    deSelectMenu = (id, type, isParentMenu = false) => {
        let togglerDeSelected
        if (type === MenuTypeConstants.IsSelected) {
            togglerDeSelected = document.getElementsByClassName(`box-${id}${MenuTypeConstants.IsSelected}`);
        }
        else if (type === MenuTypeConstants.CanView) {
            togglerDeSelected = document.getElementsByClassName(`box-${id}${MenuTypeConstants.CanView}`);
        }
        else if (type === MenuTypeConstants.CanAdd) {
            togglerDeSelected = document.getElementsByClassName(`box-${id}${MenuTypeConstants.CanAdd}`);
        }
        else if (type === MenuTypeConstants.CanEdit) {
            togglerDeSelected = document.getElementsByClassName(`box-${id}${MenuTypeConstants.CanEdit}`);
        }
        else if (type === MenuTypeConstants.CanDelete) {
            togglerDeSelected = document.getElementsByClassName(`box-${id}${MenuTypeConstants.CanDelete}`);
        }

        togglerDeSelected[0].classList.remove("check-box");
    }

    selectMenu = (id, type) => {
        let togglerSelected
        if (type === MenuTypeConstants.IsSelected) {
            togglerSelected = document.getElementsByClassName(`box-${id}${MenuTypeConstants.IsSelected}`);
        }
        else if (type === MenuTypeConstants.CanView) {
            togglerSelected = document.getElementsByClassName(`box-${id}${MenuTypeConstants.CanView}`);
        }
        else if (type === MenuTypeConstants.CanAdd) {
            togglerSelected = document.getElementsByClassName(`box-${id}${MenuTypeConstants.CanAdd}`);
        }
        else if (type === MenuTypeConstants.CanEdit) {
            togglerSelected = document.getElementsByClassName(`box-${id}${MenuTypeConstants.CanEdit}`);
        }
        else if (type === MenuTypeConstants.CanDelete) {
            togglerSelected = document.getElementsByClassName(`box-${id}${MenuTypeConstants.CanDelete}`);
        }

        togglerSelected[0].classList.remove("check-box");
        togglerSelected[0].classList.add("check-box");
    }

    handleChildMenu = (id, type, parentId = 0) => {
        const { roleMenus } = this.state;
        var toggler = document.getElementsByClassName(`box-${id}${type}`);
        toggler[0].classList.toggle("check-box");

        let selectedMenus = this.getSelectedModules(toggler[0], id, type, parentId);

        /*
        this.setState({
            roleMenus: selectedMenus
        });
        */

    }

    getSelectedModules = (toggler, id, type, parentId = 0) => {
        const { roleMenus } = this.state;

        //when menu is seleected
        if (toggler.classList.contains('check-box')) {
            if (type === MenuTypeConstants.IsSelected) {
                _.map(roleMenus, (item) => {
                    return item.id === id ? item.IsSelected = true : item;
                });
            }
            else if (type === MenuTypeConstants.CanView) {
                _.map(roleMenus, (item) => {
                    if (item.id === id) {
                        item.canView = true;
                        item.isSelected = true;

                        //select menu
                        this.selectMenu(id, MenuTypeConstants.IsSelected);

                        return item;
                    }
                    return item;
                });
            }
            else if (type === MenuTypeConstants.CanAdd) {
                _.map(roleMenus, (item) => {
                    if (item.id === id) {
                        item.canAdd = true;
                        item.isSelected = true;

                        //select menu
                        this.selectMenu(id, MenuTypeConstants.IsSelected);

                        return item;
                    }
                    return item;
                });
            }
            else if (type === MenuTypeConstants.CanEdit) {
                _.map(roleMenus, (item) => {
                    if (item.id === id) {
                        item.canEdit = true;
                        item.isSelected = true;

                        //select menu
                        this.selectMenu(id, MenuTypeConstants.IsSelected);

                        return item;
                    }
                    return item;
                });
            }
            else if (type === MenuTypeConstants.CanDelete) {
                _.map(roleMenus, (item) => {
                    if (item.id === id) {
                        item.canDelete = true;
                        item.isSelected = true;

                        //select menu
                        this.selectMenu(id, MenuTypeConstants.IsSelected);

                        return item;
                    }
                    return item;
                });
            }

            var togglerParentMenu = document.getElementsByClassName(`box-${parentId}${type}`);
            //when menu is seleected then auto select the parent menu
            if (!togglerParentMenu[0].classList.contains('check-box')) {
                //select parent menu
                this.selectMenu(parentId, type);
                _.map(roleMenus, (item) => {
                    if (item.id === parentId) {
                        item.IsSelected = true;
                    }

                    return item
                });
            }

        }//when menu is deselected
        else {

            if (type === MenuTypeConstants.IsSelected) {
                _.map(roleMenus, (item) => {
                    if (item.id !== id) {
                        return item;
                    }

                    //de select selected checkboxes                   
                    //can view
                    this.deSelectMenu(item.id, MenuTypeConstants.CanView);
                    //can add
                    this.deSelectMenu(item.id, MenuTypeConstants.CanAdd);
                    //can edit
                    this.deSelectMenu(item.id, MenuTypeConstants.CanEdit);
                    //can delete
                    this.deSelectMenu(item.id, MenuTypeConstants.CanDelete);

                    item.isSelected = false;
                    item.canView = false;
                    item.canAdd = false;
                    item.canEdit = false;
                    item.canDelete = false
                    return item;
                });
            }
            else if (type === MenuTypeConstants.CanView) {
                _.map(roleMenus, (item) => {
                    return item.id === id ? item.canView = false : item;
                });
            }
            else if (type === MenuTypeConstants.CanAdd) {
                _.map(roleMenus, (item) => {
                    return item.id === id ? item.canAdd = false : item;
                });
            }
            else if (type === MenuTypeConstants.CanEdit) {
                _.map(roleMenus, (item) => {
                    return item.id === id ? item.canEdit = false : item;
                });
            }
            else if (type === MenuTypeConstants.CanDelete) {
                _.map(roleMenus, (item) => {
                    return item.id === id ? item.canDelete = false : item;
                });
            }
        }

        return roleMenus;
    }

    validateFormOnLoginSubmit = () => {
        this.formValidationObject('roleId', this.state.roleId);
    }

    formValidationObject = (name, value) => {
        let error = this.state.error;
        switch (name) {
            case "roleId":
                error.roleId = !value || value <= 0 ? "Role is Required" : "";
                break;
            default:
                break;
        }

        this.setState({
            error,
            [name]: value
        })
    };


    handleSubmit = async (e) => {
        e.preventDefault();

        this.validateFormOnLoginSubmit();
        if (!ValidateForm(this.state.error)) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! You must fill all the required fields" });
            return;
        }

        const { roleId, roleMenus } = this.state;
        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }

        const model = {
            roleId,
            roleMenus
        }

        const res = await ModuleService.AssignRolesMenu(model, resToken.token);

        if (res.response.isSuccess) {
            this.setState({
                name: "",
                color: "",
                code: "",
                type: ""
            })
            Toaster.Notify({ type: ToasterTypeConstants.Success, message: res.response.message });
            return;
        }

        Toaster.Notify({ type: ToasterTypeConstants.Warning, message: res.response.message });
    };

    render() {

        const { roleId, roles, roleMenus, error } = this.state;
        return (

            <div className="container-fluid">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Module </title>
                </Helmet>
                <Breadcrumb
                    BreadcrumbParams={{
                        header: "Module's Menu",
                        title: "Assign Menu",
                        isDashboardMenu: false,
                        isThreeLayer: false,
                        threeLayerTitle: "",
                        threeLayerLink: "",
                    }}
                />

                <form className="form-elements-wrapper" onSubmit={this.handleSubmit} noValidate>
                    <div className="card-style mb-30" style={{ marginBottom: "0px" }}>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="input-style-1">
                                    <label><b>Role</b> </label>
                                    <select className="form-control" name="roleId" id="roleId" onChange={this.handleRoleChange} value={roleId}>
                                        <option value={0}> Select One</option>
                                        {roles.map((item, index) => {
                                            return (
                                                <option key={index} value={item.value}>{item.label}</option>
                                            )
                                        })}
                                    </select>

                                    {error.roleId.length > 0 && (
                                        <div style={{ display: "block" }} className="invalid-feedback"> {error.roleId}</div>
                                    )}

                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="input-style-1">
                                    <ul id="modulesMenu">

                                        {
                                            roleMenus.filter(cm => cm.parentId == null).map((item, index) => {
                                                return (
                                                    <li key={index}>
                                                        <span className={`box box-${item.id}${MenuTypeConstants.IsSelected} fw-bold ${item.isSelected ? 'check-box' : ''}`} onClick={() => this.handleTreeView(item.id, MenuTypeConstants.IsSelected, true)}> {item.isSelected} {item.name}</span>
                                                        <ul className="nested active">
                                                            {
                                                                roleMenus.filter(cm => cm.parentId > 0 && cm.parentId == item.id).map((cItem, cIndex) => {
                                                                    return (
                                                                        <li key={cIndex}>
                                                                            <span className={`box box-${cItem.id}${MenuTypeConstants.IsSelected} ${cItem.isSelected ? 'check-box' : ''}`} onClick={() => this.handleChildMenu(cItem.id, MenuTypeConstants.IsSelected, item.id)}>{cItem.name}</span>
                                                                            <span className={`box box-${cItem.id}${MenuTypeConstants.CanView} ${cItem.canView ? 'check-box' : ''}`} onClick={() => this.handleChildMenu(cItem.id, MenuTypeConstants.CanView, item.id)}>Can View</span>
                                                                            <span className={`box box-${cItem.id}${MenuTypeConstants.CanAdd} ${cItem.canAdd ? 'check-box' : ''}`} onClick={() => this.handleChildMenu(cItem.id, MenuTypeConstants.CanAdd, item.id)}>Can Add</span>
                                                                            <span className={`box box-${cItem.id}${MenuTypeConstants.CanEdit} ${cItem.canEdit ? 'check-box' : ''}`} onClick={() => this.handleChildMenu(cItem.id, MenuTypeConstants.CanEdit, item.id)}>Can Edit</span>
                                                                            <span className={`box box-${cItem.id}${MenuTypeConstants.CanDelete} ${cItem.canDelete ? 'check-box' : ''}`} onClick={() => this.handleChildMenu(cItem.id, MenuTypeConstants.CanDelete, item.id)}>Can Delete</span>
                                                                        </li>
                                                                    )
                                                                })
                                                            }
                                                        </ul>
                                                    </li>
                                                )
                                            })
                                        }

                                    </ul>
                                </div>

                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <div className=" button-group d-flex justify-content-left flex-wrap">
                                    <button className="main-btn primary-btn btn-hover w-60 text-center" type="submit"> Submit </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default ModuleAssign