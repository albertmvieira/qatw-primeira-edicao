import {Queue} from 'bullmq';

const connection = {
    host: 'paybank-redis',
    port: 6379
}

const queueName = 'twoFactorQueue'
const queue = new Queue(queueName, { connection })
let job

// Função que retorna o primeiro job da fila twoFactorQueue
// outra forma de criar função assíncrona async function getJob()
export const getJob = async () => {
    await queue.resume() //resume a fila
    const jobs = await queue.getJobs() //getJobs retorna um array de jobs
    console.log(jobs[0].data.code) // imprime o código do primeiro job da fila
    job = jobs[0].data.code
    return job // retorna o primeiro job da fila
}

export const cleanJobs = async () => {
    //await queue.drain() //drain esvazia a fila
    //PENDENTE criar validação para apagar a fila somente se não tiver jobs ativos
    await queue.obliterate({force:true}) // obliterate apaga a fila
}