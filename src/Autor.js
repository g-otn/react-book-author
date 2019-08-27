import React, { Component } from 'react';
import InputCustomizado from './componentes/InputCustomizado'
import SubmitCustomizado from './componentes/SubmitCustomizado'
import PubSub from 'pubsub-js'
import TratadorErros from './componentes/TratadorErros'

class FormularioAutor extends Component {

  constructor() {
    super()
    this.state = {
      nome: '',
      email: '',
      senha: ''
    }
    this.enviaForm = this.enviaForm.bind(this)
    this.setNome = this.setNome.bind(this)
    this.setEmail = this.setEmail.bind(this)
    this.setSenha = this.setSenha.bind(this)
  }

  enviaForm(evento) {
    evento.preventDefault()

    PubSub.publish("limpar-erros", {})

    fetch('http://cdc-react.herokuapp.com/api/autores',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: this.state.nome,
          email: this.state.email,
          senha: this.state.senha
        })
      }
    )
      .then(resposta => {
        if (resposta.ok) {
          //console.log('resposta do servidor ok:', resposta.status, resposta.statusText)
          return resposta.json() // novaLista
        } else {
          //console.log('Resposta do servidor não ok:', resposta.status, resposta.statusText)
          if (resposta.status === 400) // bad request
            resposta.text().then(resposta => {
              resposta = JSON.parse(resposta)
              let erros = resposta.errors
              new TratadorErros().publicaErros(erros)
            })
        }
      })
      // Resposta
      .then(novaLista => {
        if (!novaLista)
          return
        let numAutores = novaLista.length
        novaLista = novaLista.slice(novaLista.length - 5) // Tem uns 11k de objetos na array retornada pela API no Heroku então isso reduz um pouco, pegando só os últimos

        PubSub.publish('atualiza.autores', { novaLista: novaLista, numAutores: numAutores })

        this.setState({
          nome: '',
          email: '',
          senha: ''
        })
      })
  }

  setNome(evento) {
    this.setState({
      nome: evento.target.value
    })
  }

  setEmail(evento) {
    this.setState({
      email: evento.target.value
    })
  }

  setSenha(evento) {
    this.setState({
      senha: evento.target.value
    })
  }

  render() {
    return (
      <div className="pure-form pure-form-aligned">
        <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm/*.bind(this)*/} method="POST">
          <InputCustomizado id="nome" type="text" name="nome"
            value={this.state.nome} onChange={this.setNome} label="Nome"
          />
          <InputCustomizado id="email" type="email" name="email"
            value={this.state.email} onChange={this.setEmail} label="Email"
          />
          <InputCustomizado id="senha" type="password" name="senha"
            value={this.state.senha} onChange={this.setSenha} label="Senha"
          />
          <SubmitCustomizado type="submit" text="Enviar" />
        </form>
      </div>
    )
  }

}

class TabelaAutores extends Component {

  render() {
    return (
      <div>
        <table className="pure-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.listaAutores.map((autor) => {
                return (
                  <tr key={autor.id}>
                    <td>{autor.nome}</td>
                    <td>{autor.email}</td>
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

export default class AutorBox extends Component {

  constructor() {
    super()
    this.state = {
      numAutores: '',
      listaAutores: []
    }
  }

  componentDidMount() {

    PubSub.subscribe('atualiza.autores', (topico, dadosListaAutores) => {
      this.setState({
        numAutores: dadosListaAutores.numAutores,
        listaAutores: dadosListaAutores.novaLista
      })
    })

    fetch('http://cdc-react.herokuapp.com/api/autores')
      .then(resposta => {
        if (resposta.ok) {
          //console.log('resposta do servidor ok:', resposta.status, resposta.statusText)
          return resposta.json() // novaLista
        } else {
          //console.log('Resposta do servidor não ok:', resposta.status, resposta.statusText)
        }
      })
      .then((novaLista => {
        if (!novaLista)
          return
        let numAutores = novaLista.length
        novaLista = novaLista.slice(novaLista.length - 5) // Tem uns 11k de objetos na array retornada pela API no Heroku então isso reduz um pouco, pegando os 5 últimos
        PubSub.publish('atualiza.autores', { novaLista: novaLista, numAutores: numAutores })
      }))
  }

  render() {
    return (
      <div>
        <div className="header">
          <h1>Cadastro de Autores</h1>
        </div>
        <div className="content" id="content">
          <FormularioAutor />
          <TabelaAutores listaAutores={this.state.listaAutores} />
        </div>
      </div>
    )
  }

}