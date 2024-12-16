import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import FormInstituicao from '../FormInstituicao';
// Importa a URL base para o backend e a biblioteca axios para realizar requisições
import backendUrl from '../../../utils/backend-url';
import axios from "axios";

const AddButton = (props) => {
    const [show, setShow] = useState(false);
    // Define estados locais para armazenar os valores dos campos do formulário
    const [nome, setNome] = useState("");
    const [uf, setUf] = useState("");
    const [quantidadeAlunos, setQuantidadeAlunos] = useState("");

    const handleShow = () => setShow(true);

    const handleClose = () => {
        setShow(false);
        clearForm();
    }

    // Limpa os valores do formulário para evitar dados residuais ao reabrir
    const clearForm = () => {
        setNome("");
        setUf("");
        setQuantidadeAlunos("");
    };

    const handleSave = async () => {
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
            // Verifica a existência da instituição no backend
            const existsResponse = await axios.get(`${backendUrl}/instituicoes/exists`, {
                params: { nome, uf }
            });
            if (existsResponse.data.exists) {
                alert("Uma instituição com este nome e UF já existe!");
                return;
            }
            // Cria a nova instituição, adiciona à lista e fecha o modal
            const data = { nome, uf, qtdAlunos: parseInt(quantidadeAlunos, 10) };
            const response = await axios.post(`${backendUrl}/instituicoes`, data);
            props.onAddInstituicao(response.data);
            handleClose();
        } catch (error) {
            alert("Erro ao salvar instituição.");
        }
    };    

    return (
        <div className="add-button-container">
            <Button variant="success" onClick={handleShow}>
                <FontAwesomeIcon icon={faPlus} /> Nova Instituição
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Nova Instituição</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Renderiza o componente de formulário com os valores e setters para os estados do componente principal */}
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
                    <Button variant="secondary" onClick={handleClose}>
                        Fechar
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Salvar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default AddButton;