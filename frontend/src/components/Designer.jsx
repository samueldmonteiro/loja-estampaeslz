import React from 'react';
import { Stage, Layer, Image, Transformer } from 'react-konva';
import useImage from 'use-image';
import TshirtView from './TshirtColor';

export default function Designer({ tshirt, elStage, tshirtOnChange, selected, setSelected, checkDeselect }) {
  const [pageLoaded, setPageLoaded] = React.useState(false);

  React.useEffect(() => {
    setPageLoaded(true);
  }, []);

  return (
    <div className="w-full bg-primary py-10 lg:py-0 flex min-h-0 lg:min-h-screen justify-center items-center">
      <div id="myDesign" ref={elStage} className="relative p-0 lg:p-10 flex justify-center items-center">
        <Stage
          className="absolute"
          onMouseDown={checkDeselect}
          onTouchStart={checkDeselect}
          width={pageLoaded ? Math.round(40 * elStage.current.clientWidth / 100) : 0}
          height={pageLoaded ? Math.round(55 * elStage.current.clientWidth / 100) : 0}
        >
          <Layer>
            {tshirt.designs[tshirt.direction].map((design, index) => (
              <DesignView
                key={index}
                isSelected={selected === index}
                data={tshirt}
                design={design}
                onSelect={() => setSelected(index)}
                onChange={(updatedDesign) => {
                  const updatedDesigns = [...tshirt.designs[tshirt.direction]];
                  updatedDesigns[index] = updatedDesign;
                  tshirtOnChange({
                    ...tshirt,
                    designs: {
                      ...tshirt.designs,
                      [tshirt.direction]: updatedDesigns,
                    },
                  });
                }}
                zIndex={selected === index ? 100 : 0}  // Controla o zIndex
                width={pageLoaded ? 50 * (Math.round(40 * elStage.current.clientWidth / 100)) / 100 : 0}
              />
            ))}
          </Layer>
        </Stage>
        <TshirtView direction={tshirt.direction} color={tshirt.color} />
      </div>
    </div>
  );
}

const DesignView = ({ isSelected, onSelect, design, onChange, zIndex }) => {
  const [image] = useImage(design.preview, 'Anonymous');
  const shapeRef = React.useRef();
  const trRef = React.useRef();

  React.useEffect(() => {
    if (isSelected) {
      trRef.current.setNode(shapeRef.current);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Image
        ref={shapeRef}
        isSelected={isSelected}
        image={image}
        draggable
        {...design.positions}
        onClick={onSelect}
        onTap={onSelect}
        onDragStart={() => {
          onChange({
            ...design,
            positions: { ...design.positions, isDragging: true },
          });
        }}
        onDragEnd={(e) => {
          onChange({
            ...design,
            positions: {
              ...design.positions,
              isDragging: false,
              x: e.target.x(),
              y: e.target.y(),
            },
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...design,
            positions: {
              ...design.positions,
              x: node.x(),
              y: node.y(),
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(5, node.height() * scaleY),
            },
          });
        }}
        zIndex={zIndex}  // Adiciona zIndex aqui
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) return oldBox;
            return newBox;
          }}
        />
      )}
    </>
  );
};
