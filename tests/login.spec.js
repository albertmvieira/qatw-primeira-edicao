import { test, expect } from '@playwright/test';

import { obterCodigo2FA } from '../support/db';
import { LoginPage } from '../pages/LoginPage';
import { DashPage } from '../pages/DashPage';
import { cleanJobs, getJob } from '../support/redis';

test('Não deve logar quando o código de autenticacão é inválido', async ({ page }) => {
  const loginPage = new LoginPage(page)

  const usuario = {
    cpf: '00000014141',
    senha: '147258'
  }
  
  await loginPage.acessaPagina()
  await loginPage.informaCpf(usuario.cpf)
  await loginPage.informaSenha(usuario.senha)
  await loginPage.informe2FA('123456')

  await expect(page.locator('span')).toContainText('Código inválido. Por favor, tente novamente.');
});

test('Deve acessar a conta do usuário - pegando o código de confirmação do BD Postgress', async ({ page }) => {

  const loginPage = new LoginPage(page)
  const dashPage = new DashPage(page)
  
  const usuario = {
    cpf: '00000014141',
    senha: '147258'
  }
  
  await loginPage.acessaPagina()
  await loginPage.informaCpf(usuario.cpf)
  await loginPage.informaSenha(usuario.senha)

  await page.getByRole('heading', { name: 'Verificação em duas etapas' }).waitFor({timeout: 3000}); //Espera o elemento aparecer na tela até 3 segundos
  // await page.waitForTimeout(3000) //Não é uma boa prática, mas foi uma solução temporária. Funciona como thread.sleep

  const codigo = await obterCodigo2FA(usuario.cpf)

  await loginPage.informe2FA(codigo)

  //inserido await antes do expect para ativar e usar o timeout default de 5000ms do Playwright
  await expect(await dashPage.obterSaldo()).toHaveText('R$ 5.000,00')
  
});

test('Deve acessar a conta do usuário - Lendo o código de confirmação da fila do Redis', async ({ page }) => {

  const loginPage = new LoginPage(page)
  const dashPage = new DashPage(page)
  
  const usuario = {
    cpf: '00000014141',
    senha: '147258'
  }

  await cleanJobs()
  
  await loginPage.acessaPagina()
  await loginPage.informaCpf(usuario.cpf)
  await loginPage.informaSenha(usuario.senha)

  await page.getByRole('heading', { name: 'Verificação em duas etapas' }).waitFor({timeout: 3000}); //Espera o elemento aparecer na tela até 3 segundos
  // await page.waitForTimeout(3000) //Não é uma boa prática, mas foi uma solução temporária. Funciona como thread.sleep

  //const codigo = await obterCodigo2FA(usuario.cpf)
  const codigo = await getJob()

  await loginPage.informe2FA(codigo)

  //inserido await antes do expect para ativar e usar o timeout default de 5000ms do Playwright
  await expect(await dashPage.obterSaldo()).toHaveText('R$ 5.000,00')
  
});