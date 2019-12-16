const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  userToken: state => state.user.userToken,
  avatar: state => state.user.userInfo.avatar,
  name: state => state.user.userInfo.name,
  verify: state => state.verify
}
export default getters
