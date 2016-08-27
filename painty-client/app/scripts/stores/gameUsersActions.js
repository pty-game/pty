import Reflux from 'reflux'
import GameUsersActionsActions from '../actions/gameUsersActions'
import GameAPI from '../api/gameAPI.js'

module.exports = Reflux.createStore({
  listenables: GameUsersActionsActions,
  list: [],
  onAddAction(gameId, action) {

    GameAPI.addAction(gameId, action)
      .then(function(response) {
        this.onAddItem(response)
      }.bind(this))
  },
  onAddItem(item) {
    this.updateList(this.list.concat([item]));
  },
  onAddItems(items) {
    this.updateList(this.list.concat(items));
  },
  onRemoveAll() {
    this.updateList([]);
  },
  updateList(list){
    this.list = list;
    this.trigger(list);
  }
})