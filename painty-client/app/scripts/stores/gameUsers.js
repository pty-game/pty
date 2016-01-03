import Reflux from 'reflux'
import GameUsersActions from '../actions/gameUsers.js'

module.exports = Reflux.createStore({
  listenables: [GameUsersActions],
  list: [],
  onAddItem: function(item) {
    this.updateList([item].concat(this.list));
  },
  onAddItems: function(items) {
    this.updateList(items.concat(this.list));
  },
  onAssignItem: function(id, obj) {
    var item = _.find(this.list, {id: id})

    if (!item) throw 'item not found'

    _.assign(item, obj)

    this.trigger(this.list)
  },
  onRemoveAll: function() {
    this.updateList([]);
  },
  updateList: function(list){
    this.list = list;
    this.trigger(list);
  }
})