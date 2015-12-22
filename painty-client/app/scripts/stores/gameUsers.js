import Reflux from 'Reflux'
import GameUsersActions from '../actions/gameUsers.js'

module.exports = Reflux.createStore({
  listenables: [GameUsersActions],
  onAddItem: function(item) {
    this.updateList([item].concat(this.list));
  },
  updateList: function(list){
    this.list = list;
    this.trigger(list);
  },
})