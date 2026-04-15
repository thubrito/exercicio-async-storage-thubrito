# Exercícios — AsyncStorage
---

## Como usar esta lista

Cada exercício tem um nível de dificuldade indicado:

| Símbolo | Nível |
|---------|-------|
| 🟢 | Iniciante — conceito único, sem dependências |
| 🟡 | Intermediário — combina dois ou mais conceitos |
| 🔴 | Avançado — lógica mais complexa, TypeScript obrigatório |

**Regra geral para todos os exercícios:**
- TypeScript obrigatório (sem `any` sem justificativa)
- Sempre use `try/catch` em chamadas ao AsyncStorage
- Sempre verifique `if (raw !== null)` antes de `JSON.parse`
- Centralize chaves em um arquivo `storageKeys.ts`

---

## Exercício 1 — Contador de cliques persistente 🟢

**Objetivo:** entender o ciclo básico de leitura e escrita.

Crie uma tela com um botão **"Cliquei!"** e um número que mostra quantas vezes ele foi pressionado. O número deve persistir mesmo depois de fechar e reabrir o app.

**Requisitos:**
- Ao abrir o app, ler o valor salvo no AsyncStorage
- A cada clique, incrementar e salvar imediatamente
- Exibir um botão **"Zerar"** que apaga o contador

**Restrições:**
- Não use `clear()` para zerar — use `removeItem`
- Mostre `ActivityIndicator` enquanto carrega o valor inicial

**Dica de estrutura:**
```ts
// Ao montar o componente
const raw = await AsyncStorage.getItem(STORAGE_KEYS.CONTADOR);
const atual = raw !== null ? JSON.parse(raw) : 0;
```

---

## Exercício 2 — Salvar rascunho de texto 🟢

**Objetivo:** entender persistência contínua (autosave).

Crie uma tela com um `TextInput` de várias linhas. Cada vez que o usuário digitar algo, o texto deve ser salvo automaticamente no AsyncStorage. Ao reabrir o app, o último rascunho aparece.

**Requisitos:**
- Salvar no `onChangeText` (a cada tecla)
- Carregar o rascunho ao abrir a tela
- Exibir a data/hora do último salvamento
- Botão **"Apagar rascunho"** que limpa o texto e remove a chave

**Extensão opcional:**
Adicione um debounce de 500ms no salvamento para não chamar `setItem` em cada tecla individualmente.

---

## Exercício 3 — Perfil do usuário com JSON 🟢

**Objetivo:** praticar `JSON.stringify` e `JSON.parse` com objetos.

Crie um formulário com três campos: **Nome**, **E-mail** e **Idade**. Ao pressionar **"Salvar perfil"**, armazene o objeto inteiro em uma única chave. Na abertura do app, preencha os campos com os dados salvos.

**Requisitos:**
- Salvar como um único objeto `{ nome, email, idade }` em uma chave
- Ao carregar, verificar `null` antes de parsear
- Exibir uma mensagem **"Perfil carregado do dispositivo"** quando houver dados salvos
- Botão **"Limpar perfil"** que apaga os dados e reseta o formulário

**Ponto de atenção:**
```ts
// ❌ Errado — salva '[object Object]'
await AsyncStorage.setItem('perfil', { nome, email, idade });

// ✅ Correto
await AsyncStorage.setItem('perfil', JSON.stringify({ nome, email, idade }));
```

---

## Exercício 4 — Lista de tarefas offline 🟡

**Objetivo:** persistir um array e gerenciar itens individualmente.

Crie um app de tarefas (to-do list) onde as tarefas persistem entre sessões. O usuário pode adicionar, marcar como concluída e deletar tarefas.

**Estrutura de uma tarefa:**
```ts
interface Tarefa {
  id: string;        // use Date.now().toString()
  texto: string;
  concluida: boolean;
  criadaEm: string;  // ISO date string
}
```

**Requisitos:**
- Armazenar o array de tarefas como JSON em uma única chave
- Ao adicionar ou deletar, atualizar o array inteiro no storage
- Mostrar contador: `"3 de 5 concluídas"`
- Botão **"Limpar concluídas"** que remove apenas as tarefas com `concluida: true`

**Cuidado com a armadilha:**
Atualizar o estado React e o storage em ordem correta — atualize o storage **após** confirmar que a operação funcionou.

---

## Exercício 5 — Histórico de buscas 🟡

**Objetivo:** gerenciar um array com tamanho máximo.

Crie uma barra de busca que salva os últimos **5 termos pesquisados**. Ao digitar no campo e pressionar buscar, o termo é adicionado ao histórico. Termos repetidos não devem aparecer duplicados.

**Requisitos:**
- Máximo de 5 itens no histórico (o mais antigo sai ao adicionar o sexto)
- Sem duplicatas — se o termo já existe, mova-o para o topo
- Ao pressionar um item do histórico, preencher o campo de busca
- Botão **"Limpar histórico"** individual por item (deslizar ou botão ×)

**Lógica sugerida para adicionar:**
```ts
const novoHistorico = [
  termoBuscado,
  ...historicoAtual.filter(t => t !== termoBuscado)
].slice(0, 5);
```

---

## Exercício 6 — Onboarding que aparece só uma vez 🟡

**Objetivo:** usar AsyncStorage para controlar fluxo de navegação.

Crie um fluxo de onboarding com 3 telas (slides com texto e imagem simples). Na primeira abertura do app, o usuário vê o onboarding. Nas próximas vezes, vai direto para a tela principal.

**Requisitos:**
- Ao completar o onboarding, salvar `onboardingFeito: true`
- Na inicialização, verificar a flag antes de decidir qual tela mostrar
- Botão **"Pular"** que também marca como feito e vai para o início
- Na tela principal, um botão escondido **"Ver onboarding novamente"** (para testes) que reseta a flag

