# Monitor de arquivos `.DEC`

Este script monitora uma pasta de entrada, identifica novos arquivos `.DEC`, extrai os dados no formato `Campo: valor`, gera um PDF individual por contribuinte e salva/atualiza um banco de dados editável em JSON.

## Como executar

```bash
pnpm dec:monitor
```

Processamento único (sem ficar monitorando):

```bash
pnpm dec:process-once
```

## Pastas e arquivos padrão

- Pasta monitorada: `./entrada_dec`
- PDFs gerados: `./saida_pdf`
- Banco editável: `./dados_contribuintes.json`

## Regras

- O nome do PDF é o CPF com 11 dígitos (`00883004801.pdf`).
- Se o CPF não estiver disponível no arquivo, o script usa nome alternativo `cpf_invalido_<timestamp>.pdf`.
- Campos não informados são gravados como `não informado`.

## Formato esperado do `.DEC`

O parser é baseado em linhas `chave: valor`. Exemplo:

```txt
Nome: IVETE PEREIRA MANCINI
CPF: 008.830.048-01
Data de nascimento: 20/10/1960
Título de eleitor: não informado
Tipo de logradouro: Rua
Logradouro: Xavier de Toledo
Número: 393
Complemento: não informado
Bairro: Pauliceia
CEP: 09692-030
Município: São Bernardo do Campo
UF: SP
Código do município (IRPF): 7075
Código do país: 105 (Brasil)
...
```

## Banco de dados editável

O arquivo `dados_contribuintes.json` é um array JSON com um registro por contribuinte/processamento. Você pode editar manualmente em qualquer editor de texto.
