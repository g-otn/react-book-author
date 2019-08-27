import React, { Component } from 'react' // O JSX exige que o nome da variável que importou 'react' seja 'React'
import { Link } from 'react-router-dom'

import './css/pure-min.css'
import './css/side-menu.css'

// import $ from 'jquery' // npm i jquery --save
import PubSub from 'pubsub-js'

import ItemMenu from './componentes/ItemMenu'

class Menu extends Component {

  constructor() {
    super()
    this.state = {
      indiceSelecionado: 0,
      numAutores: 0
    }
    this.atualizarSelecao = this.atualizarSelecao.bind(this)
    PubSub.subscribe('atualiza.autores', (topico, dadosListaAutores) => {
      //console.log('menu recebeu ', topico)
      this.setState({ numAutores: dadosListaAutores.numAutores })
    })
  }

  componentWillUnmount() {
    PubSub.unsubscribe('atualizar') // atualizar.livros e atualizar.autores
  }

  atualizarSelecao(indiceItemMenu) {
    this.setState({
      indiceSelecionado: indiceItemMenu
    })
  }

  render() {
    return (
      <div>
        <a href="#menu" id="menuLink" className="menu-link">
          <span></span>
        </a>
        <div id="menu">
          <div className="pure-menu">
            <Link className="pure-menu-heading" to="/">Menu</Link>

            <ul className="pure-menu-list">
              <ItemMenu LinkTo="/" label="Home" indiceSelecao={0}
                onClick={this.atualizarSelecao}
                selecionado={this.state.indiceSelecionado === 0}
              />
              <ItemMenu LinkTo="/autor" label={"Autores: " + this.state.numAutores} indiceSelecao={1}
                onClick={this.atualizarSelecao}
                selecionado={this.state.indiceSelecionado === 1}
              />
              <ItemMenu LinkTo="/livro" label="Livros"
                onClick={this.atualizarSelecao} indiceSelecao={2}
                selecionado={this.state.indiceSelecionado === 2} 
              />
            </ul>
          </div>
        </div>
      </div>
    );
  }

}

export default Menu;
