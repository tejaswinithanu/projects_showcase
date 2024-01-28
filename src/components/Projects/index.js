import {Component} from 'react'

import Loader from 'react-loader-spinner'

import ProjectItem from '../ProjectItem'

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
  projectsList: [],
}

class Projects extends Component {
  constructor(props) {
    super(props)
    const {categoriesList} = this.props
    this.state = {
      activeOption: categoriesList[0].id,
      apiStatus: apiConstants.initial,
      projectsList: [],
    }
  }

  componentDidMount() {
    this.getProjectsList()
  }

  getProjectsList = async () => {
    this.setState({apiStatus: apiConstants.inProgress})
    const {activeOption} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${activeOption}`
    const response = await fetch(url)
    if (response.ok) {
      const data = await response.json()
      const {projects} = data

      const updatedProjects = projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({
        projectsList: updatedProjects,
        apiStatus: apiConstants.success,
      })
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  onChangeCategory = event => {
    this.setState({activeOption: event.target.value}, this.getProjectsList)
  }

  onClickRetry = () => {
    this.getProjectsList()
  }

  renderFailureView = () => (
    <div>
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button onClick={this.onClickRetry} type="button">
        Retry
      </button>
    </div>
  )

  renderProjects = () => {
    const {projectsList} = this.state
    console.log(projectsList)
    return (
      <ul>
        {projectsList.map(eachProject => (
          <ProjectItem key={eachProject.id} projectDetails={eachProject} />
        ))}
      </ul>
    )
  }

  renderThePage = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.success:
        return this.renderProjects()
      case apiConstants.failure:
        return this.renderFailureView()
      case apiConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={50} width={50} />
    </div>
  )

  render() {
    const {categoriesList, activeOption} = this.props
    return (
      <div>
        <nav>
          <img
            alt="website logo"
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
          />
        </nav>
        <div>
          <select onChange={this.onChangeCategory} value={activeOption}>
            {categoriesList.map(each => (
              <option value={each.id} key={each.id}>
                {each.displayText}
              </option>
            ))}
          </select>
          {this.renderThePage()}
        </div>
      </div>
    )
  }
}

export default Projects
