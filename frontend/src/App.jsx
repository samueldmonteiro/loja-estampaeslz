import React, { useState } from 'react';
import Designer from './components/Designer';
import Editor from './components/Editor';
import { tshirts } from './components/TshirtColor';

/**{
      asset: 'http://localhost:5173/IMG_0348.PNG',
      preview: 'http://localhost:5173/IMG_0348.PNG',
      positions: {
        isDragging: false,
        width: 144,
        height: 139,
        x: 0,
        y: 0
      }
} */


const initial = {
  direction: 'front',
  color: 'white',
  size: 'm',
  designs: {
    front: [],
    back: []
  }
}

function App() {
  const [appLoaded, setAppLoaded] = useState(false);
  const [tshirt, setTshirt] = useState(initial);
  const [selected, setSelected] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    message: 'anjay'
  })
  const elStage = React.useRef();

  // React.useEffect(() => {
  //   // console.log(tshirt)
  // }, [])

  const checkDeselect = e => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelected(false);
    }
  };

  function closeModal() {
    setModal({
      isOpen: false,
      message: null
    })
  }

  React.useEffect(() => {

  }, [])

  React.useEffect(() => {
    if (!appLoaded) {
      // preload images
      for (let i = 0; i < tshirts.length; i++) {
        const pic = tshirts[i];
        const image = new Image()
        image.src = pic
        image.onload = () => {
          // hide loading when the last image has been loaded
          if (i === (tshirts.length - 1)) {
            setAppLoaded(true)
            let fisrtLoad = document.getElementById("fisrtLoad")
            fisrtLoad.classList.add("fade-out")
            setTimeout(() => {
              fisrtLoad.style.display = "none"
            }, 500)
          }
        }

      }
    }
  }, [appLoaded, setAppLoaded])

  return (
    <div className="min-h-screen block lg:flex justify-center items-center" >
      {modal.isOpen && (
        <div className="modal z-10 absolute min-h-screen w-full flex justify-center items-center">
          <div className="z-20 w-1/3 container bg-white p-5 rounded-sm">
            <p className="mb-5">{modal.message}</p>
            <button onClick={() => closeModal()} className="bg-primary w-full rounded-sm text-white p-2 outline-none">ok</button>
          </div>
          <div onClick={() => closeModal()} className="bg-modal min-h-full absolute w-full"></div>
        </div>
      )}
      < Designer selected={selected} setSelected={setSelected} checkDeselect={checkDeselect} elStage={elStage} tshirt={tshirt} tshirtOnChange={setTshirt} />
      <Editor setModal={setModal} selected={selected} setSelected={setSelected} elStage={elStage} tshirt={tshirt} tshirtOnChange={setTshirt} />
    </div>
  );
}

export default App;
