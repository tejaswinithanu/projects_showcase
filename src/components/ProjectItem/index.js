const ProjectItem = props => {
  const {projectDetails} = props
  const {name, imageUrl} = projectDetails
  return (
    <li>
      <img alt={name} src={imageUrl} />
      <p>{name}</p>
    </li>
  )
}

export default ProjectItem
