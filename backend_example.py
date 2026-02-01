"""
Backend Python Flask para Legal Easy
Este é um exemplo de como integrar Python com o frontend React
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import json

app = Flask(__name__)
CORS(app)

# Dados de exemplo (em produção, use um banco de dados)
services = [
    {
        'id': 1,
        'title': 'Legalização de Empresas',
        'description': 'Constituição, alteração, extinção e regularização de sociedades.'
    },
    {
        'id': 2,
        'title': 'Certidões e Licenças',
        'description': 'Emissão de certidões negativas e obtenção de licenças municipais.'
    },
    {
        'id': 3,
        'title': 'Consultoria Tributária',
        'description': 'Assessoria para alterações tributárias e planejamento sucessório.'
    },
    {
        'id': 4,
        'title': 'Documentação para Licitações',
        'description': 'Orientação e preparo completo para processos licitatórios.'
    }
]

contacts = []

# Rotas da API

@app.route('/api/health', methods=['GET'])
def health():
    """Verifica se o servidor está funcionando"""
    return jsonify({'status': 'ok', 'timestamp': datetime.now().isoformat()})

@app.route('/api/services', methods=['GET'])
def get_services():
    """Retorna lista de serviços"""
    return jsonify(services)

@app.route('/api/services/<int:service_id>', methods=['GET'])
def get_service(service_id):
    """Retorna um serviço específico"""
    service = next((s for s in services if s['id'] == service_id), None)
    if service:
        return jsonify(service)
    return jsonify({'error': 'Serviço não encontrado'}), 404

@app.route('/api/contact', methods=['POST'])
def create_contact():
    """Cria um novo contato"""
    data = request.json
    
    # Validar dados
    if not data or 'name' not in data or 'email' not in data:
        return jsonify({'error': 'Nome e email são obrigatórios'}), 400
    
    contact = {
        'id': len(contacts) + 1,
        'name': data.get('name'),
        'email': data.get('email'),
        'phone': data.get('phone'),
        'message': data.get('message'),
        'created_at': datetime.now().isoformat()
    }
    
    contacts.append(contact)
    
    # Aqui você poderia:
    # - Salvar em um banco de dados
    # - Enviar um email
    # - Notificar o admin
    
    return jsonify({
        'success': True,
        'message': 'Contato recebido com sucesso',
        'contact': contact
    }), 201

@app.route('/api/contacts', methods=['GET'])
def get_contacts():
    """Retorna todos os contatos (apenas para admin)"""
    return jsonify(contacts)

@app.route('/api/contact/<int:contact_id>', methods=['GET'])
def get_contact(contact_id):
    """Retorna um contato específico"""
    contact = next((c for c in contacts if c['id'] == contact_id), None)
    if contact:
        return jsonify(contact)
    return jsonify({'error': 'Contato não encontrado'}), 404

@app.route('/api/contact/<int:contact_id>', methods=['DELETE'])
def delete_contact(contact_id):
    """Deleta um contato"""
    global contacts
    contacts = [c for c in contacts if c['id'] != contact_id]
    return jsonify({'success': True, 'message': 'Contato deletado'})

@app.errorhandler(404)
def not_found(error):
    """Tratamento de erro 404"""
    return jsonify({'error': 'Rota não encontrada'}), 404

@app.errorhandler(500)
def internal_error(error):
    """Tratamento de erro 500"""
    return jsonify({'error': 'Erro interno do servidor'}), 500

if __name__ == '__main__':
    print("🚀 Backend Python iniciando em http://localhost:5000")
    print("📝 Documentação da API disponível em /api/docs")
    app.run(debug=True, port=5000, host='0.0.0.0')
