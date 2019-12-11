const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  noCaptcha: state => state.noCaptcha,
  verify: state => state.verify
}
export default getters
