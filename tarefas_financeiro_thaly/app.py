import os
import sqlite3
from datetime import date, datetime, timedelta

import pandas as pd
import plotly.express as px
import streamlit as st

# =========================
# Configurações iniciais
# =========================
st.set_page_config(page_title="Tarefas Financeiro Thaly", layout="wide")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
EXPORT_DIR = os.path.join(BASE_DIR, "exports")
DB_PATH = os.path.join(DATA_DIR, "tarefas_financeiro_thaly.db")

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(EXPORT_DIR, exist_ok=True)

STATUS_LIST = [
    "Pendente",
    "Em andamento",
    "Aguardando cliente",
    "Aguardando pagamento",
    "Resolvido",
    "Cancelado",
]

PRIORIDADES = ["Baixa", "Média", "Alta", "Urgente"]

DEPARTAMENTOS = [
    "Financeiro",
    "Fiscal",
    "Departamento Pessoal",
    "Contábil",
    "Legalização",
    "Atendimento",
    "Administrativo",
]


# =========================
# Utilitários
# =========================
def get_conn():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn


def hoje_iso():
    return date.today().isoformat()


def to_br_date(value):
    if value is None or value == "" or pd.isna(value):
        return ""
    try:
        return pd.to_datetime(value).strftime("%d/%m/%Y")
    except Exception:
        return ""


def parse_date_or_none(value):
    if not value:
        return None
    try:
        return pd.to_datetime(value).date().isoformat()
    except Exception:
        return None


def dias_atraso(data_venc, status):
    if not data_venc:
        return 0
    if status in ["Resolvido", "Cancelado"]:
        return 0
    try:
        d = pd.to_datetime(data_venc).date()
        diff = (date.today() - d).days
        return diff if diff > 0 else 0
    except Exception:
        return 0


