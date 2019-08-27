import React, { Component } from 'react';
import { Link } from 'react-router-dom'

export default class ItemMenu extends Component {

  constructor() {
    super()
    this.avisarClique = this.avisarClique.bind(this)
  }

  avisarClique() {
    this.props.onClick(this.props.indiceSelecao)
  }

  render() {
    return (
      <li
        className={"pure-menu-item" + (this.props.selecionado ? ' pure-menu-selected' : '')}
        onClick={this.avisarClique}
      >
        <Link
          to={this.props.LinkTo} className="pure-menu-link">{this.props.label}</Link>
      </li>
    )
  }

}