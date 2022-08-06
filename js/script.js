let userVetor = [], excluidos = []
let userObj = {}, loginObj = {}, plantasObj = {}
let deletarCadastro = false, deletarPlanta = false, lista = ''
let Listar

//Cadastro
let id, logado, repetido, msgCadastro, nasc = 18

function Cadastrar(){

    repetido = false
    userVetor = JSON.parse(localStorage.getItem('Usuários'))
    if(userVetor == null) {
        userVetor = []
    }

    userObj = {
        nome: document.getElementById('usernameLogin').value,
        senha: document.getElementById('senhaLogin').value,
        plantas: []
    }
        
        for(i = 0; i < userVetor.length; i++){
            if(userObj.nome == userVetor[i].nome) {
            repetido = true
            }
        }

        if(!repetido){
            
            if(document.getElementById("IdadeLogin").value >= nasc){

                userVetor.push(userObj)
                localStorage.setItem('Usuários', JSON.stringify(userVetor))
                alert('Cadastro feito com sucesso!')
                location.href="../html/perfil.html"
                id = userVetor.length - 1
                localStorage.setItem('UserID', JSON.stringify(id))
            }else{
                alert("Você precisa ser maior de idade!")
            }

        }else{
            alert(`Já existe um usuário com esse nome`)
        }
}
function Login(){
    userVetor = JSON.parse(localStorage.getItem('Usuários'))
    excluidos = JSON.parse(localStorage.getItem('Excluidos'))
    logado = false
    fora = false

    loginObj = {
        nome: document.getElementById('usernameLogin').value,
        senha: document.getElementById('senhaLogin').value
    }

    if(userVetor == null) {
        alert('Usuário não cadastrado!')
    } else {
        for(n = 0; n < userVetor.length; n++){
            if(loginObj.nome == userVetor[n].nome) {
                id = n
                logado = true
                localStorage.setItem('UserID', JSON.stringify(id))
                break
            }
        }

        if(excluidos.includes(id)){
            fora = true
        }

        if(logado && !fora) {
            if(loginObj.senha == userVetor[id].senha) {
                alert('Login feito com sucesso')
                location.href="./html/perfil.html"
            } else {
                
                alert('Senha incorreta!')
            }
        } else if (logado && fora){
            alert('Este usuário excluiu sua conta')
        }
        if (!logado){
            alert('Usuário não encontrado')
        }
    }  
}

function RecebePlantas(){

    userVetor = JSON.parse(localStorage.getItem('Usuários'))
    id = JSON.parse(localStorage.getItem('UserID'))

    plantasObj = {
        nomePlanta: document.getElementById("nomePlanta").value,
        tamanho: document.getElementById("TamanhoPlanta").value,
        qntdRegar: document.getElementById("QntdRegar").value

    }
    
        userVetor[id].plantas.push(plantasObj)
        localStorage.setItem('Usuários', JSON.stringify(userVetor))
        alert('Cadastro feito com sucesso!')
        MostraPlantas()
}

function MostraPlantas(){
    
    id = JSON.parse(localStorage.getItem('UserID'))
    userVetor = JSON.parse(localStorage.getItem('Usuários'))

    lista = ''

    for(l = 0; l < userVetor[id].plantas.length; l++){
        lista += `Nome da ${l+1}° planta: \n\n${userVetor[id].plantas[l].nomePlanta}
            \nTamanho: ${userVetor[id].plantas[l].tamanho} cm
            \nRegadas diárias: ${userVetor[id].plantas[l].qntdRegar} vezes ao dia\n\n\n`  
    } 

    document.getElementById('plantasLista').innerText = lista;
}

function PerfilInfo(){
    userVetor = JSON.parse(localStorage.getItem('Usuários'))
    id = JSON.parse(localStorage.getItem('UserID'))
    userName = userVetor[id].nome
    IdadeUser = userVetor[id].Idade

    document.getElementById('userName').innerText = `Perfil de ${userName}`

    for(l = 0; l < userVetor[id].plantas.length; l++){
        lista += `Nome da planta: ${userVetor[id].plantas[l].nomePlanta}
            \nTamanho: ${userVetor[id].plantas[l].tamanho} cm
            \nRegadas diárias: ${userVetor[id].plantas[l].qntdRegar} vezes ao dia\n\n\n`  
    } 
    document.getElementById('plantasLista').innerText = lista;
}

function Logout(){
    localStorage.setItem('UserID', JSON.stringify(-1))
}

function ExcluirPlanta(){
    userVetor = JSON.parse(localStorage.getItem('Usuários'))
    id = JSON.parse(localStorage.getItem('UserID'))
    nome = prompt('Digite o nome da planta que deseja excluir da lista:')
    repetido = false

    for(p = 0; p < userVetor[id].plantas.length; p++) {
        if(nome == userVetor[id].plantas[p].nomePlanta){
            userVetor[id].plantas.splice(p, 1)
            localStorage.setItem('Usuários', JSON.stringify(userVetor))
            alert(`${nome} foi removido com sucesso`)
            repetido = true
            break
        }
    }

    if(!repetido) {
        alert('Essa planta não está na lista!')
    }
    MostraPlantas()
}

function EditarPlanta(){
    userVetor = JSON.parse(localStorage.getItem('Usuários'))
    id = JSON.parse(localStorage.getItem('UserID'))
    nome = prompt('Digite o nome da planta que deseja edita da lista:')
    repetido = false

    for(p = 0; p < userVetor[id].plantas.length; p++) {
        if(nome == userVetor[id].plantas[p].nomePlanta){
            localStorage.setItem('Usuários', JSON.stringify(userVetor))
            index = p
            repetido = true
            break
        }
    }

    if(!repetido) {
        alert('Essa planta não está na lista!')
    } else {
        opcao = Number(prompt('Qual dado você quer digitar? Reponda com os seguintes números: \n1 - Nome\n2 - Altura\n3 - Quantas vezes é regado por dia'))
        switch(opcao){
            case 1:
                userVetor[id].plantas[index].nomePlanta = prompt('Digite um novo nome para a planta:')
                break
            case 2:
                userVetor[id].plantas[index].tamanho = Number(prompt('Digite uma nova altura para a planta:'))
                break
            case 3:
                userVetor[id].plantas[index].qntdRegar = Number(prompt('Quantas vezes você está regando esta planta por dia?'))
                break
            default:
                alert('Opção inválida!')
        }
    }
    localStorage.setItem('Usuários', JSON.stringify(userVetor))
    MostraPlantas()
}

function ExcluirConta(){
    id = JSON.parse(localStorage.getItem('UserID'))
    alert('Conta excluida com sucesso!')

    excluidos = JSON.parse(localStorage.getItem('Excluidos'))
    if(excluidos == null) {
        excluidos = []
    }
    excluidos.push(id)
    localStorage.setItem('Excluidos', JSON.stringify(excluidos))
}