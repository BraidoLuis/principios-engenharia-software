# Caso de Uso: Marcação de Consulta

## Visão Geral

Este documento descreve a implementação do caso de uso "Marcação de Consulta" seguindo os princípios GRASP (General Responsibility Assignment Software Patterns) e os diagramas fornecidos.

## Arquitetura

### Princípios GRASP Aplicados

#### 1. Information Expert
- **CatalogoPaciente**: Conhece como encontrar pacientes
- **CatalogoDisponibilidade**: Conhece como encontrar disponibilidades e médicos
- **Disponibilidade**: Conhece seu próprio estado de reserva
- **MarcaConsultaUI**: Conhece como exibir a interface de marcação

#### 2. Creator
- **MarcaConsultaController**: Cria instâncias de Consulta e Pagamento
- **Paciente**: Participa da criação da consulta (delegado pelo controller)

#### 3. Controller
- **MarcaConsultaController**: Coordena todo o fluxo do caso de uso, conectando catálogos e entidades

#### 4. Low Coupling
- Os componentes interagem através de interfaces bem definidas
- O controller não conhece detalhes de implementação dos catálogos
- A UI só conhece o controller, não as entidades diretamente

#### 5. High Cohesion
- Cada classe tem uma responsabilidade única e bem definida
- CatalogoPaciente apenas gerencia pacientes
- CatalogoDisponibilidade apenas gerencia disponibilidades e recursos relacionados

#### 6. Pure Fabrication
- Os catálogos são serviços artificiais criados para organizar o código
- Não representam conceitos do domínio, mas facilitam a organização

#### 7. Protected Variations
- O uso de Singleton nos catálogos protege contra variações na criação
- Interfaces consistentes protegem mudanças de implementação

## Diagrama de Classes Implementado

\`\`\`
MarcaConsultaController
├── encontra → CatalogoPaciente
│   └── retorna → Paciente
├── encontra → CatalogoDisponibilidade
│   └── retorna → Disponibilidade
└── cria → Consulta + Pagamento
    └── reserva → Disponibilidade
\`\`\`

### Classes Principais

1. **MarcaConsultaController** (`lib/controllers/marca-consulta-controller.ts`)
   - Método: `criarConsulta(codPaciente, codDisp, valor, dataPagam, horaPagam, tipoPagam)`
   - Responsabilidade: Coordenar todo o processo de marcação

2. **CatalogoPaciente** (`lib/catalogues/catalogo-paciente.ts`)
   - Método: `encontraPaciente(codPaciente)`
   - Responsabilidade: Localizar pacientes

3. **CatalogoDisponibilidade** (`lib/catalogues/catalogo-disponibilidade.ts`)
   - Método: `encontraDisponibilidade(codDisp)`
   - Método: `reservaDisponibilidade(codDisp)`
   - Responsabilidade: Gerenciar disponibilidades e recursos médicos

4. **MarcaConsultaUI** (`components/patient/marca-consulta-ui.tsx`)
   - Responsabilidade: Interface do usuário para marcação

## Fluxo de Comunicação

Seguindo o diagrama de comunicação fornecido:

\`\`\`
1. IUMarcaConsulta → MarcaConsultaController.criarConsulta(cP, cD, v, dP, hP, tP)
   
   1.1. MarcaConsultaController → CatalogoPaciente.encontraPaciente(cP)
        ↳ retorna: paciente
   
   1.2. MarcaConsultaController → CatalogoDisponibilidade.encontraDisponibilidade(cD)
        ↳ retorna: disponibilidade
   
   1.3. MarcaConsultaController → criaConsultaParaPaciente()
        
        1.3.1. Cria nova Consulta
               
               1.3.1.1. Cria novo Pagamento
        
        1.3.2. CatalogoDisponibilidade.reservaDisponibilidade(cD)
\`\`\`

## Estrutura de Arquivos

\`\`\`
lib/
├── types/index.ts                          # Definições de tipos do domínio
├── catalogues/
│   ├── catalogo-paciente.ts               # Catálogo de pacientes
│   └── catalogo-disponibilidade.ts        # Catálogo de disponibilidades
├── controllers/
│   └── marca-consulta-controller.ts       # Controller do caso de uso
└── repositories/
    ├── prescricao-repository.ts           # Repositório de prescrições
    └── avaliacao-repository.ts            # Repositório de avaliações

components/
└── patient/
    ├── marca-consulta-ui.tsx              # Interface do usuário
    └── appointments-list.tsx              # Listagem de consultas

docs/
└── CASO_USO_MARCAR_CONSULTA.md           # Esta documentação
\`\`\`

## Como Usar

### 1. Interface do Paciente

O paciente acessa o portal e segue os passos:

1. Selecionar o médico desejado (com especialidade e preço)
2. Escolher a data da consulta
3. Selecionar horário disponível
4. Escolher forma de pagamento (crédito, débito, PIX ou dinheiro)
5. Confirmar o agendamento

### 2. Fluxo de Dados

\`\`\`typescript
// Exemplo de uso do controller
const resultado = marcaConsultaController.criarConsulta(
  "P001",           // codPaciente
  "D001",           // codDisp (código da disponibilidade)
  250.00,           // valor
  "2025-01-15",     // dataPagam
  "10:30",          // horaPagam
  "credito"         // tipoPagam
)

if (resultado.sucesso) {
  console.log("Consulta criada:", resultado.consulta)
} else {
  console.log("Erro:", resultado.mensagem)
}
\`\`\`

## Validações Implementadas

1. Paciente deve existir no catálogo
2. Disponibilidade deve existir no catálogo
3. Disponibilidade não pode estar já reservada
4. Todos os dados de pagamento são obrigatórios
5. Data da consulta deve ser futura

## Próximos Passos

- Integrar com banco de dados real (substituir Maps por queries)
- Adicionar envio de notificações após agendamento
- Implementar confirmação via email
- Adicionar sistema de lembretes automáticos
- Implementar cancelamento e remarcação de consultas

## Benefícios da Arquitetura GRASP

1. **Manutenibilidade**: Fácil localizar e modificar responsabilidades
2. **Testabilidade**: Cada componente pode ser testado isoladamente
3. **Reusabilidade**: Catálogos e controller podem ser reutilizados
4. **Extensibilidade**: Fácil adicionar novos casos de uso
5. **Clareza**: Código organizado e auto-documentado
