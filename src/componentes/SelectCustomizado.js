import React, { Component } from 'react';

export default class SelectCustomizado extends Component {

  render() {
    return (
      <div className="pure-control-group">
        <label htmlFor={this.props.nome}>
          {this.props.label}
        </label>
        <select name={this.props.nome} onChange={this.props.onChange}>
          <option value="">Selecione</option>
          {
            this.props.listaOpcoes.map(function (opcao) {
              return <option key={opcao.id} value={opcao.id}>
                {opcao.nome}
              </option>;
            })
          }
        </select>
      </div>
    )
  }

}