// Importa as bibliotecas React, axios para requisições, amCharts para criação do gráfico e o CSS
import React, { useEffect, useImperativeHandle, useState } from 'react';
import axios from "axios";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import backendUrl from '../../../utils/backend-url';
import './index.css';

// Define o componente com uma referência para possibilitar a execução do método `fetchData` a partir de um componente pai
const ChartQtdAlunos = React.forwardRef((props, ref) => {
    // `data` armazena os dados para o gráfico e `hasData` controla se há dados disponíveis
    const [data, setData] = useState([]);
    const [hasData, setHasData] = useState(true);

    // Função para buscar os dados do backend e formatá-los para o gráfico
    const fetchData = async () => {
        try {
            const response = await axios.get(`${backendUrl}/instituicoes/uf-alunos`);
            const formattedData = response.data.map(item => ({
                uf: item._id,
                totalAlunos: item.totalAlunos,
            }));
            setData(formattedData);
            setHasData(formattedData.length > 0);
        } catch (error) {
            console.error("Erro ao buscar dados para o gráfico:", error);
            setHasData(false);
        }
    };

    // Disponibiliza o método `fetchData` para componentes pai usando `ref`
    useImperativeHandle(ref, () => ({
        fetchData,
    }));

    // Chama `fetchData` ao montar o componente para buscar os dados iniciais do gráfico
    useEffect(() => {
        fetchData();
    }, []);

    // Cria o gráfico usando a biblioteca amCharts e aplica o tema animado, com base no https://www.amcharts.com/demos/column-with-rotated-series/
    useEffect(() => {
        const root = am5.Root.new("chartdiv");
        root.setThemes([
            am5themes_Animated.new(root)
        ]);

        const chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panX: true,
                panY: true,
                wheelX: "panX",
                wheelY: "zoomX",
                pinchZoomX: true
            })
        );

        const xAxis = chart.xAxes.push(
            am5xy.CategoryAxis.new(root, {
                categoryField: "uf",
                renderer: am5xy.AxisRendererX.new(root, {
                    minGridDistance: 30
                })
            })
        );
        
        const yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererY.new(root, {})
            })
        );

        const series = chart.series.push(
            am5xy.ColumnSeries.new(root, {
                name: "Alunos",
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "totalAlunos",
                categoryXField: "uf"
            })
        );

        xAxis.data.setAll(data);
        series.data.setAll(data);

        series.appear(1000);
        chart.appear(1000, 100);

        // Adiciona um adaptador para formatar os valores do Total de Alunos dos tooltips exibidos sobre as colunas
        series.columns.template.adapters.add("tooltipText", (tooltipText, target) => {
            const value = target.dataItem?.get("valueY") || 0;
            const formattedValue = new Intl.NumberFormat('pt-BR').format(value);
            return `UF: {categoryX}\nTotal Alunos: ${formattedValue}`;
        });

        series.columns.template.setAll({
            tooltipText: "UF: {categoryX}\nTotal Alunos: {valueY}",
            tooltipEnabled: true
        });
        
        return () => {
            // Garante que os recursos do gráfico sejam liberados quando o componente é desmontado
            root.dispose();
        };
    }, [data]); // Atualiza o gráfico sempre que os dados mudam

    // Renderiza o contêiner do gráfico, incluindo o título, a mensagem de dados ausentes e o espaço para o gráfico
    return (
        <div className='chart-container'>
            <h1>Gráfico de quantidade de alunos por Estado</h1>
            <div className='chart-element'>
                <div id="chartdiv" />
            </div>
            {!hasData && (
                <p className="empty-message">Não há dados disponíveis para exibir no gráfico.</p>
            )}
        </div>
    );
});

export default ChartQtdAlunos;