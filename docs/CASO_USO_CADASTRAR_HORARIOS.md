# Caso de Uso: Cadastrar Horários de Atendimento

## Descrição
Este caso de uso permite que o médico cadastre, edite e remova seus horários de atendimento, definindo os dias da semana e períodos em que estará disponível para consultas.

## Atores
- **Médico**: usuário que gerencia seus próprios horários de atendimento

## Pré-condições
- O médico deve estar autenticado no sistema
- O médico deve ter um código válido (CodMedico)

## Fluxo Principal
1. O médico acessa o portal do médico
2. O médico navega para a aba "Horários"
3. O sistema exibe os horários já cadastrados
4. O médico preenche os dados do novo horário:
   - Dia da semana
   - Horário de início
   - Horário de fim
5. O médico clica em "Adicionar Horário"
6. O sistema valida os dados
7. O sistema verifica se não há conflito com horários existentes
8. O sistema cadastra o horário
9. O sistema exibe mensagem de sucesso

## Fluxos Alternativos

### FA1: Editar Horário
1. O médico clica no botão de editar em um horário existente
2. O sistema exibe os campos para edição
3. O médico altera os dados desejados
4. O médico clica em "Salvar"
5. O sistema atualiza o horário
6. O sistema exibe mensagem de sucesso

### FA2: Remover Horário
1. O médico clica no botão de remover em um horário existente
2. O sistema remove o horário
3. O sistema exibe mensagem de sucesso

## Fluxos de Exceção

### FE1: Campos obrigatórios não preenchidos
1. O sistema exibe mensagem de erro: "Todos os campos são obrigatórios"
2. O caso de uso retorna ao passo 4

### FE2: Horário de início maior ou igual ao de fim
1. O sistema exibe mensagem de erro: "Horário de início deve ser anterior ao horário de fim"
2. O caso de uso retorna ao passo 4

### FE3: Conflito de horários
1. O sistema exibe mensagem de erro: "Já existe um horário cadastrado neste período"
2. O caso de uso retorna ao passo 4

## Pós-condições
- Novo horário cadastrado no sistema
- Horário disponível para marcação de consultas pelos pacientes

## Regras de Negócio
- RN1: Um médico pode ter múltiplos horários no mesmo dia
- RN2: Horários não podem se sobrepor no mesmo dia
- RN3: Horário de início deve ser anterior ao horário de fim
- RN4: Todos os campos são obrigatórios

## Princípios GRASP Aplicados

### Controller
- **CadastraHorarioController**: coordena todo o fluxo do caso de uso, validando dados e orquestrando a comunicação entre UI e catálogo

### Information Expert
- **CatalogoHorario**: conhece todos os horários e é responsável por buscas, validações de conflito e armazenamento
- **Horario**: conhece seus próprios atributos (Dia, HoraIni, HoraFim)

### Creator
- **CatalogoHorario**: cria novos objetos Horario, pois contém todos os horários do sistema

### Low Coupling
- **CadastraHorarioUI**: depende apenas do controller, não conhece o catálogo diretamente
- **CadastraHorarioController**: usa interface do catálogo, permitindo fácil substituição

### High Cohesion
- **CadastraHorarioController**: focado exclusivamente em operações relacionadas a horários
- **CadastraHorarioUI**: responsável apenas pela interface de cadastro de horários

### Pure Fabrication
- **CatalogoHorario**: classe artificial que não representa conceito do domínio, criada para gerenciar coleção de horários

### Indirection
- **CadastraHorarioController**: atua como intermediário entre UI e catálogo, reduzindo acoplamento

### Protected Variations
- Catálogo isolado do controller por interface, protegendo contra mudanças na implementação de armazenamento

### Polymorphism
- Possibilidade futura de múltiplos tipos de horários (regular, extraordinário, etc.) com comportamentos específicos
