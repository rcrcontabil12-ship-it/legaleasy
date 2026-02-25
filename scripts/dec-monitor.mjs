import { mkdir, readFile, readdir, stat, watch, writeFile } from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_CONFIG = {
  watchDir: path.resolve(process.cwd(), 'entrada_dec'),
  outputDir: path.resolve(process.cwd(), 'saida_pdf'),
  dbFile: path.resolve(process.cwd(), 'dados_contribuintes.json'),
  pollIntervalMs: 3000,
};

const FIELD_ALIASES = {
  nome: ['nome'],
  cpf: ['cpf'],
  dataNascimento: ['data de nascimento'],
  tituloEleitor: ['título de eleitor', 'titulo de eleitor'],
  tipoLogradouro: ['tipo de logradouro'],
  logradouro: ['logradouro'],
  numero: ['número', 'numero'],
  complemento: ['complemento'],
  bairro: ['bairro'],
  cep: ['cep'],
  municipio: ['município', 'municipio'],
  uf: ['uf'],
  codigoMunicipioIrpf: ['código do município (irpf)', 'codigo do municipio (irpf)'],
  codigoPais: ['código do país', 'codigo do pais'],
  email: ['e-mail', 'email'],
  telefoneFixo: ['telefone (fixo)', 'telefone fixo'],
  celular: ['celular'],
  possuiConjuge: ['possui cônjuge (indicador)', 'possui conjuge (indicador)'],
  cpfConjuge: ['cpf do cônjuge', 'cpf do conjuge'],
  codigoOcupacao: ['código da ocupação', 'codigo da ocupacao'],
  codigoNaturezaOcupacao: ['código da natureza da ocupação', 'codigo da natureza da ocupacao'],
  declaracaoCompleta: ['declaração completa (indicador)', 'declaracao completa (indicador)'],
  retificadora: ['retificadora'],
  declaracaoGerada: ['declaração gerada', 'declaracao gerada'],
  mudouEndereco: ['houve mudança de endereço', 'houve mudanca de endereco'],
  tipoDeclaracao: ['tipo de declaração', 'tipo de declaracao'],
  prePreenchida: ['pré-preenchida (indicador)', 'pre-preenchida (indicador)'],
  quantidadeQuotas: ['quantidade de quotas'],
  doencaGraveDeficiencia: ['doença grave/deficiência (indicador)', 'doenca grave/deficiencia (indicador)'],
  banco: ['banco'],
  agencia: ['agência', 'agencia'],
  tipoConta: ['tipo de conta'],
  conta: ['conta'],
  digitoConta: ['dígito da conta', 'digito da conta'],
  debitoAutomatico: ['débito automático', 'debito automatico'],
  debitoDesdePrimeiraQuota: ['débito automático desde a 1ª quota', 'debito automatico desde a 1a quota'],
  cpfResponsavelDeclaracao: ['cpf do responsável pela declaração', 'cpf do responsavel pela declaracao'],
  fontePagadoraCnpj: ['fonte pagadora principal (cnpj)'],
  reciboUltimaDeclaracao: ['recibo da última declaração do ano anterior (campo técnico)', 'recibo da ultima declaracao do ano anterior (campo tecnico)'],
  dataPrimeiroDiaUtilPosEntrega: ['data (campo técnico “1º dia útil pós-entrega”)', 'data (campo tecnico “1º dia util pos-entrega”)'],
  pisPasepNit: ['pis/pasep (nit)'],
  cpfProcurador: ['cpf do procurador'],
  registroProfissional: ['registro profissional'],
  numeroProcessoDigital: ['número de processo digital', 'numero de processo digital'],
};

const EMPTY_VALUE = 'não informado';

const normalize = (value) =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();

const digitsOnly = (value) => value.replace(/\D/g, '');

function formatCpfForFilename(cpf) {
  const digits = digitsOnly(cpf);
  return digits.length === 11 ? digits : `cpf_invalido_${Date.now()}`;
}

function parseKeyValueText(content) {
  const map = {};
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    const colonIndex = line.indexOf(':');
    if (colonIndex <= 0) continue;
    const key = normalize(line.slice(0, colonIndex));
    const value = line.slice(colonIndex + 1).trim();
    if (key) map[key] = value || EMPTY_VALUE;
  }
  return map;
}

