//Esta função é para o usuário não ter acesso pelo console do navegador
(function (){
  //função para converter milisegundo em sminutos e segundos
  function convertPeriod(mil){
    const ho = Math.floor(mil / 3600000);
    const min = Math.floor(mil % 3600000) / 60000;
    const sec = Math.floor(mil % 60000) / 1000;
    return `${ho}h ${min.toFixed(0)}m e ${sec.toFixed(0)}s`
  }
  //função para quando a página for atualizada os itens permaneçam
  function renderGarage(){
    const garage = getGarage();
    document.querySelector('#garage').innerHTML = '';
    //os itens vão sendo adicinados no froEach
    garage.forEach(c => addCarToGarage(c))
  }

  //função que vai adicionar o car na tabela
  function addCarToGarage(car){
    //const row é linha da tabela
    const row = document.createElement('tr');
    //dentro do row serão adicionados outras informações usando o innerHTML
    row.innerHTML = `
        <td>${car.name}</td>
        <td>${car.licence}</td>
        <td data-time="${car.time}">${new Date(car.time).toLocaleString("pt-BR", {hour: "numeric", minute: "numeric"})}
        </td>
        <td>
          <button class="delete">x</button>
        </td>
    `;
    //unir o row e garage para poder adicionar na página.
    document.querySelector('#garage').appendChild(row);
  };

  function checkOut(info) {
    let period = new Date() - new Date(info[2].dataset.time);
    period = convertPeriod(period)
    const licence = info[1].textContent;
    const msg = `O veículo ${info[0].textContent} de placa ${licence} permaneceu estacionado por ${period}.
    Deseja encerrar?`;
    if(!confirm(msg)) return;
    const garage = getGarage().filter(c => c.licence !== licence);
    localStorage.garage = JSON.stringify(garage);
    renderGarage();
  };

  const getGarage = () => {
    return localStorage.garage ? JSON.parse(localStorage.garage) : [];
  };
  renderGarage();
  //evento de click do botão resgistrar veículo
  document.querySelector('#send').addEventListener('click', e => {
    const name = document.querySelector('#name').value;
    const licence = document.querySelector('#licence').value;
    //este if é para falidar que os inputs estam preenchidos
    if(!name || !licence){
      alert('Os campos são obrigatórios!')
      return;//impede que função continue
    }
    //objeto car, ele vai armazenar as informações
    const car = {name, licence, time:new Date()}

    //localStorage 
    const garage = getGarage();
    //garage vai receber um objto car
    garage.push(car);
    localStorage.garage = JSON.stringify(garage);
    addCarToGarage(car);
    //função para limpar os input
    document.querySelector('#name').value = '';
    document.querySelector('#licence').value = '';
  });

  //evento de click para remover os itens inseridos
  document.querySelector('#garage').addEventListener('click', e => {
    if(e.target.className == "delete")
    checkOut(e.target.parentElement.parentElement.cells);
  });
})();