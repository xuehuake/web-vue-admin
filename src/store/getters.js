const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.userToken.Authorization,
  avatar: state => state.user.userInfo.avatar,
  name: state => state.user.userInfo.name,
  noCaptcha: state => state.noCaptcha,
  verify: state => state.verify
}
export default getters
