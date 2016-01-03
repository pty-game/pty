import Reflux from 'reflux'
import GameUsersActionsActions from '../actions/gameUsersActions'

module.exports = Reflux.createStore({
  listenables: [GameUsersActionsActions],
  list: [],
  onAddItem: function(item) {
    this.updateList([item].concat(this.list));
  },
  onAddItems: function(items) {
    this.updateList(items.concat(this.list));
  },
  onRemoveAll: function() {
    this.updateList([]);
  },
  updateList: function(list){
    this.list = list;
    this.trigger(list);
  }
})