def criar_tabelas_e_seed():
    conn = get_conn()
    cur = conn.cursor()

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            documento TEXT,
            email TEXT,
            telefone TEXT,
            status TEXT DEFAULT 'Ativo',
            observacoes TEXT,
            criado_em TEXT
        );
        """
    )

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS tarefas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            descricao TEXT,
            cliente_id INTEGER,
            departamento TEXT,
            responsavel TEXT,
            prioridade TEXT,
            status TEXT,
            data_criacao TEXT,
            data_vencimento TEXT,
            data_conclusao TEXT,
            observacoes TEXT,
            FOREIGN KEY (cliente_id) REFERENCES clientes(id)
        );
        """
    )

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS historico_tarefas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tarefa_id INTEGER,
            data_evento TEXT,
            usuario TEXT,
            acao TEXT,
            observacao TEXT,
            FOREIGN KEY (tarefa_id) REFERENCES tarefas(id)
        );
        """
    )

    # Dados de exemplo
    count_clientes = cur.execute("SELECT COUNT(*) FROM clientes").fetchone()[0]
    count_tarefas = cur.execute("SELECT COUNT(*) FROM tarefas").fetchone()[0]

    if count_clientes == 0:
        clientes_exemplo = [
            ("Loja Primavera LTDA", "12.345.678/0001-90", "financeiro@primavera.com", "(11) 99999-1111", "Ativo", "Cliente recorrente", hoje_iso()),
            ("Construtora Horizonte", "98.765.432/0001-11", "contato@horizonte.com", "(11) 99999-2222", "Ativo", "Prioridade em fiscal", hoje_iso()),
            ("Clínica Vida", "22.333.444/0001-55", "adm@clinicavida.com", "(11) 99999-3333", "Ativo", "", hoje_iso()),
        ]
        cur.executemany(
            """
            INSERT INTO clientes (nome, documento, email, telefone, status, observacoes, criado_em)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            clientes_exemplo,
        )

    if count_tarefas == 0:
        tarefas_exemplo = [
            ("Conciliação bancária março", "Revisar extratos", 1, "Financeiro", "Ana", "Alta", "Em andamento", hoje_iso(), (date.today() - timedelta(days=2)).isoformat(), None, "Aguardando comprovantes"),
            ("Fechamento folha abril", "Conferência e envio", 2, "Departamento Pessoal", "Carlos", "Urgente", "Pendente", hoje_iso(), date.today().isoformat(), None, ""),
            ("Envio guias fiscais", "DARF e DAS", 3, "Fiscal", "Bianca", "Média", "Aguardando cliente", hoje_iso(), (date.today() + timedelta(days=5)).isoformat(), None, "Cliente pediu revisão"),
            ("Atualização cadastral", "Junta comercial", 1, "Legalização", "Diego", "Baixa", "Resolvido", hoje_iso(), (date.today() - timedelta(days=10)).isoformat(), (date.today() - timedelta(days=1)).isoformat(), "Concluído com sucesso"),
        ]
        cur.executemany(
            """
            INSERT INTO tarefas (
                titulo, descricao, cliente_id, departamento, responsavel, prioridade, status,
                data_criacao, data_vencimento, data_conclusao, observacoes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            tarefas_exemplo,
        )

    conn.commit()
    conn.close()


def carregar_clientes():
    conn = get_conn()
    df = pd.read_sql_query("SELECT * FROM clientes ORDER BY nome", conn)
    conn.close()
    return df


def carregar_tarefas():
    conn = get_conn()
    query = """
    SELECT
        t.*,
        c.nome AS cliente_nome
    FROM tarefas t
    LEFT JOIN clientes c ON c.id = t.cliente_id
    ORDER BY t.id DESC
    """
    df = pd.read_sql_query(query, conn)
    conn.close()
    return df


def registrar_historico(tarefa_id, usuario, acao, observacao):
    conn = get_conn()
    conn.execute(
        """
        INSERT INTO historico_tarefas (tarefa_id, data_evento, usuario, acao, observacao)
        VALUES (?, ?, ?, ?, ?)
        """,
        (tarefa_id, datetime.now().isoformat(timespec="seconds"), usuario, acao, observacao),
    )
    conn.commit()
    conn.close()


# =========================
# Estilo
# =========================
st.markdown(
    """
<style>
.main-title {font-size: 2rem; font-weight: 700; margin-bottom: 0.2rem;}
.subtitle {color: #555; margin-bottom: 1.2rem;}
.metric-card {
    background-color: #f2f2f2;
    border-radius: 12px;
    padding: 16px;
    border: 1px solid #e1e1e1;
    text-align: center;
}
.status-resolvido {color: #1a7f37; font-weight: 600;}
.status-atrasado {color: #b42318; font-weight: 600;}
.status-aguardando-cliente {color: #175cd3; font-weight: 600;}
.status-aguardando-pagamento {color: #b54708; font-weight: 600;}
</style>
""",
    unsafe_allow_html=True,
)

st.markdown('<div class="main-title">Tarefas Financeiro Thaly</div>', unsafe_allow_html=True)
st.markdown('<div class="subtitle">Painel de controle financeiro e tarefas internas</div>', unsafe_allow_html=True)

criar_tabelas_e_seed()

menu = st.sidebar.radio(
    "Menu",
    [
        "📊 Dashboard",
        "✅ Tarefas",
        "➕ Nova Tarefa",
        "👥 Clientes",
        "⚠️ Atrasadas",
        "📅 Vencimentos",
        "📈 Relatórios",
        "⚙️ Configurações",
    ],
)

# Base data
df_clientes = carregar_clientes()
df_tarefas = carregar_tarefas()

# =========================
# Dashboard
# =========================
if menu == "📊 Dashboard":
    hoje = date.today()

    abertas = df_tarefas[~df_tarefas["status"].isin(["Resolvido", "Cancelado"])].shape[0]
    atrasadas = df_tarefas[
        (pd.to_datetime(df_tarefas["data_vencimento"], errors="coerce").dt.date < hoje)
        & (~df_tarefas["status"].isin(["Resolvido", "Cancelado"]))
    ].shape[0]
    vencem_hoje = df_tarefas[
        (pd.to_datetime(df_tarefas["data_vencimento"], errors="coerce").dt.date == hoje)
        & (~df_tarefas["status"].isin(["Resolvido", "Cancelado"]))
    ].shape[0]
    aguarda_cliente = df_tarefas[df_tarefas["status"] == "Aguardando cliente"].shape[0]
    aguarda_pagamento = df_tarefas[df_tarefas["status"] == "Aguardando pagamento"].shape[0]

    current_month = hoje.month
    current_year = hoje.year
    concluidas_mes = df_tarefas[
        (df_tarefas["status"] == "Resolvido")
        & (pd.to_datetime(df_tarefas["data_conclusao"], errors="coerce").dt.month == current_month)
        & (pd.to_datetime(df_tarefas["data_conclusao"], errors="coerce").dt.year == current_year)
    ].shape[0]

    cols = st.columns(6)
    metrics = [
        ("Abertas", abertas),
        ("Atrasadas", atrasadas),
        ("Vencem hoje", vencem_hoje),
        ("Aguardando cliente", aguarda_cliente),
        ("Aguardando pagamento", aguarda_pagamento),
        ("Resolvidas no mês", concluidas_mes),
    ]
    for c, (titulo, valor) in zip(cols, metrics):
        c.markdown(f'<div class="metric-card"><div>{titulo}</div><h2>{valor}</h2></div>', unsafe_allow_html=True)

    st.markdown("---")
    c1, c2 = st.columns(2)
    with c1:
        fig = px.pie(df_tarefas, names="status", title="Tarefas por status")
        st.plotly_chart(fig, use_container_width=True)
        fig = px.bar(df_tarefas.groupby("departamento", dropna=False).size().reset_index(name="qtd"), x="departamento", y="qtd", title="Tarefas por departamento")
        st.plotly_chart(fig, use_container_width=True)
        df_criadas = df_tarefas.copy()
        df_criadas["mes"] = pd.to_datetime(df_criadas["data_criacao"], errors="coerce").dt.to_period("M").astype(str)
        fig = px.line(df_criadas.groupby("mes", dropna=False).size().reset_index(name="qtd"), x="mes", y="qtd", markers=True, title="Evolução de tarefas criadas por mês")
        st.plotly_chart(fig, use_container_width=True)

    with c2:
        fig = px.bar(df_tarefas.groupby("responsavel", dropna=False).size().reset_index(name="qtd"), x="responsavel", y="qtd", title="Tarefas por responsável")
        st.plotly_chart(fig, use_container_width=True)
        fig = px.bar(df_tarefas.groupby("prioridade", dropna=False).size().reset_index(name="qtd"), x="prioridade", y="qtd", title="Tarefas por prioridade")
        st.plotly_chart(fig, use_container_width=True)
        df_concluidas = df_tarefas[df_tarefas["data_conclusao"].notna()].copy()
        df_concluidas["mes"] = pd.to_datetime(df_concluidas["data_conclusao"], errors="coerce").dt.to_period("M").astype(str)
        fig = px.line(df_concluidas.groupby("mes", dropna=False).size().reset_index(name="qtd"), x="mes", y="qtd", markers=True, title="Evolução de tarefas concluídas por mês")
        st.plotly_chart(fig, use_container_width=True)

elif menu == "✅ Tarefas":
    st.subheader("Tarefas")

    colf = st.columns(8)
    filtro_cliente = colf[0].selectbox("Cliente", ["Todos"] + df_clientes["nome"].fillna("").tolist())
    filtro_dep = colf[1].selectbox("Departamento", ["Todos"] + DEPARTAMENTOS)
    filtro_resp = colf[2].selectbox("Responsável", ["Todos"] + sorted(df_tarefas["responsavel"].dropna().unique().tolist()))
    filtro_status = colf[3].selectbox("Status", ["Todos"] + STATUS_LIST)
    filtro_prio = colf[4].selectbox("Prioridade", ["Todos"] + PRIORIDADES)
    data_ini = colf[5].date_input("Data inicial", value=date.today() - timedelta(days=30))
    data_fim = colf[6].date_input("Data final", value=date.today() + timedelta(days=30))
    apenas_atrasadas = colf[7].checkbox("Apenas atrasadas")

    dff = df_tarefas.copy()
    dff["data_venc"] = pd.to_datetime(dff["data_vencimento"], errors="coerce").dt.date

    if filtro_cliente != "Todos":
        dff = dff[dff["cliente_nome"] == filtro_cliente]
    if filtro_dep != "Todos":
        dff = dff[dff["departamento"] == filtro_dep]
    if filtro_resp != "Todos":
        dff = dff[dff["responsavel"] == filtro_resp]
    if filtro_status != "Todos":
        dff = dff[dff["status"] == filtro_status]
    if filtro_prio != "Todos":
        dff = dff[dff["prioridade"] == filtro_prio]

    dff = dff[(dff["data_venc"].isna()) | ((dff["data_venc"] >= data_ini) & (dff["data_venc"] <= data_fim))]

    if apenas_atrasadas:
        dff = dff[(dff["data_venc"] < date.today()) & (~dff["status"].isin(["Resolvido", "Cancelado"]))]

    dff["Dias em atraso"] = dff.apply(lambda x: dias_atraso(x.get("data_vencimento"), x.get("status")), axis=1)
    view = dff[["id", "cliente_nome", "titulo", "departamento", "responsavel", "prioridade", "status", "data_vencimento", "Dias em atraso", "observacoes"]].copy()
    view.columns = ["ID", "Cliente", "Título", "Departamento", "Responsável", "Prioridade", "Status", "Data de vencimento", "Dias em atraso", "Observações"]
    view["Data de vencimento"] = view["Data de vencimento"].apply(to_br_date)
    st.dataframe(view, use_container_width=True)

    st.markdown("### Atualizar status")
    ids = dff["id"].tolist()
    if ids:
        tarefa_id = st.selectbox("Selecione a tarefa", ids)
        atual = df_tarefas[df_tarefas["id"] == tarefa_id]["status"].iloc[0]
        novo_status = st.selectbox("Novo status", STATUS_LIST, index=STATUS_LIST.index(atual) if atual in STATUS_LIST else 0)
        usuario = st.text_input("Usuário", value="Sistema")
        obs = st.text_area("Observação da alteração")

        if st.button("Salvar status"):
            conn = get_conn()
            data_conclusao = date.today().isoformat() if novo_status == "Resolvido" else None
            conn.execute("UPDATE tarefas SET status = ?, data_conclusao = COALESCE(?, data_conclusao) WHERE id = ?", (novo_status, data_conclusao, tarefa_id))
            conn.commit()
            conn.close()

            registrar_historico(tarefa_id, usuario, "Alteração de status", f"{atual} -> {novo_status}. {obs}")
            st.success("Status atualizado com sucesso!")
            st.rerun()
    else:
        st.info("Nenhuma tarefa disponível com os filtros atuais.")

elif menu == "➕ Nova Tarefa":
    st.subheader("Nova Tarefa")
    with st.form("form_nova_tarefa"):
        cliente_map = {row["nome"]: row["id"] for _, row in df_clientes.iterrows()}
        cliente_nome = st.selectbox("Cliente", list(cliente_map.keys()) if cliente_map else ["Sem clientes"])
        titulo = st.text_input("Título")
        descricao = st.text_area("Descrição")
        departamento = st.selectbox("Departamento", DEPARTAMENTOS)
        responsavel = st.text_input("Responsável")
        prioridade = st.selectbox("Prioridade", PRIORIDADES)
        status = st.selectbox("Status", STATUS_LIST)
        data_venc = st.date_input("Data de vencimento", value=date.today() + timedelta(days=7))
        observacoes = st.text_area("Observações")
        submitted = st.form_submit_button("Cadastrar tarefa")

    if submitted:
        if not titulo.strip() or not cliente_map:
            st.error("Informe título e tenha ao menos um cliente cadastrado.")
        else:
            conn = get_conn()
            conn.execute(
                """
                INSERT INTO tarefas (titulo, descricao, cliente_id, departamento, responsavel, prioridade, status, data_criacao, data_vencimento, observacoes)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    titulo.strip(),
                    descricao,
                    cliente_map.get(cliente_nome),
                    departamento,
                    responsavel,
                    prioridade,
                    status,
                    hoje_iso(),
                    data_venc.isoformat(),
                    observacoes,
                ),
            )
            conn.commit()
            nova_id = conn.execute("SELECT last_insert_rowid()").fetchone()[0]
            conn.close()
            registrar_historico(nova_id, "Sistema", "Criação", "Tarefa criada")
            st.success("Tarefa cadastrada com sucesso!")

elif menu == "👥 Clientes":
    st.subheader("Clientes")
    with st.form("form_cliente"):
        nome = st.text_input("Nome")
        documento = st.text_input("Documento")
        email = st.text_input("E-mail")
        telefone = st.text_input("Telefone")
        status_c = st.selectbox("Status", ["Ativo", "Inativo"])
        observacoes = st.text_area("Observações")
        save_cli = st.form_submit_button("Cadastrar cliente")

    if save_cli:
        if not nome.strip():
            st.error("Nome é obrigatório.")
        else:
            conn = get_conn()
            conn.execute(
                "INSERT INTO clientes (nome, documento, email, telefone, status, observacoes, criado_em) VALUES (?, ?, ?, ?, ?, ?, ?)",
                (nome.strip(), documento, email, telefone, status_c, observacoes, hoje_iso()),
            )
            conn.commit()
            conn.close()
            st.success("Cliente cadastrado com sucesso!")
            st.rerun()

    st.markdown("### Lista de clientes")
    dfc = carregar_clientes()
    if not dfc.empty:
        dfv = dfc.copy()
        dfv["criado_em"] = dfv["criado_em"].apply(to_br_date)
        st.dataframe(dfv, use_container_width=True)

        cid = st.selectbox("Editar cliente", dfc["id"].tolist())
        atual = dfc[dfc["id"] == cid].iloc[0]
        with st.form("form_editar_cliente"):
            n_nome = st.text_input("Nome (edição)", value=atual.get("nome", ""))
            n_doc = st.text_input("Documento (edição)", value=atual.get("documento", "") or "")
            n_email = st.text_input("E-mail (edição)", value=atual.get("email", "") or "")
            n_tel = st.text_input("Telefone (edição)", value=atual.get("telefone", "") or "")
            n_status = st.selectbox("Status (edição)", ["Ativo", "Inativo"], index=0 if atual.get("status") == "Ativo" else 1)
            n_obs = st.text_area("Observações (edição)", value=atual.get("observacoes", "") or "")
            upd = st.form_submit_button("Salvar alterações")
        if upd:
            conn = get_conn()
            conn.execute(
                "UPDATE clientes SET nome=?, documento=?, email=?, telefone=?, status=?, observacoes=? WHERE id=?",
                (n_nome, n_doc, n_email, n_tel, n_status, n_obs, cid),
            )
            conn.commit()
            conn.close()
            st.success("Cliente atualizado.")
            st.rerun()

elif menu == "⚠️ Atrasadas":
    st.subheader("Tarefas atrasadas")
    dff = df_tarefas.copy()
    dff["dv"] = pd.to_datetime(dff["data_vencimento"], errors="coerce").dt.date
    dff = dff[(dff["dv"] < date.today()) & (~dff["status"].isin(["Resolvido", "Cancelado"]))].sort_values(by="dv")
    if dff.empty:
        st.success("Nenhuma tarefa atrasada.")
    else:
        dff["Dias em atraso"] = dff.apply(lambda x: dias_atraso(x.get("data_vencimento"), x.get("status")), axis=1)
        out = dff[["id", "cliente_nome", "titulo", "departamento", "responsavel", "status", "data_vencimento", "Dias em atraso"]].copy()
        out["data_vencimento"] = out["data_vencimento"].apply(to_br_date)
        st.dataframe(out, use_container_width=True)

elif menu == "📅 Vencimentos":
    st.subheader("Vencimentos")
    base = df_tarefas.copy()
    base["dv"] = pd.to_datetime(base["data_vencimento"], errors="coerce").dt.date
    base = base[~base["status"].isin(["Resolvido", "Cancelado"])]

    hoje = date.today()
    hoje_df = base[base["dv"] == hoje]
    d7 = base[(base["dv"] > hoje) & (base["dv"] <= hoje + timedelta(days=7))]
    d30 = base[(base["dv"] > hoje + timedelta(days=7)) & (base["dv"] <= hoje + timedelta(days=30))]

    st.markdown("#### Vencem hoje")
    st.dataframe(hoje_df[["id", "cliente_nome", "titulo", "responsavel", "status", "data_vencimento"]], use_container_width=True)
    st.markdown("#### Próximos 7 dias")
    st.dataframe(d7[["id", "cliente_nome", "titulo", "responsavel", "status", "data_vencimento"]], use_container_width=True)
    st.markdown("#### Próximos 30 dias")
    st.dataframe(d30[["id", "cliente_nome", "titulo", "responsavel", "status", "data_vencimento"]], use_container_width=True)

elif menu == "📈 Relatórios":
    st.subheader("Relatórios e Exportação")

    status_filter = st.multiselect("Status", STATUS_LIST, default=STATUS_LIST)
    dep_filter = st.multiselect("Departamento", DEPARTAMENTOS, default=DEPARTAMENTOS)

    dff = df_tarefas[df_tarefas["status"].isin(status_filter) & df_tarefas["departamento"].isin(dep_filter)].copy()
    dff["data_criacao"] = dff["data_criacao"].apply(to_br_date)
    dff["data_vencimento"] = dff["data_vencimento"].apply(to_br_date)
    dff["data_conclusao"] = dff["data_conclusao"].apply(to_br_date)

    st.dataframe(dff, use_container_width=True)

    if st.button("Gerar Excel"):
        nome_arq = f"tarefas_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
        caminho = os.path.join(EXPORT_DIR, nome_arq)
        dff.to_excel(caminho, index=False)
        st.success(f"Arquivo gerado em: {caminho}")

        with open(caminho, "rb") as f:
            st.download_button("Baixar Excel", data=f.read(), file_name=nome_arq)

elif menu == "⚙️ Configurações":
    st.subheader("Configurações")
    st.info("Versão inicial sem autenticação. Banco local SQLite e exportação em Excel habilitados.")
