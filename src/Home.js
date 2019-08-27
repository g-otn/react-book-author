import React, { Component } from 'react'

export default class Home extends Component {

  render() {
    return (
      <div>
        <div className="header">
          <h1>Bem vindo ao sistema</h1>
        </div>
        <div className="content" id="content">
          <h3>Use o menu para acessar os formulários de cadastro!</h3>
        </div>
      </div>
    )
  }

}