**Dica de estrutura:**
```ts
// Em App.tsx, antes de renderizar qualquer tela
const feito = await carregarDado(STORAGE_KEYS.ONBOARDING, false);
setTelaInicial(feito ? 'home' : 'onboarding');
```

---

## Exercício 7 — Custom Hook: `useListaPersistente` 🔴

**Objetivo:** criar um hook genérico reutilizável com TypeScript avançado.

Implemente um hook `useListaPersistente<T>` que gerencia uma lista de itens persistida no AsyncStorage.

**Assinatura esperada:**
```ts
function useListaPersistente<T extends { id: string }>(
  chave: string
): {
  itens: T[];
  adicionar: (item: T) => Promise<void>;
  remover: (id: string) => Promise<void>;
  atualizar: (id: string, mudancas: Partial<T>) => Promise<void>;
  limpar: () => Promise<void>;
  carregando: boolean;
}
```

**Requisitos:**
- Genérico — funciona para qualquer tipo que tenha `id: string`
- `atualizar` deve fazer merge parcial (não substituir o objeto inteiro)
- Todas as operações devem sincronizar estado React e storage atomicamente
- Escreva pelo menos 4 testes para o hook usando `renderHook` do Testing Library

**Exemplo de uso:**
```ts
const { itens, adicionar, remover } = useListaPersistente<Tarefa>('@App:tarefas');
```

---

## Exercício 8 — Migração de dados 🔴

**Objetivo:** lidar com dados legados e evolução do schema.

Simule um cenário onde o formato dos dados mudou entre versões do app:

- **Versão 1** (antiga): `{ nome: string, tema: string }`
- **Versão 2** (nova): `{ nome: string, tema: string, idioma: string, versaoSchema: number }`

Ao carregar os dados, detecte se são do formato antigo (sem `versaoSchema`) e faça a migração adicionando os campos faltantes com valores padrão.

**Requisitos:**
- Função `migrarSeNecessario()` chamada na inicialização do app
- Após migrar, salvar os dados já no novo formato
- Nunca perder os dados que o usuário já tinha
- Escreva um teste que simula carregar dados no formato antigo e verifica que a migração acontece corretamente

**Dica:**
```ts
const VERSAO_SCHEMA_ATUAL = 2;

async function migrarSeNecessario() {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.PREFERENCIAS);
  if (raw === null) return; // app novo, sem dados legados

  const dados = JSON.parse(raw);
  if (!dados.versaoSchema || dados.versaoSchema < VERSAO_SCHEMA_ATUAL) {
    // aplicar migração...
  }
}
```

---

## Exercício 9 — Cache com expiração 🔴

**Objetivo:** implementar lógica de TTL (time to live) sobre o AsyncStorage.

Crie um serviço de cache genérico que armazena dados com tempo de expiração. Útil para cachear respostas de API localmente.

**Interface esperada:**
```ts
interface ItemCache<T> {
  valor: T;
  expiraEm: number; // timestamp Unix em ms
}

async function salvarCache<T>(chave: string, valor: T, ttlMs: number): Promise<void>
async function lerCache<T>(chave: string): Promise<T | null>
// retorna null se não existe OU se expirou
```

**Requisitos:**
- `salvarCache` armazena o valor junto com o timestamp de expiração
- `lerCache` verifica se o dado expirou antes de retornar
  - Se expirou: remove a chave e retorna `null`
  - Se válido: retorna o valor (sem o wrapper de metadados)
- Função `limparCacheExpirado()` que percorre todas as chaves e remove as expiradas
- Escreva testes que usem `jest.useFakeTimers()` para simular passagem do tempo

**Exemplo de uso:**
```ts
// Cacheia por 5 minutos
await salvarCache('@App:clima', { temp: 23, cidade: 'SP' }, 5 * 60 * 1000);

// 3 minutos depois → retorna o dado
const clima = await lerCache('@App:clima'); // { temp: 23, cidade: 'SP' }

// 6 minutos depois → expirou
const clima2 = await lerCache('@App:clima'); // null
```

---

## Exercício 10 — Sincronização otimista com rollback 🔴

**Objetivo:** implementar o padrão "optimistic update" com AsyncStorage como fonte da verdade local.

Crie uma tela de **configurações de conta** que simula salvar dados em uma API remota. Use o padrão de atualização otimista: atualize a UI e o storage imediatamente, sem esperar a API. Se a API falhar, reverta para o estado anterior.

**Fluxo esperado:**
1. Usuário altera uma configuração (ex: notificações ativadas)
2. UI e storage atualizam **imediatamente** (sem loading)
3. Requisição para a API é feita em background
4. Se a API **retornar sucesso**: nada muda (já estava atualizado)
5. Se a API **retornar erro**: reverter UI e storage para o valor anterior + exibir toast de erro

**Requisitos:**
- Salvar o estado anterior antes de atualizar (para o rollback)
- Simule a API com uma função que falha aleatoriamente 30% das vezes
- Exibir feedback visual diferente para: salvando, salvo, erro com rollback
- Escreva testes para os três cenários: sucesso, falha com rollback, falha no storage

**Estrutura sugerida:**
```ts
async function atualizarComRollback<T>(
  chave: string,
  novoValor: T,
  api: () => Promise<void>,
  onRollback: (valorAnterior: T) => void
): Promise<void> {
  const valorAnterior = await carregarDado(chave, novoValor);
  await salvarDado(chave, novoValor); // salva otimisticamente

  try {
    await api();
  } catch {
    await salvarDado(chave, valorAnterior); // reverte
    onRollback(valorAnterior);
  }
}
```

---# exercicios-async-storage