function extractRecord(content, sourceFile) {
  const kv = parseKeyValueText(content);
  const pick = (aliases) => {
    for (const alias of aliases) {
      const found = kv[normalize(alias)];
      if (found && found.length > 0) return found;
    }
    return EMPTY_VALUE;
  };

  const record = {
    nome: pick(FIELD_ALIASES.nome),
    cpf: pick(FIELD_ALIASES.cpf),
    dataNascimento: pick(FIELD_ALIASES.dataNascimento),
    tituloEleitor: pick(FIELD_ALIASES.tituloEleitor),
    tipoLogradouro: pick(FIELD_ALIASES.tipoLogradouro),
    logradouro: pick(FIELD_ALIASES.logradouro),
    numero: pick(FIELD_ALIASES.numero),
    complemento: pick(FIELD_ALIASES.complemento),
    bairro: pick(FIELD_ALIASES.bairro),
    cep: pick(FIELD_ALIASES.cep),
    municipio: pick(FIELD_ALIASES.municipio),
    uf: pick(FIELD_ALIASES.uf),
    codigoMunicipioIrpf: pick(FIELD_ALIASES.codigoMunicipioIrpf),
    codigoPais: pick(FIELD_ALIASES.codigoPais),
    email: pick(FIELD_ALIASES.email),
    telefoneFixo: pick(FIELD_ALIASES.telefoneFixo),
    celular: pick(FIELD_ALIASES.celular),
    possuiConjuge: pick(FIELD_ALIASES.possuiConjuge),
    cpfConjuge: pick(FIELD_ALIASES.cpfConjuge),
    codigoOcupacao: pick(FIELD_ALIASES.codigoOcupacao),
    codigoNaturezaOcupacao: pick(FIELD_ALIASES.codigoNaturezaOcupacao),
    declaracaoCompleta: pick(FIELD_ALIASES.declaracaoCompleta),
    retificadora: pick(FIELD_ALIASES.retificadora),
    declaracaoGerada: pick(FIELD_ALIASES.declaracaoGerada),
    mudouEndereco: pick(FIELD_ALIASES.mudouEndereco),
    tipoDeclaracao: pick(FIELD_ALIASES.tipoDeclaracao),
    prePreenchida: pick(FIELD_ALIASES.prePreenchida),
    quantidadeQuotas: pick(FIELD_ALIASES.quantidadeQuotas),
    doencaGraveDeficiencia: pick(FIELD_ALIASES.doencaGraveDeficiencia),
    banco: pick(FIELD_ALIASES.banco),
    agencia: pick(FIELD_ALIASES.agencia),
    tipoConta: pick(FIELD_ALIASES.tipoConta),
    conta: pick(FIELD_ALIASES.conta),
    digitoConta: pick(FIELD_ALIASES.digitoConta),
    debitoAutomatico: pick(FIELD_ALIASES.debitoAutomatico),
    debitoDesdePrimeiraQuota: pick(FIELD_ALIASES.debitoDesdePrimeiraQuota),
    cpfResponsavelDeclaracao: pick(FIELD_ALIASES.cpfResponsavelDeclaracao),
    fontePagadoraCnpj: pick(FIELD_ALIASES.fontePagadoraCnpj),
    reciboUltimaDeclaracao: pick(FIELD_ALIASES.reciboUltimaDeclaracao),
    dataPrimeiroDiaUtilPosEntrega: pick(FIELD_ALIASES.dataPrimeiroDiaUtilPosEntrega),
    pisPasepNit: pick(FIELD_ALIASES.pisPasepNit),
    cpfProcurador: pick(FIELD_ALIASES.cpfProcurador),
    registroProfissional: pick(FIELD_ALIASES.registroProfissional),
    numeroProcessoDigital: pick(FIELD_ALIASES.numeroProcessoDigital),
    arquivoOrigem: sourceFile,
    processadoEm: new Date().toISOString(),
  };

  if (record.cpf === EMPTY_VALUE) {
    const cpfMatch = content.match(/\b\d{3}\.\d{3}\.\d{3}-\d{2}\b|\b\d{11}\b/);
    if (cpfMatch) record.cpf = cpfMatch[0];
  }

  return record;
}

const pdfEscape = (value) => value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

