import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import FormInstituicao from '../FormInstituicao';

const AddButton = (props) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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
                    <FormInstituicao />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Fechar
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Salvar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default AddButton;