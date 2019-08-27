import PubSub from 'pubsub-js';

export default class TratadorErros {

  publicaErros(erros) {
    for (let i = 0; i < erros.length; i++) {
      PubSub.publish("erro-validacao", erros[i]);
    }
  }
  
}