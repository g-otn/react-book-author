import React, { Component } from 'react';
import InputCustomizado from './componentes/InputCustomizado'
import SubmitCustomizado from './componentes/SubmitCustomizado'
import SelectCustomizado from './componentes/SelectCustomizado'
import PubSub from 'pubsub-js';
import TratadorErros from './componentes/TratadorErros'

async function resgatarLista(uri, opcoes) {
  let novaLista

  await fetch(uri, opcoes)
    .then(resposta => {
      if (resposta.ok) {
        return resposta.json()
      } else if (resposta.status === 400) { // bad request
        resposta.text().then(resposta => {
          resposta = JSON.parse(resposta)
          let erros = resposta.errors
          new TratadorErros().publicaErros(erros)
        })
      } //else resposta.text().then(resposta => console.log('debug error:', JSON.parse(resposta)))
    })
    .then(listaDaResposta => {
      if (listaDaResposta)
        novaLista = listaDaResposta.slice(listaDaResposta.length - 5)
    })
  return novaLista
}

class FormularioLivro extends Component {

  constructor() {
    super()
    this.state = {
      titulo: '',
      preco: '',
      autorId: ''
    }
    this.enviarForm = this.enviarForm.bind(this)
  }

  salvarAlteracao(nomeInput, evento) {
    let campoSendoAlterado = {}
    campoSendoAlterado[nomeInput] = evento.target.value
    this.setState(campoSendoAlterado)
  }

  enviarForm(evento) {
    evento.preventDefault()

    resgatarLista('https://cdc-react.herokuapp.com/api/livros',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: this.state.titulo,
          preco: this.state.preco,
          autorId: this.state.autorId
        })
      }
    )
      .then(novaLista => {
        if (!novaLista)
          return
        PubSub.publish('atualiza-lista-livros', novaLista)
        PubSub.publish("limpa-erros", {})
      })
  }

  render() {
    return (
      <div className="pure-form pure-form-aligned">
        <form className="pure-form pure-form-aligned" onSubmit={this.enviarForm/*.bind(this)*/} method="POST">
          <InputCustomizado id="titulo" type="text" name="titulo"
            value={this.state.titulo} onChange={this.salvarAlteracao.bind(this, 'titulo')} label="Título"
          />
          <InputCustomizado id="preco" type="number" name="preco"
            value={this.state.preco} onChange={this.salvarAlteracao.bind(this, 'preco')} label="Preço" step="0.01"
          />
          <SelectCustomizado id="autores" label="Autor" listaOpcoes={this.props.listaAutores} onChange={this.salvarAlteracao.bind(this, 'autorId')} />
          <SubmitCustomizado type="submit" text="Enviar" onSubmit={this.enviarForm} />
        </form>
      </div>
    )
  }

}

class TabelaLivros extends Component {

  render() {
    return (
      <div>
        <table className="pure-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Autor</th>
              <th>Preço</th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.listaLivros.map((livro) => {
                return (
                  <tr key={livro.id}>
                    <td>{livro.titulo}</td>
                    <td>{livro.autor.nome}</td>
                    <td>{livro.preco}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    )
  }

}

export default class LivroBox extends Component {

  constructor() {
    super()
    this.state = {
      numLivros: '',
      listaLivros: [],
      listaAutores: []
    }
  }

  componentDidMount() {
    resgatarLista('https://cdc-react.herokuapp.com/api/livros')
      .then(novaLista => {
        if (!novaLista)
          return
        this.setState({
          listaLivros: novaLista
        })
      })

    resgatarLista('http://cdc-react.herokuapp.com/api/autores')
      .then(novaLista => {
        if (!novaLista)
          return
        this.setState({
          listaAutores: novaLista
        })
      })

    PubSub.subscribe('atualiza-lista-livros', ((topico, lista) => {
      this.setState({ listaLivros: lista });
    }))
  }

  render() {
    return (
      <div>
        <div className="header">
          <h1>Cadastro de Livros</h1>
          <h3>Número de livros: {this.state.numLivros}</h3>
        </div>
        <div className="content" id="content">
          <FormularioLivro listaAutores={this.state.listaAutores} />
          <TabelaLivros listaLivros={this.state.listaLivros} />
        </div>
      </div>
    )
  }

}