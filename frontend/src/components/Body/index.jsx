// Importa o React hooks, os componentes reutilizáveis, a URL base do backend, a biblioteca axios para requisições e o CSS
import { useState, useEffect, useRef } from 'react';
import AddButton from './AddButton';
import BackendStatus from './BackendStatus';
import ChartQtdAlunos from './ChartQtdAlunos';
import InstituicoesTable from './InstituicoesTable';
import backendUrl from '../../utils/backend-url';
import axios from "axios";
import './index.css'

// Define o componente principal `Body` com estado para armazenar as instituições e uma referência `chartRef` para interagir com o componente ChartQtdAlunos
const Body = () => {
    const [instituicoes, setInstituicoes] = useState([]);
    const chartRef = useRef();

    // Função assíncrona, com tratamento de erro, para buscar todas as instituições do backend
    const fetchInstituicoes = async () => {
        try {
            const response = await axios.get(`${backendUrl}/instituicoes`);
            setInstituicoes(response.data);
        } catch (error) {
            console.error("Erro ao buscar instituições:", error);
        }
    };

    // Hook que chama `fetchInstituicoes` ao montar o componente para carregar os dados iniciais
    useEffect(() => {
        fetchInstituicoes();
    }, []);

    // Função para atualizar os dados do gráfico, utilizando a referência `chartRef` para chamar o método `fetchData` do componente ChartQtdAlunos
    const updateChart = () => {
        if (chartRef.current) {
            chartRef.current.fetchData();
        }
    };

    // Função para adicionar uma nova instituição à lista, ordenando a lista por UF e atualizando o gráfico após a adição
    const handleAddInstituicao = (novaInstituicao) => {
        setInstituicoes((prev) => {
            const updatedInstituicoes = [...prev, novaInstituicao];
            return updatedInstituicoes.sort((a, b) => a.uf.localeCompare(b.uf));
        });
        updateChart();
    };

    // Função para atualizar uma instituição existente na lista, substituindo a instituição correspondente no estado e atualizando o gráfico
    const handleUpdateInstituicao = (updatedInstituicao) => {
        setInstituicoes((prev) =>
            prev.map((instituicao) =>
                instituicao._id === updatedInstituicao._id ? updatedInstituicao : instituicao
            )
        );
        updateChart();
    };

    // Função para excluir uma instituição da lista, removendo a instituição do estado com base no ID e atualizando o gráfico
    const handleDeleteInstituicao = (_id) => {
        setInstituicoes((prev) => prev.filter((instituicao) => instituicao._id !== _id));
        updateChart();
    };

    return (
        <div className="body">
            <BackendStatus />
            <AddButton onAddInstituicao={handleAddInstituicao} /> {/* Botão para adicionar novas instituições, com a função de callback `handleAddInstituicao` */}
            <InstituicoesTable 
                instituicoes={instituicoes}
                onUpdate={handleUpdateInstituicao}
                onDelete={handleDeleteInstituicao}
            /> {/* Tabela para exibir, atualizar e excluir instituições, com funções de callback correspondentes */}
            <ChartQtdAlunos ref={chartRef} /> {/* Gráfico para exibir a quantidade de alunos por estado, com referência para atualizações */}
        </div>
    );
}

export default Body;