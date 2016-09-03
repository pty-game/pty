import React from 'react'
import Router from 'react-router'

module.exports = function () {
  return <div className="app">
    {
      this.state.user ?
        <div>
          <p>Lvl: {this.state.user.level}</p>
          <p>Exp: {this.state.user.experience} / {this.state.user.nextLevelExperience}</p>
          <p>Total games: {this.state.user.games_total}</p>
          <p>Games won: {this.state.user.games_won}</p>
          <p>Games loose: {this.state.user.games_loose}</p>
          <p>Games draw: {this.state.user.games_draw}</p>
        </div> :
        <p>Loading...</p>
    }
    {this.props.children}
  </div>
};
