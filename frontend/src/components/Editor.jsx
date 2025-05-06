import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { Dialog } from '@mui/material';
import availableImages from '../utils/availableImages';

export default function Editor({ tshirt, elStage, tshirtOnChange, setSelected, selected, setModal }) {
    const [openModal, setOpenModal] = useState(false);
    

    function addImageToCanvas(image) {
        tshirtOnChange({
            ...tshirt,
            designs: {
                ...tshirt.designs,
                [tshirt.direction]: [...tshirt.designs[tshirt.direction], { ...image, positions: { x: 0, y: 0, width: image.defaultSize.width, height: image.defaultSize.height, isDragging: false } }]
            }
        });
        setOpenModal(false);
    }

    function changeColor(color) {
        tshirtOnChange({ ...tshirt, color });
    }

    function changeDirection(e) {
        tshirtOnChange({ ...tshirt, direction: e.target.value });
    }

    const captureCanvas = async (direction) => {
        // Simula a mudança de direção para capturar o canvas correto
        const originalDirection = tshirt.direction;
        tshirtOnChange({ ...tshirt, direction });
        
        // Espera um pouco para a renderização ocorrer
        await new Promise(resolve => setTimeout(resolve, 100));
        
        try {
            const canvas = await html2canvas(elStage.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: null
            });
            
            // Restaura a direção original
            tshirtOnChange({ ...tshirt, direction: originalDirection });
            
            return canvas.toDataURL('image/png');
        } catch (error) {
            console.error('Erro ao capturar canvas:', error);
            // Restaura a direção original mesmo em caso de erro
            tshirtOnChange({ ...tshirt, direction: originalDirection });
            return null;
        }
    };

    const downloadImage = (dataUrl, filename) => {
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleAddToCart = async () => {
        // Captura frente e costa
        const frontImage = await captureCanvas('front');
        const backImage = await captureCanvas('back');
        
        if (frontImage) downloadImage(frontImage, 'frente-camiseta.png');
        if (backImage) downloadImage(backImage, 'costa-camiseta.png');
        
        // Prepara os dados para enviar ao backend
        print([frontImage, backImage]);
    };

    const print = (images) => {
        // Esta função será usada para enviar as imagens para o backend
        console.log('Imagens prontas para enviar ao backend:', {
            front: images[0],
            back: images[1]
        });
        
        // Aqui você pode adicionar a lógica para enviar ao backend
        // Por exemplo:
        // api.saveImages(images[0], images[1]).then(...)
    };

    return (
        <div onClick={() => setSelected(false)} className="w-full py-10 lg:py-0 min-h-0 lg:min-h-screen flex items-center justify-center">
            <div className="w-full px-5 lg:px-10">
                <h1 className="mb-5 text-2xl lg:text-5xl font-bold text-gray-800">PROTÓTIPO ESTAMPAS</h1>

                {/* Imagem Inicial */}
                <div className="mb-5">
                    <p className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Escolha sua estampa</p>
                    <div style={{width:100}} className="cursor-pointer border border-gray-200 rounded-lg p-2 inline-block hover:border-blue-500 transition" onClick={() => setOpenModal(true)}>
                        <img src={availableImages[0].preview} alt="Preview" className="w-32 h-auto object-contain" />
                    </div>
                </div>

                {/* Modal para exibir todas as imagens */}
                <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                    <div className="p-5 bg-white rounded-lg">
                        <h2 className="text-lg font-bold mb-4">Selecione uma estampa</h2>
                        <div className="grid grid-cols-3 gap-4">
                            {availableImages.map((image) => (
                                <div key={image.id} className="cursor-pointer border border-gray-200 rounded-lg p-2 hover:border-blue-500 transition" onClick={() => addImageToCanvas(image)}>
                                    <img src={image.preview} alt="Preview" className="w-50 h-auto object-contain" />
                                </div>
                            ))}
                        </div>
                    </div>
                </Dialog>

                {/* Seção de cores */}
                <div className="mb-5">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Colors</label>
                    <div className="flex -m-3">
                        <div onClick={() => changeColor('black')} className="rounded-full m-3 cursor-pointer border-solid border-2 border-gray-700" style={{ width: '50px', height: '50px', background: 'black' }}></div>
                        
                        <div onClick={() => changeColor('white')} className="rounded-full m-3 cursor-pointer border-solid border-2 border-gray-700" style={{ width: '50px', height: '50px', background: 'white' }}></div>

                        <div onClick={() => changeColor('red')} className="rounded-full m-3 cursor-pointer border-solid border-2 border-gray-700" style={{ width: '50px', height: '50px', background: 'red' }}></div>
                    </div>
                </div>

                {/* Seção de direção */}
                <div className="mb-5">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Direction</label>
                    <select onChange={changeDirection} className="appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                        <option value="front">Frente</option>
                        <option value="back">Costa</option>
                    </select>
                </div>

                {/* Botão de adicionar ao carrinho */}
                <div className="mb-5">
                    <button 
                        className="bg-primary w-full rounded-sm text-white p-2 outline-none" 
                        onClick={handleAddToCart}
                    >
                        Adicionar ao carrinho
                    </button>
                </div>
            </div>
        </div>
    );
}