async function generatePdf(record, outputPath) {
  const lines = [
    'Ficha de Identificação do Contribuinte',
    '',
    `Nome: ${record.nome}`,
    `CPF: ${record.cpf}`,
    `Data de nascimento: ${record.dataNascimento}`,
    `Título de eleitor: ${record.tituloEleitor}`,
    `Endereço: ${record.tipoLogradouro} ${record.logradouro}, ${record.numero} - ${record.bairro}`,
    `Complemento: ${record.complemento}`,
    `CEP/Município/UF: ${record.cep} - ${record.municipio}/${record.uf}`,
    `Contato: Email=${record.email}, Fixo=${record.telefoneFixo}, Celular=${record.celular}`,
    `Dados bancários: Banco ${record.banco}, Agência ${record.agencia}, Conta ${record.conta}-${record.digitoConta}`,
    `Declaração: Tipo=${record.tipoDeclaracao}, Retificadora=${record.retificadora}, Pré-preenchida=${record.prePreenchida}`,
    `Processado em: ${record.processadoEm}`,
  ];

  const textOps = lines.map((line, index) => `1 0 0 1 50 ${760 - index * 18} Tm (${pdfEscape(line)}) Tj`).join('\n');
  const contentStream = `BT\n/F1 11 Tf\n${textOps}\nET`;

  const objects = [
    '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
    '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj',
    '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj',
    `4 0 obj << /Length ${Buffer.byteLength(contentStream, 'utf8')} >> stream\n${contentStream}\nendstream endobj`,
    '5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj',
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  for (const objectDef of objects) {
    offsets.push(Buffer.byteLength(pdf, 'utf8'));
    pdf += `${objectDef}\n`;
  }

  const xrefStart = Buffer.byteLength(pdf, 'utf8');
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i < offsets.length; i += 1) {
    pdf += `${offsets[i].toString().padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  await writeFile(outputPath, pdf, 'utf8');
}

async function loadDb(dbFile) {
  try {
    const raw = await readFile(dbFile, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function saveDb(dbFile, records) {
  await writeFile(dbFile, JSON.stringify(records, null, 2), 'utf8');
}

async function processDecFile(filePath, config) {
  const content = await readFile(filePath, 'utf8');
  const record = extractRecord(content, path.basename(filePath));
  const cpfForFile = formatCpfForFilename(record.cpf);

  await mkdir(config.outputDir, { recursive: true });
  const pdfPath = path.join(config.outputDir, `${cpfForFile}.pdf`);
  await generatePdf(record, pdfPath);

  const db = await loadDb(config.dbFile);
  const deduplicated = db.filter((item) => !(item.cpf === record.cpf && item.arquivoOrigem === record.arquivoOrigem));
  deduplicated.push(record);
  await saveDb(config.dbFile, deduplicated);

  console.log(`[OK] Arquivo processado: ${path.basename(filePath)} -> ${path.basename(pdfPath)}`);
}

async function listDecFiles(dir) {
  const entries = await readdir(dir);
  const files = await Promise.all(
    entries
      .filter((name) => name.toLowerCase().endsWith('.dec'))
      .map(async (name) => {
        const fullPath = path.join(dir, name);
        const fileStat = await stat(fullPath);
        return fileStat.isFile() ? fullPath : null;
      }),
  );
  return files.filter(Boolean);
}

async function run() {
  const once = process.argv.includes('--once');
  const config = DEFAULT_CONFIG;

  await mkdir(config.watchDir, { recursive: true });
  await mkdir(config.outputDir, { recursive: true });

  const processedFiles = new Set();
  const processPendingFiles = async () => {
    const files = await listDecFiles(config.watchDir);
    for (const file of files) {
      if (processedFiles.has(file)) continue;
      try {
        await processDecFile(file, config);
        processedFiles.add(file);
      } catch (error) {
        console.error(`[ERRO] Falha ao processar ${path.basename(file)}:`, error);
      }
    }
  };

  await processPendingFiles();
  if (once) return;

  console.log(`[MONITOR] Aguardando arquivos .DEC em ${config.watchDir}`);

  watch(config.watchDir, async (_event, filename) => {
    if (!filename || !filename.toLowerCase().endsWith('.dec')) return;
    await processPendingFiles();
  });

  setInterval(async () => {
    await processPendingFiles();
  }, config.pollIntervalMs).unref();
}

run().catch((error) => {
  console.error('[FATAL]', error);
  process.exitCode = 1;
});
