import React from 'react'
import {Button, Input} from 'react-bootstrap'

module.exports = function() {
  return <div className="hero-unit container">
    <div className="col-xs-6 col-xs-offset-3 mt-50">
      <Input
        type="text"
        placeholder="User login"
        label="Create game application"
        help="Enter user login"
        ref="userId"
        groupClassName="group-class"
        labelClassName="label-class" />
      <Button bsStyle="primary" onClick={this.createGameApplication}>Create</Button>
    </div>
  </div>
};

