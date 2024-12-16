// Importa dependências React, React Table para exibir os dados em formato tabular, React Bootstrap, o componente de formulário `FormInstituicao`, a URL base para o backend, axios para requisições e CSS
import React, { useState } from 'react';
import { useTable } from 'react-table';
import { Button, Modal } from "react-bootstrap";
import FormInstituicao from '../FormInstituicao';
import backendUrl from '../../../utils/backend-url';
import axios from "axios";
import './index.css';

// Define o componente com estados locais
const InstituicoesTable = ({ instituicoes, onUpdate, onDelete }) => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingInstituicao, setEditingInstituicao] = useState(null);
    const [nome, setNome] = useState("");
    const [uf, setUf] = useState("");
    const [quantidadeAlunos, setQuantidadeAlunos] = useState("");

    // Função para abrir o modal de edição com os dados da instituição selecionada, validando se a instituição possui um ID antes de continuar
    const handleEdit = (instituicao) => {
        if (!instituicao._id) {
            console.error("A instituição selecionada não possui um ID.");
            return;
        }
        setEditingInstituicao(instituicao);
        setNome(instituicao.nome);
        setUf(instituicao.uf);
        setQuantidadeAlunos(instituicao.qtdAlunos);
        setShowEditModal(true);
    };

    // Função para salvar as alterações feitas em uma instituição
    const handleSaveEdit = async () => {
        const errors = [];
        // Valida os dados do formulário antes de enviar ao backend
        if (!nome || nome.trim().length < 3) {
            errors.push("- O nome deve ter pelo menos 3 caracteres!");
        }
        if (nome.trim() !== nome) {
            errors.push("- O nome não pode começar ou terminar com espaços!");
        }
        if (!uf || uf.length !== 2) {
            errors.push("- UF deve ter 2 caracteres!");
        }
        if (quantidadeAlunos === "" || isNaN(parseInt(quantidadeAlunos, 10))) {
            errors.push("- Quantidade de alunos deve ser um número válido!");
        }
        if (errors.length > 0) {
            alert(errors.join("\n"));
            return;
        }
        try {
            // Atualiza a instituição na tabela e fecha o modal em caso de sucesso
            const updatedInstituicao = {
                ...editingInstituicao,
                nome,
                uf,
                qtdAlunos: parseInt(quantidadeAlunos, 10),
            };
            await axios.put(`${backendUrl}/instituicoes/${editingInstituicao._id}`, updatedInstituicao);
            onUpdate(updatedInstituicao);
            setShowEditModal(false);
        } catch (error) {
            console.error("Erro ao atualizar instituição:", error);
            alert("Erro ao atualizar instituição.");
        }
    };    

    // Função para excluir uma instituição com base no ID
    const handleDelete = async (_id) => {
        try {
            await axios.delete(`${backendUrl}/instituicoes/${_id}`);
            onDelete(_id);
        } catch (error) {
            console.error("Erro ao excluir instituição:", error);
        }
    };

    // Define as colunas da tabela, incluindo cabeçalhos, dados exibidos e ações.
    // Formata a quantidade de alunos no padrão brasileiro e configura botões para interagir com cada linha da tabela.
    const columns = React.useMemo(
        () => [
            { Header: "Nome", accessor: "nome" },
            { Header: "UF", accessor: "uf" },
            {
                Header: "Qtd Alunos",
                accessor: "qtdAlunos",
                Cell: ({ value }) => Intl.NumberFormat("pt-BR").format(value),
            },
            {
                Header: "Ações",
                accessor: "acoes",
                Cell: ({ row }) => (
                    <div>
                        <Button variant="warning" onClick={() => handleEdit(row.original)} size="sm">
                            Editar
                        </Button>{" "}
                        <Button variant="danger" onClick={() => handleDelete(row.original._id)} size="sm">
                            Excluir
                        </Button>
                    </div>
                ),
            },
        ],
        []
    );

    // Usa o hook `useTable` para configurar e renderizar os dados da tabela, fornecendo propriedades para os respectivos elementos.
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data: instituicoes });

    return (
        <div className="table-container">
            {/* Renderiza a tabela */}
            <table {...getTableProps()} style={{ width: '100%', maxHeight: '400px', overflowY: 'auto' }}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()} key={`header-${headerGroup.id}`}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()} key={`header-${column.id}`} style={{width: column.id === "nome" ? "50%" : "auto", textAlign: column.id === "nome" ? "left" : "center"}}>
                                    {column.render('Header')}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {/* Configura mensagem de lista vazia */}
                    {rows.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="empty-message">
                                Não há instituições cadastradas.
                            </td>
                        </tr>
                    ) : (
                        rows.map((row, index) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()} key={row.original.id || `row-${index}`}>
                                    {row.cells.map(cell => (
                                        <td {...cell.getCellProps()} key={`cell-${cell.column.id}-${index}`} style={{textAlign: cell.column.id === "nome" ? "left" : "center"}}>
                                            {cell.render('Cell')}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
            {/* Configura o modal para editar as informações de uma instituição */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Instituição</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormInstituicao
                        nome={nome}
                        setNome={setNome}
                        uf={uf}
                        setUf={setUf}
                        quantidadeAlunos={quantidadeAlunos}
                        setQuantidadeAlunos={setQuantidadeAlunos}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Fechar
                    </Button>
                    <Button variant="primary" onClick={handleSaveEdit}>
                        Salvar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default InstituicoesTable;