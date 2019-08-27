import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom' // v4-v5
//import { Router, Route } from 'react-router' // versão antiga

import './index.css'
import Menu from './Menu'
import Home from './Home'
import AutorBox from './Autor'
import LivroBox from './Livro'

ReactDOM.render(
  (
    <BrowserRouter>
      <div>
        <div id="layout">
          <Menu />
          <div id="main">
            <Switch>
              <Route path="/" component={Home} exact />
              <Route path="/autor" component={AutorBox} />
              <Route path="/livro" component={LivroBox} />
              <Route component={Home} />{/* padrão */}
            </Switch>
          </div>
        </div>
      </div>
    </BrowserRouter>
  ),
  document.getElementById('root')
);