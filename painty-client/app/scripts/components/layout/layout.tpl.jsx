import React from 'react'
import Router from 'react-router'

module.exports = function () {
  return <div className="app">
    {
      this.state.user ?
        <div>
          <p>Lvl: {this.state.user.level}</p>
          <p>Exp: {this.state.user.experience} / {this.state.user.nextLevelExperience}</p>
        </div> :
        <p>Loading...</p>
    }
    {this.props.children}
  </div>
};
