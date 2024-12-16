// Importa o React, o hook `useState` para gerenciar estados locais e o CSS
import React, { useState } from "react";
import './index.css';

const FormInstituicao = (props) => {
    // Define estados locais para armazenar mensagens de erro dos campos UF e Nome
    const [ufError, setUfError] = useState("");
    const [nomeError, setNomeError] = useState("");

    // Manipula a entrada do campo UF e define mensagens de erro apropriadas quando necessário
    const handleUfChange = (e) => {
        const value = e.target.value.toUpperCase();
        if (/^[A-Z]*$/.test(value) && value.length <= 2) {
            props.setUf(value);
            if (value.length === 2) {
                setUfError("");
            } else {
                setUfError("Por favor, informe um UF válido com 2 letras.");
            }
        } else if (value.trim() === "") {
            props.setUf("");
            setUfError("UF não pode conter espaços.");
        } else {
            setUfError("UF deve conter apenas letras e ter no máximo 2 caracteres.");
        }
    };

    // Manipula a entrada do campo Nome e exibe mensagens de erro se necessário
    const handleNomeChange = (e) => {
        const value = e.target.value.toUpperCase();
        props.setNome(value);
        if (value.length >= 3) {
            setNomeError("");
        } else {
            setNomeError("Por favor, insira, no mínimo, 3 carcteres.");
        }
    };

    // Manipula a entrada do campo Quantidade de Alunos e remove qualquer caractere não numérico antes de atualizar o estado
    const handleQuantidadeAlunosChange = (e) => {
        const rawValue = e.target.value.replace(/\D/g, "");
        props.setQuantidadeAlunos(rawValue);
    };

    // Formata a quantidade de alunos para o padrão brasileiro com separadores de milhar
    const formatQuantidadeAlunos = (value) => {
        if (!value) return "";
        return new Intl.NumberFormat("pt-BR").format(value);
    };

    return (
        <div className="form-container">
            {/* Renderiza o campo Nome com validação e exibição de mensagens de erro */}
            <div className="form-group">
                <label>Nome:</label>
                <input
                    type="text"
                    value={props.nome}
                    onChange={handleNomeChange}
                    placeholder="Digite o nome"
                    minLength={3}
                    maxLength={150}
                />
                {nomeError && <p className="error-message">{nomeError}</p>}
            </div>
            {/* Renderiza o campo UF com validação e exibe mensagens de erro apropriadas */}
            <div className="form-group">
                <label>UF:</label>
                <input
                    type="text"
                    value={props.uf}
                    onChange={handleUfChange}
                    placeholder="Digite a UF"
                    maxLength={2}
                />
                {ufError && <p className="error-message">{ufError}</p>}
            </div>
            {/* Renderiza o campo Quantidade de Alunos com validação e exibe o valor formatado para o padrão brasileiro */}
            <div className="form-group">
                <label>Quantidade de Alunos:</label>
                <input
                    type="text"
                    value={formatQuantidadeAlunos(props.quantidadeAlunos)}
                    onChange={handleQuantidadeAlunosChange}
                    placeholder="Digite a quantidade de alunos"
                    maxLength={11}
                />
            </div>
        </div>
    );
}

export default FormInstituicao;