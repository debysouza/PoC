import AddButton from './AddButton';
import BackendStatus from './BackendStatus';
import ChartQtdAlunos from './ChartQtdAlunos';
import InstituicoesTable from './InstituicoesTable';
import './index.css'

const Body = () => {

    return (
        <div className="body">
            <BackendStatus />
            <AddButton />
            <InstituicoesTable />
            <ChartQtdAlunos />
        </div>
    );
}

export default Body;