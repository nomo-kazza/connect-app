import _ from 'lodash'

import React, { Component, PropTypes } from 'react'
import { ROLE_TOPCODER_MANAGER, ROLE_ADMINISTRATOR } from '../../../config/constants'
import AppProjectForm from './AppProjectForm'
import GenericProjectForm from './GenericProjectForm'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { createProject } from '../../actions/project'

require('./CreateProject.scss')

class CreateView extends Component {

  constructor(props) {
    super(props)
    this.createProject = this.createProject.bind(this)
  }

  componentWillUpdate(nextProps) {
    if (!nextProps.isLoading &&
        nextProps.project.id) {
      this.props.router.push('/projects/' + nextProps.project.id )
    }
  }

  handleSelect(index, last) {
    console.log('SelectedTab: ' + index, ', LastTab: ' + last)
  }

  createProject(val) {
    console.log('creating project', val)
    this.props.createProject(val.newProject)
  }

  switchTab(val) {
    this.props.currentTab = val
  }

  renderTabs() {
    return (
      <div className="tabs">
        <ul>
          <li className="active"><a href="#">App Project</a></li>
          <li><a href="#">Work Project</a></li>
        </ul>
      </div>
    )
  }

  render() {
    let tabs = null
    let form = null
    if (_.indexOf(this.props.userRoles, ROLE_TOPCODER_MANAGER) > -1 ||
        _.indexOf(this.props.userRoles, ROLE_ADMINISTRATOR) > -1 ) {
      // TODO replace with Tabs component
      tabs = this.renderTabs()
      // Todo select based on Tab
      form = <AppProjectForm submitHandler={this.createProject}/>
    } else {
      // form = <GenericProjectForm onSubmit={this.createProject} />
      form = <AppProjectForm submitHandler={this.createProject}/>
    }
    return (
      <section className="content">
        <div className="container">
          <a href="#" className="btn-close"></a>
          {tabs}
          {form}
        </div>
      </section>
    )
  }
}

CreateView.propTypes = {
  userRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentTab: PropTypes.number.isRequired
}

CreateView.defaultProps = {
  // userRoles: ['manager'],
  currentTab: 0
}

const mapStateToProps = ({projectState, loadUser }) => ({
  userRoles: loadUser.user.roles,
  isLoading: projectState.isLoading,
  project: projectState.project
})
const actionCreators = { createProject }
export default withRouter(connect(mapStateToProps, actionCreators)(CreateView))
